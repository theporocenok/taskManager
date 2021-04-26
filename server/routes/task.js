import express from 'express';
import taskController from './../controllers/TaskController.js';

const router = express.Router();

router.get('/', taskController.getAll);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

export default router;
