const express = require('express')
const authenticate = require('../middlewares/authenticate')
const router = express.Router()
const orderController = require('../controller/adminOrder.controller')

router.get('/',authenticate,orderController.getAllOrders)
router.put('/:orderId/confirmed', authenticate, orderController.confirmedOrders)
router.put('/:orderId/ship', authenticate, orderController.shipOrders)
router.put('/:orderId/deliver', authenticate, orderController.deliverOrders)
router.put('/:orderId/cancel', authenticate, orderController.cancelOrders)
router.put('/:orderId/delete', authenticate, orderController.deleteOrders)

module.exports = router