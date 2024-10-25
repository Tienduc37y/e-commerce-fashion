const ratingService = require("../services/rating.service")

const createRating = async(req, res) => {
    const user = req.user
    try {
        let review = await reviewService.createRating(req.body, user)
        return res.status(201).send({
            status: "201",
            message: "Tạo rating thành công",
            review
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const getAllRatings = async(req, res) => {
    const productId = req.params.productId
    try {
        let reviews = await reviewService.getAllRatings(productId)
        return res.status(201).send({
            status: "201",
            message: "lấy Rating thành công",
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
    createRating,
    getAllRatings
}