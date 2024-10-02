const express = require('express')

const router = express.Router()
const productController = require('../controller/product.controller')
const authenticate = require('../middlewares/authenticate')
const adminAuthMiddleware = require('../middlewares/adminAuth.middleware')
const {upload} = require('../config/cloudinary')

router.post("/create_product", adminAuthMiddleware, upload.array('images', 5), productController.createProduct)
router.post("/creates", adminAuthMiddleware, productController.createMultipleProduct)
router.delete("/:id", adminAuthMiddleware, productController.deleteProduct)
router.put("/:id", adminAuthMiddleware, productController.updateProduct)

module.exports = router