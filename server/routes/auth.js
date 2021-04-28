import express from 'express';
import userController from './../controllers/UserController.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/logout', userController.logout);
router.get('/me', AuthMiddleware, userController.me);

export default router;
