const cartService = require('../services/cart.service')
const Order = require('../models/order.model')
const OrderItem = require('../models/orderItems.model')
const User = require('../models/user.model')
const Cart = require('../models/cart.model')
const CartItem = require('../models/cartItem.model')

async function createOrder(user, shippingAddress, paymentMethod) {
    try {
        let userDoc = await User.findById(user.userId);

        if (!userDoc) {
            throw new Error('User not found');
        }

        const cart = await cartService.findUserCart(userDoc._id)
        if (!cart) {
            throw new Error('Cart not found');
        }

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
            user: userDoc._id,
            orderItems,
            totalPrice: cart.totalPrice,
            totalDiscountedPrice: cart.totalDiscountedPrice,
            discounte: cart.discounte,
            totalItem: cart.totalItem,
            shippingAddress: {
                address: {
                    firstName: shippingAddress.firstName,
                    lastName: shippingAddress.lastName,
                    streetAddress: shippingAddress.streetAddress,
                    city: shippingAddress.city,
                    district: shippingAddress.district,
                    ward: shippingAddress.ward,
                    mobile: shippingAddress.mobile
                }
            },
            paymentDetails: {
                paymentMethod: paymentMethod,
            }
        })

        const saveOrder = await createdOrder.save()
        
        // Xóa toàn bộ cartItems
        await CartItem.deleteMany({ cart: cart._id });

        // Xóa cart
        await Cart.findByIdAndDelete(cart._id);

        await cartService.createCart(userDoc._id);

        return saveOrder
    } catch (error) {
        throw new Error(`Failed to create order: ${error.message}`);
    }
}

async function placeOrder(orderId) {
    try {
        const order = await findOrderById(orderId);
        order.orderStatus = "Placed"
        return await order.save()
    } catch (error) {
        throw new Error(`Failed to place order: ${error.message}`);
    }
}

async function confirmedOrder(orderId) {
    try {
        const order = await findOrderById(orderId);
        order.orderStatus = "Confirmed"
        return await order.save()
    } catch (error) {
        throw new Error(`Failed to confirm order: ${error.message}`);
    }
}

async function shipOrder(orderId) {
    try {
        const order = await findOrderById(orderId);
        order.orderStatus = "Shipped"
        return await order.save()
    } catch (error) {
        throw new Error(`Failed to ship order: ${error.message}`);
    }
}

async function deliverOrder(orderId) {
    try {
        const order = await findOrderById(orderId);
        order.orderStatus = "Delivered"
        return await order.save()
    } catch (error) {
        throw new Error(`Failed to deliver order: ${error.message}`);
    }
}

async function cancelOrder(orderId) {
    try {
        const order = await findOrderById(orderId);
        order.orderStatus = "Cancelled"
        return await order.save()
    } catch (error) {
        throw new Error(`Failed to cancel order: ${error.message}`);
    }
}

async function confirmPayment(orderId) {
    try {
        const order = await findOrderById(orderId);
        order.orderStatus = "Completed Payment"
        return await order.save()
    } catch (error) {
        throw new Error(`Failed to confirm payment: ${error.message}`);
    }
}

async function findOrderById(orderId) {
    try {
        const order = await Order.findById(orderId)
            .populate("user")
            .populate({path: "orderItems",populate:{path: "product"}})
            .populate("shippingAddress")
        if (!order) {
            throw new Error('Order not found');
        }
        return order
    } catch (error) {
        throw new Error(`Failed to find order: ${error.message}`);
    }
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
        throw new Error(`Failed to get user's order history: ${error.message}`);
    }
}

async function getAllOrders() {
    try {
        return await Order.find()
            .populate({path: "orderItems",populate:{path: "product"}})
            .lean()
    } catch (error) {
        throw new Error(`Failed to get all orders: ${error.message}`);
    }
}

async function deleteOrder(orderId) {
    try {
        const order = await findOrderById(orderId)
        await Order.findByIdAndDelete(order._id)
    } catch (error) {
        throw new Error(`Failed to delete order: ${error.message}`);
    }
}

module.exports = {
    createOrder,
    placeOrder,
    confirmedOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    getAllOrders,
    findOrderById,
    deleteOrder,
    usersOrderHistory,
    confirmPayment
}
