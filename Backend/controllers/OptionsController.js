import User from '../models/User.js';
import Course from '../models/Course.js';
import Organization from '../models/Organization.js';

export const getEnrollmentOptions = async (req, res) => {
    try {
        const organization_id = req.user.organization_id;

        const [students, courses, instructors] = await Promise.all([
            User.find({ user_type: 'student', organization: organization_id }).select('username email'),
            Course.find({ organization: organization_id }).select('title'),
            User.find({ user_type: 'instructor', organization: organization_id }).select('username')
        ]);

        res.json({
            users: students.map(u => ({ value: u._id, label: u.username, email: u.email })),
            courses: courses.map(c => ({ value: c._id, label: c.title })),
            instructors: instructors.map(i => ({ value: i._id, label: i.username }))
        });

    } catch (error) {
        console.error("Error fetching enrollment options:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getOrganizationOptions = async (req, res) => {
    try {
        const orgs = await Organization.find();
        res.json({ details: orgs.map(o => ({ id: o._id, name: o.name })) });
    } catch (error) {
        console.error("Error fetching organization options:", error);
        res.status(500).json({ error: "Server error" });
    }
};