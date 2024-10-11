import axiosInstance from "../../axios/api"
import { GET_CART_REQUEST, GET_CART_SUCCESS, GET_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, ADD_ITEM_TO_CART_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, REMOVE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAILURE } from "./ActionType"

const addItemToCartRequest = () => ({type:ADD_ITEM_TO_CART_REQUEST})
const addItemToCartSuccess = (data) => ({type:ADD_ITEM_TO_CART_SUCCESS,payload:data})
const addItemToCartFailure = (error) => ({type:ADD_ITEM_TO_CART_FAILURE,payload:error})

const removeCartItemRequest = () => ({type:REMOVE_CART_ITEM_REQUEST})
const removeCartItemSuccess = (data) => ({type:REMOVE_CART_ITEM_SUCCESS,payload:data})
const removeCartItemFailure = (error) => ({type:REMOVE_CART_ITEM_FAILURE,payload:error})

const updateCartItemRequest = () => ({type:UPDATE_CART_ITEM_REQUEST})
const updateCartItemSuccess = (data) => ({type:UPDATE_CART_ITEM_SUCCESS,payload:data})
const updateCartItemFailure = (error) => ({type:UPDATE_CART_ITEM_FAILURE,payload:error})

const getCartRequest = () => ({type:GET_CART_REQUEST})
const getCartSuccess = (data) => ({type:GET_CART_SUCCESS,payload:data})
const getCartFailure = (error) => ({type:GET_CART_FAILURE,payload:error})


export const getCart = () => async(dispatch) => {
    dispatch(getCartRequest())
    try {
        const {data} = await axiosInstance.get(`/api/cart/`)
        if(data?.status === "200") {
            dispatch(getCartSuccess(data?.cart))
            return data
        }
        else {
            dispatch(getCartFailure(data.data.error))
            throw new Error(data.data.error)
        }
    }
    catch(error) {
        dispatch(getCartFailure(error.message))
        throw new Error(error.message)
    }
}

export const addItemToCart = (reqData) => async(dispatch) => {
    dispatch(addItemToCartRequest())
    try {
        const {data} = await axiosInstance.put(`/api/cart/add`,reqData)
        if(data?.status === "201") {
            dispatch(addItemToCartSuccess(data))
            return data
        }
        else {
            dispatch(addItemToCartFailure(data?.error))
            throw new Error(data.data.error)
        }
    }
    catch(error) {
        dispatch(addItemToCartFailure(error.message))
        throw new Error(error.message)
    }
}

export const removeCartItem = (reqData) => async(dispatch) => {
    dispatch(removeCartItemRequest())
    try {
        const {data} = await axiosInstance.delete(`/api/cart_items/remove_cart_item/${reqData}`)
        if(data.status === "200") {
            dispatch(removeCartItemSuccess(data))
            return data
        }
        else {
            dispatch(removeCartItemFailure(data.error))
            throw new Error(data.error)
        }
    }
    catch(error) {
        dispatch(removeCartItemFailure(error.message))
        throw new Error(error.message)
    }
}

export const updateCartItem = (reqData) => async(dispatch) => {
    dispatch(updateCartItemRequest())
    try {
        const {data} = await axiosInstance.put(`/api/cart_items/update_cart_item/${reqData.cartItemId}`,{quantity:reqData.quantity})
        if(data?.status === "200") {
            dispatch(updateCartItemSuccess(data))
            return data
        }
        else {
            dispatch(updateCartItemFailure(data.data.error))
            throw new Error(data.data.error)
        }
    }
    catch(error) {
        dispatch(updateCartItemFailure(error.message))
        throw new Error(error.message)
    }
}
