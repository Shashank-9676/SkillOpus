import mongoose from 'mongoose';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

const run = async () => {
    try {
        console.log("Verifying Schemas...");

        const orgId = new mongoose.Types.ObjectId();
        const userId = new mongoose.Types.ObjectId();
        const courseId = new mongoose.Types.ObjectId();

        const org = new Organization({ name: 'Test Org' });
        await org.validate();
        console.log("Organization Schema: OK");

        const user = new User({
            username: 'test',
            email: 'test@test.com',
            password: 'pass',
            organization: orgId
        });
        await user.validate();
        console.log("User Schema: OK");

        const course = new Course({
            title: 'Test Course',
            instructor: userId,
            organization: orgId,
            lessons: [{ title: 'Intro', content_url: 'http://url', lesson_order: 1 }]
        });
        await course.validate();
        console.log("Course Schema: OK");

        const enrollment = new Enrollment({
            student: userId,
            course: courseId,
            organization: orgId
        });
        await enrollment.validate();
        console.log("Enrollment Schema: OK");

        console.log("All Schemas Verified Successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Verification Failed:", error.message);
        process.exit(1);
    }
};

run();
