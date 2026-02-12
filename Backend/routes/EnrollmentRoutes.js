import express from 'express';
import {getAllEnrollments,createEnrollment,getEnrollmentById,updateEnrollment,deleteEnrollment} from '../controllers/EnrollmentController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Enrollment Routes
router.get('/', verifyToken, getAllEnrollments);
router.post('/', verifyToken, createEnrollment);
router.get('/:id', verifyToken, getEnrollmentById);
router.put('/:id', verifyToken, updateEnrollment);
router.delete('/delete/:id', verifyToken, deleteEnrollment);

export default router;
