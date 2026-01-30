import { Router } from 'express';
import { getClusters } from '../controllers/mongodb.controller';

const router = Router();

// Support both GET and POST for flexibility
router.get('/clusters', getClusters);
router.post('/clusters', getClusters);

export default router;
