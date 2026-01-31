import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { register, login } from '../controllers/AuthController.js';
import { createCourse, createLesson } from '../controllers/CourseController.js';
import { createEnrollment, addProgress } from '../controllers/EnrollmentController.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

dotenv.config();

const mockReq = (body = {}, user = {}, params = {}) => ({ body, user, params });
const mockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.data = data; return res; };
    res.send = (data) => { res.data = data; return res; };
    return res;
};

const runFullTest = async () => {
    try {
        await mongoose.connect(process.env.MONOG_URI);
        console.log("Connected to DB.");

        // Cleanup
        await User.deleteMany({ email: /@testFull/ });
        await Organization.deleteMany({ name: 'Test Org Full' });
        await Course.deleteMany({ title: 'Test Course Full' });
        await Enrollment.deleteMany({ status: 'pending_test' });

        // 1. Register Admin
        const org = new Organization({ name: 'Test Org Full' });
        await org.save();

        const reqReg = mockReq({ username: 'adminFull', email: 'admin@testFull.com', password: 'pass', user_type: 'admin', organization_id: org._id });
        const resReg = mockRes();
        await register(reqReg, resReg);
        const adminId = resReg.data.details._id;

        // 2. Create Course (needs admin context)
        console.log("Creating Course...");
        const reqCourse = mockReq(
            { title: 'Test Course Full', description: 'Desc', level: 'Beginner', instructor_id: adminId, created_by: adminId },
            { user: { organization_id: org._id } } // mock Auth middleware result
        );
        const resCourse = mockRes();
        await createCourse(reqCourse, resCourse);

        if (resCourse.statusCode !== 200) {
            console.error("Course Create Failed", resCourse.data);
        } else {
            console.log("Course Created: PASS");
        }
        const courseId = resCourse.data.details._id;

        // 3. Add Lesson
        console.log("Adding Lesson...");
        const reqLesson = mockReq(
            { title: 'L1', content_url: 'url', lesson_order: 1 },
            { user: { organization_id: org._id } },
            { courseId: courseId }
        );
        const resLesson = mockRes();
        await createLesson(reqLesson, resLesson);
        console.log("Lesson Added: ", resLesson.statusCode === 201 ? "PASS" : "FAIL");

        // 4. Enroll Student
        const reqEnroll = mockReq(
            { user_id: adminId, course_id: courseId, status: 'pending_test' },
            { user: { organization_id: org._id } }
        );
        const resEnroll = mockRes();
        await createEnrollment(reqEnroll, resEnroll);
        console.log("Enrollment: ", resEnroll.statusCode === 201 ? "PASS" : "FAIL");

        console.log("FULL TEST COMPLETED");

        // Cleanup
        await User.deleteMany({ email: /@testFull/ });
        await Organization.deleteMany({ name: 'Test Org Full' });
        await Course.deleteMany({ title: 'Test Course Full' });
        await Enrollment.deleteMany({ status: 'pending_test' });

        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

runFullTest();
