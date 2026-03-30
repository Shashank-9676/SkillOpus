import express from 'express';
import { getAdminStats, getInstructorStats, getStudentStats, getCourseStats } from '../controllers/StatsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin', verifyToken, getAdminStats);
router.get('/instructor/:id', verifyToken, getInstructorStats);
router.get('/student/:id', verifyToken, getStudentStats);
router.get('/course/:id', verifyToken, getCourseStats);

export default router;
