import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

export const getAdminStats = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;

        const [totalUsers, totalCourses, activeUsers, pendingEnrollments] = await Promise.all([
            // Distinct users enrolled? Or just total users in org?
            // Original: SELECT COUNT(DISTINCT user_id) FROM enrollments WHERE organization_id = ?
            Enrollment.distinct('student', { organization: organization_id }),

            Course.countDocuments({ organization: organization_id }),

            // Active users in enrollments
            Enrollment.distinct('student', { status: 'active', organization: organization_id }),

            Enrollment.countDocuments({ status: 'pending', organization: organization_id })
        ]);

        res.json({
            details: {
                totalUsers: totalUsers.length, // Count of distinct IDs
                totalCourses,
                activeUsers: activeUsers.length,
                pendingEnrollments
            }
        });

    } catch (err) {
        console.error("Error fetching admin statistics:", err);
        res.status(500).json({ message: "Error fetching statistics" });
    }
};

export const getInstructorStats = async (req, res) => {
    const instructorId = req.params.id;
    try {
        // totalCourses by instructor
        const totalCourses = await Course.countDocuments({ instructor: instructorId });

        // totalStudents (distinct) in these courses
        // Find courses by instructor, then enrollments in those courses
        const courses = await Course.find({ instructor: instructorId }).select('_id');
        const courseIds = courses.map(c => c._id);

        const totalStudents = await Enrollment.distinct('student', { course: { $in: courseIds } });

        res.json({
            details: {
                totalCourses,
                totalStudents: totalStudents.length
            }
        });
    } catch (err) {
        console.error("Error fetching instructor statistics:", err);
        res.status(500).json({ message: "Error fetching instructor statistics" });
    }
};

export const getStudentStats = async (req, res) => {
    const studentId = req.params.id;
    try {
        const totalCourses = await Enrollment.countDocuments({ student: studentId });
        res.json({ details: { totalCourses } });
    } catch (err) {
        console.error("Error fetching student statistics:", err);
        res.status(500).json({ message: "Error fetching student statistics" });
    }
};

export const getLessonStats = async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId);
        const totalLessons = course ? course.lessons.length : 0;

        const enrolledStudents = await Enrollment.distinct('student', { course: courseId, status: 'active' });

        res.json({
            details: {
                totalLessons,
                enrolledStudents: enrolledStudents.length
            }
        });
    } catch (err) {
        console.error("Error fetching lesson statistics:", err);
        res.status(500).json({ message: "Error fetching lesson statistics" });
    }
};
