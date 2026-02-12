import express from 'express';
import { getEnrollmentOptions, getOrganizationOptions } from '../controllers/OptionsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/enrollment-options', verifyToken, getEnrollmentOptions);
router.get('/organizations', getOrganizationOptions);

export default router;
