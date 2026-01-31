
import express from 'express';
import { createOrganization, getAllOrganizations } from '../controllers/OrganizationController.js';

const router = express.Router();

router.post('/', createOrganization);
router.get('/', getAllOrganizations);

export default router;
