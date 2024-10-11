const express = require('express')

const router = express.Router()
const productController = require('../controller/product.controller')
const adminAuthMiddleware = require('../middlewares/adminAuth.middleware')
const validateRequest = require('../middlewares/validateRequest')
const {upload} = require('../config/cloudinary')
const { createProduct } = require('../utils/validationSchemas')

router.post("/create_product", adminAuthMiddleware, upload.array('images', 5), validateRequest(createProduct), productController.createProduct)
router.post("/creates", adminAuthMiddleware, productController.createMultipleProduct)
router.delete("/:id", adminAuthMiddleware, productController.deleteProduct)
router.put("/update_product/:id", adminAuthMiddleware, upload.array('images', 5),validateRequest(createProduct), productController.updateProduct)

module.exports = router