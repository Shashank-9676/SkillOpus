import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

// --- COURSE OPERATIONS ---

export const getAllCourses = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;
        const courses = await Course.find({ organization: organization_id })
            .populate('instructor', 'username')
            .lean(); // Use lean for performance if we just need JSON

        const formattedCourses = courses.map(course => ({
            ...course,
            instructor: course.instructor ? course.instructor.username : 'Unknown',
            instructor_id: course.instructor ? course.instructor._id : null
        }));

        res.status(200).json({ status: "success", details: formattedCourses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export const getCoursesOfOrganizations = async (req, res) => {
    try {
        // Group courses by organization. 
        // Note: This endpoint title is a bit ambiguous in original code but seems to group all courses by org.
        // Assuming this is for a super-admin or public view? The original code grouped by org.    

        const courses = await Course.find().populate('organization', 'name').populate('instructor', 'username');

        // Grouping logic (simplified match to original)
        const orgMap = {};

        courses.forEach(c => {
            const orgId = c.organization._id.toString();
            if (!orgMap[orgId]) {
                orgMap[orgId] = {
                    organization_id: c.organization._id,
                    organization_name: c.organization.name,
                    courses: []
                };
            }
            orgMap[orgId].courses.push({
                id: c._id,
                title: c.title,
                description: c.description,
                category: c.category,
                level: c.level,
                instructor_id: c.instructor._id,
                organization_id: c.organization._id,
                organization_name: c.organization.name
            });
        });

        res.status(200).json({ status: "success", details: Object.values(orgMap) });

    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
};

export const getCourseByInstructor = async (req, res) => {
    const { id } = req.params;
    try {
        const courses = await Course.find({ instructor: id });
        res.json({ details: courses });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCourseByStudent = async (req, res) => {
    const { id } = req.params;
    try {
        // Find enrollments for this student and populate course details
        const enrollments = await Enrollment.find({ student: id })
            .populate({
                path: 'course',
                populate: { path: 'instructor', select: 'username' }
            });

        // Extract course details from enrollments to match original API structure
        const courses = enrollments.map(e => e.course).filter(c => c !== null);

        // Map to match SQL logic which joined users (instructor)
        const result = courses.map(c => {
            const obj = c.toObject();
            // Original SQL returned everything from courses + instructor username/email etc
            // We'll return the course object with embedded instructor info
            return obj;
        });

        res.json({ details: result });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { title, description, category, instructor_id, level, created_by } = req.body;
        const organization_id = req.user.organization_id;

        // Verify creator is admin
        console.log(created_by);
        const creator = await User.findById(created_by);
        if (!creator || creator.user_type !== 'admin') {
            return res.status(403).send({ message: "Only admins can create courses" });
        }

        const newCourse = new Course({
            title,
            description,
            category,
            level,
            instructor: instructor_id,
            organization: organization_id,
            created_by,
            lessons: []
        });

        const savedCourse = await newCourse.save();

        // Update Instructor (User) with department if needed - In SQL there was `instructors` table update.
        // In new schema, Instructor info is on User. 
        // We might want to link the instructor? The schema has `instructor` ref in Course.
        // If we strictly follow the new schema, there is no separate table to update. 
        // But we might want to ensure the User is indeed an instructor.

        res.status(200).send({ message: "Course created successfully!", details: savedCourse });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, level, instructor_id, status } = req.body;
    try {
        const updateData = { title, description };
        if (category) updateData.category = category;
        if (level) updateData.level = level;
        if (instructor_id) updateData.instructor = instructor_id;
        if (status) updateData.status = status;

        const course = await Course.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (course) {
            res.json({ message: "Course updated successfully!", details: course });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        // Cascade delete enrollments?
        // SQL did manual cascade. Mongo Mongoose middleware can do this, but manual is fine here.
        await Enrollment.deleteMany({ course: id });

        const result = await Course.findByIdAndDelete(id);

        if (result) {
            res.json({ message: "Course deleted successfully" });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate('instructor', 'username');
        if (course) {
            const result = course.toObject();
            result.instructor = course.instructor ? course.instructor.username : null;
            res.json({ details: result });
        } else {
            res.status(404).json({ message: "Course not found" });
        }
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// --- LESSON OPERATIONS (Embedded) ---

export const createLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, lesson_order } = req.body;

        let content_url = req.body.content_url;
        if (req.file) {
            content_url = req.file.path;
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const newLesson = {
            title,
            content_url,
            lesson_order,
        };

        course.lessons.push(newLesson);
        await course.save();

        // Get the last added lesson (it has an _id now)
        const addedLesson = course.lessons[course.lessons.length - 1];

        res.status(201).json({
            message: "Lesson created successfully",
            details: { id: addedLesson._id, courseId, title, content_url, lesson_order }
        });
    } catch (error) {
        console.error("Error creating lesson:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getLessonsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById({_id:courseId});
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ details: course.lessons });
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getLessonById = async (req, res) => {
    try {
        // Since lessons are embedded, we need to find the course containing this lesson.
        // Or if we don't know the course ID, we search all courses (less efficient).
        const { id } = req.params;

        const course = await Course.findOne({ "lessons._id": id });

        if (!course) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const lesson = course.lessons.id(id);
        res.json({ details: lesson });
    } catch (error) {
        console.error("Error fetching lesson:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content_url } = req.body;

        const course = await Course.findOne({ "lessons._id": id });
        if (!course) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        const lesson = course.lessons.id(id);
        if (title) lesson.title = title;
        if (content_url) lesson.content_url = content_url;

        await course.save();
        res.json({ message: "Lesson updated successfully" });
    } catch (error) {
        console.error("Error updating lesson:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOne({ "lessons._id": id });

        if (!course) {
            return res.status(404).json({ message: "Lesson not found" });
        }

        course.lessons.pull(id); // Mongoose method to remove subdoc
        await course.save();

        res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
