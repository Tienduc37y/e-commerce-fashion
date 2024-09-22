const orderService = require('../services/order.service')

const createOrder = async(req, res) => {
    const user = await req.user
    try {
        let createdOrder = await orderService.createOrder(user, req.body)
        return res.status(201).send({
            status: "201",
            message: "Tạo order thành công",
            createdOrder
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const findOrderById = async(req, res) => {
    const user = await req.user
    try {
        let createdOrder = await orderService.findOrderById(req.params.id)
        return res.status(201).send({
            status: "201",
            message: "Tìm order thành công",
            createdOrder
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

const orderHistory = async(req, res) => {
    const user = await req.user
    try {
        let createdOrder = await orderService.usersOrderHistory(user._id)
        return res.status(201).send({
            status: "201",
            message: "Lấy order thành công",
            createdOrder
        })
    } catch (error) {
        return res.status(500).send({
            status: "500",
            error: error.message
        })
    }
}

module.exports = {
    createOrder,
    findOrderById,
    orderHistory
}