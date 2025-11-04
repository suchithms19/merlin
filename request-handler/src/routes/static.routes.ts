import { Router } from 'express';
import { healthCheck, serveFile } from '../controllers/static.controller';

const router = Router();

router.get('/ping', healthCheck);
router.get('/*splat', serveFile);

export default router;