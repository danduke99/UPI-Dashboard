import { checkJwt } from '../middlewares/jwt';
import { Router } from 'express';
import AuthController from '../Controller/AuthController';

const router = Router();

// login
router.post('/login', AuthController.login);

// Change password
router.post('/change-password', [checkJwt], AuthController.changePassword);

router.put('/forgot-password', AuthController.forgotPassword);

router.put('/new-password', AuthController.createNewPassword);

router.post('/change-password',[checkJwt], AuthController.changePassword);

export default router;