import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

export const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ organization: req.user.organization_id })
            .populate('student', 'username email user_type')
            .populate({
                path: 'course',
                select: 'title instructor',
                populate: { path: 'instructor', select: 'username' }
            })
            .sort({ enrolled_at: -1 });

        const formatted = enrollments.map(e => ({
            id: e._id,
            status: e.status,
            enrolled_at: e.enrolled_at,
            instructor_name: e.course?.instructor?.username || 'Unknown',
            student_name: e.student?.username || 'Unknown',
            user_type: e.student?.user_type,
            student_email: e.student?.email,
            course_title: e.course?.title || 'Unknown'
        }));

        res.json({ details: formatted });
    } catch (err) {
        console.error("getAllEnrollments:", err);
        return res.status(500).json({ error: "Database error" });
    }
};

export const getEnrollmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const enrollment = await Enrollment.findById(id)
            .populate('student', 'username')
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'username' }
            });

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        const result = {
            id: enrollment._id,
            user_id: enrollment.student._id,
            student_name: enrollment.student.username,
            course_id: enrollment.course._id,
            course_title: enrollment.course.title,
            instructor_id: enrollment.course.instructor._id,
            instructor_name: enrollment.course.instructor.username,
            enrolled_at: enrollment.enrolled_at,
            status: enrollment.status
        };

        return res.json({ details: result });
    } catch (err) {
        console.error("getEnrollmentById:", err);
        return res.status(500).json({ error: "Database error" });
    }
};

export const createEnrollment = async (req, res) => {
    const { user_id, course_id, status = "pending" } = req.body;
    const organization_id = req.user.organization_id;

    if (!user_id || !course_id) {
        return res.status(400).json({ message: "Enter required Fields" });
    }

    try {
        const user = await User.findById(user_id);
        if (!user) return res.status(400).json({ message: "User not found" });

        const course = await Course.findById(course_id);
        if (!course) return res.status(400).json({ message: "Course not found" });

        const existing = await Enrollment.findOne({ student: user_id, course: course_id });
        if (existing) {
            return res.status(409).json({ message: "You are already enrolled in this course" });
        }

        const newEnrollment = new Enrollment({
            student: user_id,
            course: course_id,
            organization: organization_id,
            status,
            progress: []
        });

        await newEnrollment.save();

        return res.status(201).json({
            id: newEnrollment._id,
            user_id,
            course_id,
            status
        });
    } catch (err) {
        console.error("createEnrollment:", err);
        return res.status(500).json({ error: "Database error" });
    }
};

export const updateEnrollment = async (req, res) => {
    const { id } = req.params;
    const { user_id, course_id, status } = req.body;

    try {
        const enrollment = await Enrollment.findById(id);
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        if (user_id) enrollment.student = user_id;
        if (course_id) enrollment.course = course_id;
        if (status) enrollment.status = status;

        await enrollment.save();

        return res.json({ message: "Enrollment updated", enrollment });
    } catch (err) {
        console.error("updateEnrollment:", err);
        return res.status(500).json({ error: "Database error" });
    }
};

export const deleteEnrollment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Enrollment.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: "Enrollment not found" });
        return res.json({ message: "Enrollment deleted" });
    } catch (err) {
        console.error("deleteEnrollment:", err);
        return res.status(500).json({ error: "Database error" });
    }
};


export const addProgress = async (req, res) => {
    try {
        const { user_id, lesson_id, status } = req.body;

        const course = await Course.findOne({ "lessons._id": lesson_id });
        if (!course) return res.status(404).json({ message: "Course/Lesson not found" });

        const enrollment = await Enrollment.findOne({ student: user_id, course: course._id });
        if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

        const existingProgress = enrollment.progress.find(p => p.lesson_id.toString() === lesson_id);
        if (existingProgress) {
            return res.status(409).json({ message: 'You have already completed this lesson' });
        }

        enrollment.progress.push({
            lesson_id: lesson_id,
            status: status,
            completed_at: new Date()
        });

        await enrollment.save();
        res.status(201).send({ message: 'Progress added successfully' });

    } catch (error) {
        console.error('Error adding progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getProgressByUser = async (req, res) => {
    try {
        const { user_id, lesson_id } = req.params;
        const course = await Course.findOne({ "lessons._id": lesson_id });
        if (!course) return res.status(200).send({ details: null }); // or 404

        const enrollment = await Enrollment.findOne({ student: user_id, course: course._id });
        if (!enrollment) return res.status(200).send({ details: null });

        const progress = enrollment.progress.find(p => p.lesson_id.toString() === lesson_id);
        res.status(200).send({ details: progress || null });

    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getCourseProgress = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        const course = await Course.findById(course_id);
        if (!course) return res.status(404).send({ message: 'Course not found' });

        const totalLessons = course.lessons.length;
        const isInstructor = (course.instructor.toString() === user_id);

        if (isInstructor) {
            const enrollments = await Enrollment.find({ course: course_id }).populate('student');

            const usersProgress = enrollments.map(e => {
                const completedCount = e.progress.filter(p => p.status).length; // Assuming status is truthy for complete
                return {
                    user_id: e.student._id,
                    username: e.student.username,
                    email: e.student.email,
                    completed: completedCount,
                    total: totalLessons,
                    percent: totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)
                };
            });

            return res.status(200).send({ users: usersProgress });
        } else {
            const enrollment = await Enrollment.findOne({ student: user_id, course: course_id });
            const completedCount = enrollment ? enrollment.progress.filter(p => p.status).length : 0;
            const percent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

            return res.status(200).send({
                details: {
                    user_id,
                    completed: completedCount,
                    total: totalLessons,
                    percent
                }
            });
        }

    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
