import { Router } from 'express'
import orderController from '../controller/orderController'

const router = Router()

router.get('/', orderController.getAllOrders)
router.post('/', orderController.addNewOrder)
router.put('/:id', orderController.updateOrder)
router.delete('/:id', orderController.deleteOrder)

router.get('/:id', orderController.getOrder)

export default router
