const cartService = require('../services/cart.service')
const Address = require('../models/address.model')
const Order = require('../models/order.model')
const OrderItem = require('../models/orderItems.model')
async function createOrder(user,shippingAddress) {
    let address 
    if(shippingAddress._id) {
        let existAddress = await Address.findById(shippingAddress._id)
        address = existAddress
    }
    else {
        address = new Address(shippingAddress)
        address.user = user
        await address.save()
        user.address.push(address)
        await user.save()
    }

    const cart = await cartService.findUserCart(user._id)
    const orderItems = []

    for(const item of cart.cartItems) {
        const orderItem = new OrderItem({
            price: item.price,
            product: item.product,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            userId: item.userId,
            discountedPrice: item.discountedPrice
        })
        const createdOrderItem = await orderItem.save()
        orderItems.push(createdOrderItem)
    }
    const createdOrder = new Order({
        user,
        orderItems,
        totalPrice: cart.totalPrice,
        totalDiscountedPrice: cart.totalDiscountedPrice,
        discounte: cart.discounte,
        totalItem: cart.totalItem,
        shippingAddress:address
    })

    const saveOrder = await createdOrder.save()
    return saveOrder
}

async function placeOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "Placed"
    order.paymentDetails.status = "Completed"

    return await order.save()
}

async function confirmedOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "Confirmed"

    return await order.save()
}

async function shipOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "Shipped"

    return await order.save()
}

async function deliverOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "Delivered"

    return await order.save()
}

async function cancelOrder(orderId) {
    const order = await findOrderById(orderId);

    order.orderStatus = "Cancelled"

    return await order.save()
}

async function findOrderById(orderId) {
    const order = await Order.findById(orderId)
    .populate("user")
    .populate({path: "orderItems",populate:{path: "product"}})
    .populate("shippingAddress")

    return order
}

async function usersOrderHistory(userId){
    try {
        const orders = await Order.find({
            user: userId,
            orderStatus: "Placed"
        })
        .populate({
            path: "orderItems",
            populate: {
                path: "product"
            }
        })
        .lean()

        return orders
    } catch (error) {
        throw new Error(error.message)
    }
}

async function getAllOrders() {
    return await Order.find()
    .populate({path: "orderItems",populate:{path: "product"}})
    .lean()
}

async function deleteOrder(orderId) {
    const order = await findOrderById(orderId)
    await Order.findByIdAndDelete(order._id)
}

module.exports = {createOrder, placeOrder, confirmedOrder, shipOrder, deliverOrder, cancelOrder, getAllOrders, findOrderById, deleteOrder,usersOrderHistory}