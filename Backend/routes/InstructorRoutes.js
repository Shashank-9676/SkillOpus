import express from 'express';
import { getAllInstructors, addInstructor, deleteInstructor } from '../controllers/InstructorController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAllInstructors);
router.post('/', verifyToken, addInstructor);
router.delete('/delete/:id', verifyToken, deleteInstructor);

export default router;
