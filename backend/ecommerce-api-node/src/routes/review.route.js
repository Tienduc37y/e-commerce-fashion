const express = require('express')

const router = express.Router()
const reviewController = require('../controllers/review.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post("/create", authMiddleware, reviewController.createReview)
router.get("/product/:productId", authMiddleware, reviewController.getAllReviews)


module.exports = router