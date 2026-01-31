import express from 'express';
import {
    addProgress,
    getProgressByUser,
    getCourseProgress
} from '../controllers/EnrollmentController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/add', verifyToken, addProgress);
router.get('/user/:user_id/lesson/:lesson_id', verifyToken, getProgressByUser);
router.get('/user/:user_id/course/:course_id', verifyToken, getCourseProgress);

export default router;
