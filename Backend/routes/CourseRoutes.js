import express from 'express';
import { getAllCourses, getCoursesOfOrganizations, getCourseByInstructor, getCourseByStudent, createCourse, updateCourse, deleteCourse, getCourseById, createLesson, getLessonsByCourse, getLessonById, updateLesson, deleteLesson } from '../controllers/CourseController.js';
import { verifyToken, rbacMiddleware } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Course Routes
router.get('/', verifyToken, getAllCourses);
router.get('/organization-courses', getCoursesOfOrganizations);
router.get('/instructor/:id', verifyToken, getCourseByInstructor);
router.get('/student/:id', verifyToken, getCourseByStudent);
router.post('/', verifyToken, rbacMiddleware(['admin']), createCourse);
router.put('/update/:id', verifyToken, updateCourse);
router.delete('/delete/:id', verifyToken, deleteCourse);
router.get('/:id', verifyToken, getCourseById);

// Lesson Routes
router.post('/:courseId/lessons/add', verifyToken, upload.single('video'), createLesson);
router.get('/:courseId/lessons', verifyToken, getLessonsByCourse);
router.get('/lessons/:id', verifyToken, getLessonById);
router.put('/lessons/update/:id', verifyToken, updateLesson);
router.delete('/lessons/delete/:id', verifyToken, deleteLesson);

export default router;
