import User from '../models/User.js';
import Course from '../models/Course.js';

export const getAllInstructors = async (req, res) => {
    try {
        // Original: JOIN instructors and users.
        // New: Just Users with user_type = 'instructor'
        const instructors = await User.find({ user_type: 'instructor', organization: req.user.organization_id });

        // We might need to map to match original structure which had `instructor_id` etc.
        // Original returned: id (instructor table id), instructor_id (user id), course_id, department, username...

        // We don't have separate Instructor table IDs. We'll use User ID.
        // We don't have singular `course_id` on instructor anymore (1 instructor -> many courses, or course -> instructor).
        // Original structure implied one instructor -> one course? 
        // "LEFT JOIN instructors i ON ... i.course_id"
        // Wait, `instructors` table had `course_id`. 
        // If we strictly want to support legacy UI expecting `course_id`:
        // We can fetch one course for this instructor and put it there? Or null.
        // Let's verify if we need to return courses.

        // New schema: User has `department`.

        const result = await Promise.all(instructors.map(async (inst) => {
            // Find a course if needed?
            // For now just return user info.
            return {
                id: inst._id, // Use user ID as instructor ID
                instructor_id: inst._id,
                department: inst.department,
                username: inst.username,
                email: inst.email,
                contact: inst.contact
                // course_id: ???
            };
        }));

        res.json({ details: result });

    } catch (err) {
        console.error("Error fetching instructors:", err);
        res.status(500).json({ message: "Error fetching instructors" });
    }
};

export const addInstructor = async (req, res) => {
    try {
        const { instructor_id, department } = req.body; // instructor_id is User ID here

        const user = await User.findById(instructor_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.user_type = 'instructor';
        user.department = department;
        await user.save();

        res.status(201).json({ message: "Instructor added successfully", id: user._id });
    } catch (err) {
        console.error("Error adding instructor:", err);
        res.status(500).json({ message: "Error adding instructor" });
    }
};

// getInstructorById, updateInstructor, deleteInstructor...
// Implementing basics for now.

export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Instructor not found" });

        // Downgrade to student? Or delete user?
        // Original: DELETE FROM instructors. User remained? 
        // "JOIN users u ON i.instructor_id = u.id" - User table separate.
        // So originally it just removed them from Instructors table.
        // We will just set user_type back to 'student' or remove 'department'.

        user.user_type = 'student';
        user.department = undefined;
        await user.save();

        res.json({ message: "Instructor deleted successfully" });
    } catch (err) {
        console.error("Error deleting instructor:", err);
        res.status(500).json({ message: "Error deleting instructor" });
    }
};

// Note: updateInstructor would update department.
