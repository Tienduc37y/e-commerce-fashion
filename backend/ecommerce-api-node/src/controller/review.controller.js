const reviewService = require("../services/review.service")

const createReview = async(req, res) => {
    const user = req.user
    try {
        let review = await reviewService.createReview(req.body, user)
        return res.status(201).send({
            status: "201",
            message: "Tạo Review thành công",
            review
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const getAllReviews = async(req, res) => {
    const productId = req.params.productId
    try {
        let reviews = await reviewService.getAllReview(productId)
        return res.status(201).send({
            status: "201",
            message: "Lấy review thành công",
            reviews
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

module.exports = {
    createReview,
    getAllReviews
}