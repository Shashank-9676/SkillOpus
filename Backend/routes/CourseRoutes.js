import express from 'express';
import {
    getAllCourses,
    getCoursesOfOrganizations,
    getCourseByInstructor,
    getCourseByStudent,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    // Lessons
    createLesson,
    getLessonsByCourse,
    getLessonById,
    updateLesson,
    deleteLesson
} from '../controllers/CourseController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// Course Routes
router.get('/', verifyToken, getAllCourses); // All courses for the org
router.get('/organizations', getCoursesOfOrganizations); // Public/Admin?
router.get('/instructor/:id', verifyToken, getCourseByInstructor);
router.get('/student/:id', verifyToken, getCourseByStudent);
router.post('/add', verifyToken, createCourse);
router.put('/update/:id', verifyToken, updateCourse);
router.delete('/delete/:id', verifyToken, deleteCourse);
router.get('/:id', verifyToken, getCourseById);

// Lesson Routes
router.post('/:courseId/lessons/add', verifyToken, createLesson);
router.get('/:courseId/lessons', verifyToken, getLessonsByCourse);
router.get('/lessons/:id', verifyToken, getLessonById); // Note: Original API might have been different
router.put('/lessons/update/:id', verifyToken, updateLesson);
router.delete('/lessons/delete/:id', verifyToken, deleteLesson);

export default router;
