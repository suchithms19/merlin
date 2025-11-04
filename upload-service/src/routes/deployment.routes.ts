import { Router } from 'express';
import { deploy, getStatus, healthCheck } from '../controllers/deployment.controller';

const router = Router();

router.get('/ping', healthCheck);
router.post('/deploy', deploy);
router.get('/status', getStatus);

export default router;