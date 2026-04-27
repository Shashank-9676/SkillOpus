import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { startInterview, completeInterview, getInterviewHistory, getInterviewSession } from '../controllers/InterviewController.js';

const router = express.Router();

router.post('/start', verifyToken, startInterview);
router.post('/:id/complete', verifyToken, completeInterview);
router.get('/history', verifyToken, getInterviewHistory);
router.get('/:id', verifyToken, getInterviewSession);

export default router;
