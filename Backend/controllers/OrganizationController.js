
import Organization from '../models/Organization.js';

export const createOrganization = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Organization name is required" });
        }

        const existingOrg = await Organization.findOne({ name });
        if (existingOrg) {
            return res.status(400).json({ message: "Organization already exists" });
        }

        const newOrg = new Organization({
            name,
            description
        });

        await newOrg.save();

        res.status(201).json({ message: "Organization created successfully", details: newOrg });
    } catch (error) {
        console.error("Error creating organization:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find().select('id name');
        res.status(200).json({ details: organizations });
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
