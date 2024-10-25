import { INCREMENT_PRODUCT_VIEW_FAILURE, INCREMENT_PRODUCT_VIEW_REQUEST, INCREMENT_PRODUCT_VIEW_SUCCESS, DELETE_PRODUCT_BY_ID_FAILURE, DELETE_PRODUCT_BY_ID_REQUEST, DELETE_PRODUCT_BY_ID_SUCCESS, FIND_PRODUCT_BY_ID_FAILURE, FIND_PRODUCT_BY_ID_REQUEST, FIND_PRODUCT_BY_ID_SUCCESS, FIND_PRODUCTS_FAILURE, FIND_PRODUCTS_REQUEST, FIND_PRODUCTS_SUCCESS,FIND_PRODUCTS_BY_NAME_FAILURE,FIND_PRODUCTS_BY_NAME_REQUEST,FIND_PRODUCTS_BY_NAME_SUCCESS, CREATE_PRODUCT_FAILURE,CREATE_PRODUCT_REQUEST,CREATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILURE } from "./ActionType"
import axiosInstance from "../../axios/api"

const findProductsRequest = () => ({type: FIND_PRODUCTS_REQUEST})
const findProductsSuccess = (data) => ({type:FIND_PRODUCTS_SUCCESS,payload:data})
const findProductsFailure = (error) => ({type:FIND_PRODUCTS_FAILURE,payload:error})

const findProductsByIdRequest = () => ({type: FIND_PRODUCT_BY_ID_REQUEST})
const findProductsByIdSuccess = (data) => ({type:FIND_PRODUCT_BY_ID_SUCCESS,payload:data})
const findProductsByIdFailure = (error) => ({type:FIND_PRODUCT_BY_ID_FAILURE,payload:error})

const deleteProductsByIdRequest = () => ({type: DELETE_PRODUCT_BY_ID_REQUEST})
const deleteProductsByIdSuccess = () => ({type: DELETE_PRODUCT_BY_ID_SUCCESS})
const deleteProductsByIdFailure = (error) => ({type:DELETE_PRODUCT_BY_ID_FAILURE,payload:error})

const findProductsByNameRequest = () => ({type: FIND_PRODUCTS_BY_NAME_REQUEST})
const findProductsByNameSuccess = (data) => ({type:FIND_PRODUCTS_BY_NAME_SUCCESS,payload:data})
const findProductsByNameFailure = (error) => ({type:FIND_PRODUCTS_BY_NAME_FAILURE,payload:error})

const createProductRequest = () => ({type: CREATE_PRODUCT_REQUEST})
const createProductSuccess = (data) => ({type: CREATE_PRODUCT_SUCCESS, payload: data})
const createProductFailure = (error) => ({type: CREATE_PRODUCT_FAILURE, payload: error})

const updateProductRequest = () => ({type: UPDATE_PRODUCT_REQUEST})
const updateProductSuccess = (data) => ({type: UPDATE_PRODUCT_SUCCESS, payload: data})
const updateProductFailure = (error) => ({type: UPDATE_PRODUCT_FAILURE, payload: error})

const incrementProductViewRequest = () => ({type: INCREMENT_PRODUCT_VIEW_REQUEST})
const incrementProductViewSuccess = (data) => ({type: INCREMENT_PRODUCT_VIEW_SUCCESS, payload: data})
const incrementProductViewFailure = (error) => ({type: INCREMENT_PRODUCT_VIEW_FAILURE, payload: error})

export const findProducts = (reqData) => async(dispatch) => {
    dispatch(findProductsRequest())
    const {colors, sizes, minPrice, maxPrice, minDiscount, topLevelCategory, secondLevelCategory, thirdLevelCategory, stock, sort, pageNumber, pageSize} = reqData
    try {
        const res = await axiosInstance.get(`/api/products?color=${colors}&sizes=${sizes}&minPrice=${minPrice}&maxPrice=${maxPrice}&minDiscount=${minDiscount}&topLevelCategory=${topLevelCategory}&secondLevelCategory=${secondLevelCategory}&thirdLevelCategory=${thirdLevelCategory}&stock=${stock}&sort=${sort}&pageNumber=${pageNumber}&pageSize=${pageSize}`)
        if(res.data?.status === "200") {
            dispatch(findProductsSuccess(res.data?.data?.content))
            return res.data?.data?.content
        }
        else {
            const errorMessage = res.data?.error;
            dispatch(findProductsFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(findProductsFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const findProductsById = (productId) => async(dispatch) => {
    dispatch(findProductsByIdRequest())
    try {
        const {data} = await axiosInstance.get(`/api/products/id/${productId}`)
        if(data?.status === "200") {
            dispatch(findProductsByIdSuccess(data?.products))
            return data
        }
        else {
            const errorMessage = data?.error;
            dispatch(findProductsByIdFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(findProductsByIdFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const deleteProductsById = (productId) => async(dispatch) => {
    dispatch(deleteProductsByIdRequest())
    try {
        const res = await axiosInstance.delete(`/api/admin/products/${productId}`)
        if(res.data?.status === "200") {
            dispatch(deleteProductsByIdSuccess())
            return res.data?.data
        }
        else {
            const errorMessage = res.data?.error;
            dispatch(deleteProductsByIdFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(deleteProductsByIdFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const findProductsByName = (productName) => async(dispatch) => {
    dispatch(findProductsByNameRequest())
    try {
        const res = await axiosInstance.post(`/api/products/find_by_name`, { productName: productName })
        if (res.data?.status === "200") {
            dispatch(findProductsByNameSuccess(res.data?.products))
            return res.data?.products
        } else {
            const errorMessage = res.data?.error || "Không tìm thấy sản phẩm";
            dispatch(findProductsByNameFailure(errorMessage));
            throw new Error(errorMessage);
        }
    }
    catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Đã xảy ra lỗi khi tìm kiếm sản phẩm";
        dispatch(findProductsByNameFailure(errorMessage));
        throw new Error(errorMessage);
    }
}

export const createProduct = (productData) => async(dispatch) => {
    dispatch(createProductRequest())
    try {
        const res = await axiosInstance.post('/api/admin/products/create_product', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (res.data?.status === "201") {
            dispatch(createProductSuccess(res.data?.product))
            return res.data?.product
        } else {
            const errorMessage = res.data?.error;
            dispatch(createProductFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(createProductFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const updateProduct = (productId, productData) => async(dispatch) => {
    dispatch(updateProductRequest())
    try {
        const res = await axiosInstance.put(`/api/admin/products/update_product/${productId}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (res.data?.status === "200") {
            dispatch(updateProductSuccess(res.data?.product));
            return res.data?.product;
        } else {
            const errorMessage = res.data?.error;
            dispatch(updateProductFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(updateProductFailure(error.message));
        throw new Error(error.response?.data?.error || error.message);
    }
};

export const incrementProductView = (productId) => async(dispatch) => {
    dispatch(incrementProductViewRequest())
    try {
        const res = await axiosInstance.post(`/api/products/increment-view/${productId}`)
        if(res.data?.status === "200") {
            dispatch(incrementProductViewSuccess(res.data?.product))
            return res.data?.product
        }
        else {
            const errorMessage = res.data?.error;
            dispatch(incrementProductViewFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(incrementProductViewFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

