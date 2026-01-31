import express from 'express';
import {
    getAllEnrollments,
    createEnrollment,
    getEnrollmentById,
    updateEnrollment,
    deleteEnrollment,
    // Progress
    addProgress,
    getProgressByUser,
    getCourseProgress
} from '../controllers/EnrollmentController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Enrollment Routes
router.get('/', verifyToken, getAllEnrollments);
router.post('/add', verifyToken, createEnrollment);
router.get('/:id', verifyToken, getEnrollmentById);
router.put('/update/:id', verifyToken, updateEnrollment);
router.delete('/delete/:id', verifyToken, deleteEnrollment);

// Progress Routes (previously separate/mixed, now part of Enrollment context usually, but keeping paths similar if possible)
// Original paths: /progress/add, /progress/user/:user_id/lesson/:lesson_id, /progress/user/:user_id/course/:course_id

// We can mount these in index.js under /progress or inside here.
// Let's create a separate router export or just handle them here. 
// If mounting under /enrollments/, the paths would change.
// To keep API compatibility, we might need a separate route file or mount this router twice?
// Let's just create a ProgressRoutes or handle it in index.js. 
// I'll export a "ProgressRouter" separately if needed, but for now I'll put them here and maybe redirect in index.js
// Actually, let's just make consistent paths.

// Progress endpoints (mounted under /progress in index.js usually)
// I will create a separate route file for Progress to keep `index.js` clean and match original structure.

export default router;
