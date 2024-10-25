const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()
const orderController = require('../controllers/adminOrder.controller')

router.get('/',authMiddleware,orderController.getAllOrders)
router.put('/:orderId/confirmed', authMiddleware, orderController.confirmedOrders)
router.put('/:orderId/ship', authMiddleware, orderController.shipOrders)
router.put('/:orderId/deliver', authMiddleware, orderController.deliverOrders)
router.put('/:orderId/cancel', authMiddleware, orderController.cancelOrders)
router.put('/:orderId/delete', authMiddleware, orderController.deleteOrders)

module.exports = router