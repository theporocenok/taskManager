import express from 'express';
import userController from './../controllers/UserController.js';

const router = express.Router();

router.get('/', userController.getSubordinatesList);

export default router;
