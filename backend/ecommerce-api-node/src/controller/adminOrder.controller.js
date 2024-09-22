const orderService = require('../services/order.service')

const getAllOrders = async(req, res) => {
    try {
        const orders= await orderService.getAllOrders();
        return res.status(200).send({
            status: "200",
            message: "Lấy thông tin order thành công",
            orders
        })
    } catch (error) {
        return res.status(500).send({
            status:"500",
            error: error.message
        })
    }
}

const confirmedOrders = async(req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.confirmedOrder(orderId);
        return res.status(200).send({
            status: "200",
            message: "Confirm order thành công",
            orders
        })
    } catch (error) {
        return res.status(500).send({
            status:"500",
            error: error.message
        })
    }
}

const shipOrders = async(req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.shipOrder(orderId);
        return res.status(200).send({
            status: "200",
            message: "Ship order thành công",
            orders
        })
    } catch (error) {
        return res.status(500).send({
            status:"500",
            error: error.message
        })
    }
}

const deliverOrders = async(req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.deliverOrder(orderId);
        return res.status(200).send({
            status: "200",
            message: "Deliver order thành công",
            orders
        })
    } catch (error) {
        return res.status(500).send({
            status:"500",
            error: error.message
        })
    }
}

const cancelOrders = async(req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.cancelOrder(orderId);
        return res.status(200).send({
            status: "200",
            message: "Hủy order thành công",
            orders
        })
    } catch (error) {
        return res.status(500).send({
            status:"500",
            error: error.message
        })
    }
}

const deleteOrders = async(req, res) => {
    const orderId = req.params.orderId
    try {
        const orders = await orderService.deleteOrder(orderId);
        return res.status(200).send({
            status: "200",
            message: "Xóa order thành công",
            orders
        })
    } catch (error) {
        return res.status(500).send({
            status:"500",
            error: error.message
        })
    }
}

module.exports = {
    getAllOrders,
    confirmedOrders,
    shipOrders,
    deliverOrders,
    cancelOrders,
    deleteOrders
}