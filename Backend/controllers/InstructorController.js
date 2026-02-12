import User from '../models/User.js';
import Course from '../models/Course.js';

export const getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ user_type: 'instructor', organization: req.user.organization_id });
        res.json({ details: instructors });

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

export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "Instructor not found" });
        user.user_type = 'student';
        user.department = undefined;
        await user.save();

        res.json({ message: "Instructor deleted successfully" });
    } catch (err) {
        console.error("Error deleting instructor:", err);
        res.status(500).json({ message: "Error deleting instructor" });
    }
};