import express from 'express';
import {
    addProgress,
    getProgressByUser,
    getCourseProgress
} from '../controllers/EnrollmentController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', verifyToken, addProgress);
router.get('/lesson/:lesson_id/user/:user_id', verifyToken, getProgressByUser);
router.get('/course/:course_id/user/:user_id', verifyToken, getCourseProgress);

export default router;
