import { Router } from 'express';
import * as userController from '../controllers/userController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/register', userController.register);
router.get('/', requireAuth, userController.getUsers);

export default router;
