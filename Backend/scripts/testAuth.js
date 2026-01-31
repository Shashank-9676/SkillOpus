import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { register, login } from '../controllers/AuthController.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';

dotenv.config();

// Mock Request/Response
const mockReq = (body = {}, headers = {}) => ({ body, headers });
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

const runTests = async () => {
    try {
        await mongoose.connect(process.env.MONOG_URI);
        console.log("Connected to DB for testing");

        // Cleanup
        await User.deleteMany({ email: 'testauth@example.com' });
        await Organization.deleteMany({ name: 'Auth Test Org' });

        // Setup Org
        const org = new Organization({ name: 'Auth Test Org' });
        await org.save();

        console.log("Testing Register...");
        const reqRegister = mockReq({
            username: 'testauth',
            email: 'testauth@example.com',
            password: 'password123',
            organization_id: org._id
        });
        const resRegister = mockRes();
        await register(reqRegister, resRegister);

        if (resRegister.statusCode === 200 && resRegister.data.message === "User created successfully") {
            console.log("Register: PASS");
        } else {
            console.error("Register: FAIL", resRegister.data);
            process.exit(1);
        }

        console.log("Testing Login...");
        const reqLogin = mockReq({
            email: 'testauth@example.com',
            password: 'password123'
        });
        const resLogin = mockRes();
        await login(reqLogin, resLogin);

        if (resLogin.statusCode === 200 && resLogin.data.token) {
            console.log("Login: PASS. Token received.");
        } else {
            console.error("Login: FAIL", resLogin.data);
            process.exit(1);
        }

        console.log("All Auth Tests Passed.");

        // Cleanup
        await User.deleteMany({ email: 'testauth@example.com' });
        await Organization.deleteMany({ name: 'Auth Test Org' });

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Test Error:", error);
        process.exit(1);
    }
};

runTests();
