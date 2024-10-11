const CartItem = require('../models/cartItem.model')
const userService = require('../services/user.service')

async function updateCartItem(userId, cartItemId, cartItemData) {
    try {
        const item = await findCartItemById(cartItemId)

        if(!item) {
            throw new Error("Không có cart item ", cartItemId)
        }
        const user = await userService.findUserById(item.userId)

        if(!user) {
            throw new Error("User không tồn tại: ", userId)
        }
        if(user._id.toString() === userId.toString()){
            item.quantity = cartItemData.quantity
            item.price = item.quantity * item.product.price
            item.discountedPrice = item.quantity * item.product.discountedPrice

            const updateCartItem = await item.save()
            return updateCartItem
        }
        else {
            throw new Error("Không thể cập nhật lại cartitem")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function removeCartItem(userId, cartItemId) {
    try {
        const cartItem = await findCartItemById(cartItemId)
        const user = await userService.findUserById(userId)

        if (user._id.toString() === cartItem.userId.toString()) {
            // Sử dụng findByIdAndDelete thay vì findByIdAndUpdate
            await CartItem.findByIdAndDelete(cartItemId)
            
            return {
                status: "200",
                message: "Xóa thành công"
            }
        } else {
            throw new Error("Không có quyền xóa cart item này")
        }
    } catch (error) {
        throw new Error(error.message)
    }
}

async function findCartItemById(cartItemId) {
    const cartItem = await CartItem.findById(cartItemId).populate("product");
    if(cartItem) {
        return cartItem
    }
    else {
        throw new Error("Không tìm thấy cart Item: ",cartItemId)
    }
}

module.exports = {updateCartItem, removeCartItem, findCartItemById}