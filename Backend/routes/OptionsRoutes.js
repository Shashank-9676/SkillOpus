import express from 'express';
import { getEnrollmentOptions, getOrganizationOptions } from '../controllers/OptionsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/enrollment', verifyToken, getEnrollmentOptions);
router.get('/organizations', getOrganizationOptions); // Public? Or protected? Original didn't seem to check org_id for listing all orgs.

export default router;
