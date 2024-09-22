
const cartService = require('../services/cart.service')

const findUserCart = async (req, res) => {
    const user = req.user
    try {
        const cart = await cartService.findUserCart(user.id)
        return res.status(200).send({
            status: "200",
            message: "thành công",
            cart
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const addItemToCart = async (req, res) => {
    const user = req.user
    try {
        const cartItem = await cartService.addCartItem(user.id, req.body)
        return res.status(200).send({
            status: "200",
            message: "Thêm sản phẩm vào giỏ hàng thành công",
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

module.exports = {
    findUserCart,
    addItemToCart
}
