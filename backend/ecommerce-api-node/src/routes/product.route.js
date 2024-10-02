const express = require('express')

const router = express.Router()
const productController = require('../controller/product.controller')


router.get("/", productController.getAllProducts)
router.get("/id/:id", productController.findProductById)
router.post("/find_by_name", productController.findProductByName)

module.exports = router