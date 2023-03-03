import { Router } from 'express';
import itemController from '../controller/itemController';
const router = Router();

router.get('/', itemController.getAllItems);
router.post('/', itemController.addNewItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

router.get('/:id', itemController.getItem);

export default router;
