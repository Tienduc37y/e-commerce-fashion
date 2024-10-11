const Cart = require('../models/cart.model')
const CartItem = require('../models/cartItem.model')
const Product = require('../models/product.model')
async function createCart(user) {
    try {
        const cart  = new Cart({user})
        const createdCart = await cart.save()

        return createdCart
    } catch (error) {
        throw new Error(error.message)
    }
}

async function findUserCart(userId) {
    try {
        let cart = await Cart.findOne({user:userId})

        if (!cart) {
            throw new Error("Giỏ hàng không tồn tại")
        }

        let cartItems = await CartItem.find({cart:cart._id}).populate("product")

        cart.cartItems = cartItems

        let totalPrice = 0
        let totalDiscountedPrice = 0
        let totalItem = 0
        
        for(let cartItem of cart.cartItems) {
            totalPrice += cartItem.price
            totalDiscountedPrice += cartItem.discountedPrice
            totalItem += cartItem.quantity
        }

        cart.totalPrice = totalPrice
        cart.totalItem = totalItem
        cart.totalDiscountedPrice = totalDiscountedPrice
        cart.discounte = totalPrice - totalDiscountedPrice

        return cart
    } catch (error) {
        throw new Error(error.message)
    }
}

async function addCartItem(userId, req) {
    try {
        let cart = await Cart.findOne({user: userId})
        if (!cart) {
            cart = await createCart(userId)
        }
        const product = await Product.findById(req.productId)
        if (!product) {
            throw new Error("Sản phẩm không tồn tại")
        }
        
        let cartItem = await CartItem.findOne({
            cart: cart._id, 
            product: product._id, 
            userId,
            size: req.size,
            color: req.color
        })

        if (cartItem) {
            // Nếu sản phẩm đã tồn tại với cùng size và color, cập nhật số lượng
            cartItem.quantity += req.quantity
            await cartItem.save()
        } else {
            // Nếu sản phẩm chưa tồn tại hoặc khác size/color, tạo mới
            cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                quantity: req.quantity,
                color: req.color,
                userId,
                price: product.price,
                size: req.size,
                discountedPrice: product.discountedPrice
            })
            await cartItem.save()
            cart.cartItems.push(cartItem)
            await cart.save()
        }
        return "Sản phẩm đã được thêm vào giỏ hàng"
    } catch (error) {
        throw new Error(error.message)
    }
}
module.exports = {createCart, findUserCart,addCartItem}