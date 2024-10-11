const express = require('express')

const router = express.Router()
const cartItemController = require('../controller/cartItem.controller')
const authMiddleware = require('../middlewares/auth.middleware')


router.put('/update_cart_item/:id',authMiddleware,cartItemController.updateCartItem)
router.delete('/remove_cart_item/:id',authMiddleware,cartItemController.removeCartItem)

module.exports = router