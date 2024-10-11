const express = require('express')

const router = express.Router()
const ratingController = require('../controller/rating.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post("/create", authMiddleware, ratingController.createRating)
router.put("/product/:productId", authMiddleware, ratingController.getAllRatings)


module.exports = router