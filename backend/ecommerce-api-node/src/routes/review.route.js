const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/review.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const { uploadReview } = require('../config/cloudinary')
const adminAuthMiddleware = require('../middlewares/adminAuth.middleware')

// Upload nhiều ảnh, tối đa 5 ảnh
router.post("/create", authMiddleware, uploadReview.array('images', 5), reviewController.createReview)
router.get("/product/:productId", reviewController.getAllReviews)

// Routes cho admin
router.get("/admin/all", adminAuthMiddleware, reviewController.getAllReviewsAdmin)
router.put("/admin/reply/:reviewId", adminAuthMiddleware, reviewController.replyToReview)
router.patch("/admin/reply/:reviewId", adminAuthMiddleware, reviewController.updateReplyReview)
router.delete("/admin/reply/:reviewId", adminAuthMiddleware, reviewController.deleteReplyReview)

// Thêm route mới
router.get("/search", adminAuthMiddleware, reviewController.findReviewByProduct)

module.exports = router