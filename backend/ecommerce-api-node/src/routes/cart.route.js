const express = require('express')

const router = express.Router()
const cartController = require('../controller/cart.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/',authMiddleware,cartController.findUserCart)
router.put('/add',authMiddleware,cartController.addItemToCart)

module.exports = router