import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';

export const register = async (req, res) => {
    try {
        const { username, password, email, user_type = "student", contact, organization_id, department } = req.body;

        // Check user existence
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User (email or username) already exists" });
        }

        if (password.length < 5) {
            return res.status(400).json({ message: "Password is too short" });
        }

        // Validate Organization
        const organization = await Organization.findById(organization_id);
        if (!organization) {
            return res.status(400).json({ message: "Invalid Organization ID" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            user_type,
            contact,
            organization: organization_id,
            department: user_type === 'instructor' ? department : undefined
        });

        await newUser.save();

        res.status(200).json({ message: "User created successfully", details: newUser });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate('organization', 'name');

        if (!user) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const payload = {
            username: user.username,
            role: user.user_type,
            user_id: user._id,
            organization_id: user.organization._id
        };

        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        const userDetails = user.toObject();
        delete userDetails.password;
        if (user.organization) {
            userDetails.org_name = user.organization.name;
        }
        res.status(200).json({
            message: "Login success!",
            token: jwtToken,
            details: userDetails
        });

    } catch (err) {
        console.error("Error logging in DETAILS:", err);
        res.status(500).json({ message: "Error logging in", error: err.toString() });
    }
};


export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('organization');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userDetails = user.toObject();
        delete userDetails.password;

        res.json({ details: userDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};


export const allUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ details: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users" });
    }
};

export const getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ user_type: 'instructor', organization: req.user.organization_id });
        res.json({ details: instructors });

    } catch (err) {
        console.error("Error fetching instructors:", err);
        res.status(500).json({ message: "Error fetching instructors" });
    }
};
