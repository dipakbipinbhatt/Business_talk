import express from 'express';
import { getDeployments, getConfig } from '../controllers/render.controller';

const router = express.Router();

// Get Render configuration (Service IDs)
// GET /api/render/config
router.get('/config', getConfig);

// Proxy route to get deployments from Render
// POST /api/render/deployments
router.post('/deployments', getDeployments);

export default router;
