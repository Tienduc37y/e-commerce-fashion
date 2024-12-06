import axiosInstance from "../../axios/api";
import { CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE, GET_ORDER_BY_ID_REQUEST, GET_ORDER_BY_ID_SUCCESS, GET_ORDER_BY_ID_FAILURE, GET_ORDER_HISTORY_REQUEST, GET_ORDER_HISTORY_SUCCESS, GET_ORDER_HISTORY_FAILURE, GET_ALL_ORDERS_REQUEST, GET_ALL_ORDERS_SUCCESS, GET_ALL_ORDERS_FAILURE, GET_ORDER_STATISTICS_REQUEST, GET_ORDER_STATISTICS_SUCCESS, GET_ORDER_STATISTICS_FAILURE } from "./ActionType";

const createOrderRequest = () => ({type: CREATE_ORDER_REQUEST})
const createOrderSuccess = (data) => ({type: CREATE_ORDER_SUCCESS, payload: data})
const createOrderFailure = (error) => ({type: CREATE_ORDER_FAILURE, payload: error})

const getOrderByIdRequest = () => ({type: GET_ORDER_BY_ID_REQUEST})
const getOrderByIdSuccess = (data) => ({type: GET_ORDER_BY_ID_SUCCESS, payload: data})
const getOrderByIdFailure = (error) => ({type: GET_ORDER_BY_ID_FAILURE, payload: error})

const getOrderHistoryRequest = () => ({type: GET_ORDER_HISTORY_REQUEST})
const getOrderHistorySuccess = (data) => ({type: GET_ORDER_HISTORY_SUCCESS, payload: data})
const getOrderHistoryFailure = (error) => ({type: GET_ORDER_HISTORY_FAILURE, payload: error})

const getAllOrdersRequest = () => ({type: GET_ALL_ORDERS_REQUEST})
const getAllOrdersSuccess = (orders) => ({type: GET_ALL_ORDERS_SUCCESS, payload: orders})
const getAllOrdersFailure = (error) => ({type: GET_ALL_ORDERS_FAILURE, payload: error})

const getOrderStatisticsRequest = () => ({
    type: GET_ORDER_STATISTICS_REQUEST
})

const getOrderStatisticsSuccess = (data) => ({
    type: GET_ORDER_STATISTICS_SUCCESS,
    payload: data
})

const getOrderStatisticsFailure = (error) => ({
    type: GET_ORDER_STATISTICS_FAILURE,
    payload: error
})

export const createOrder = (reqData) => async (dispatch) => {
    dispatch(createOrderRequest());
    try {
        const {data} = await axiosInstance.post('/api/orders/', reqData)
        if(data?.status === "201") {
            dispatch(createOrderSuccess(data))
            return data
        }
        else {
            const errorMessage = data.data?.error;
            dispatch(createOrderFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(createOrderFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const getOrderById = (orderId) => async (dispatch) => {
    dispatch(getOrderByIdRequest());
    try {
        const {data} = await axiosInstance.get(`/api/orders/${orderId}`)
        if(data?.status === "200") {
            dispatch(getOrderByIdSuccess(data?.order))
            return data?.order
        }
        else {
            const errorMessage = data.data?.error;
            dispatch(getOrderByIdFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getOrderByIdFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}   

export const getOrderHistory = (page = 1, limit = 8, status = '') => async (dispatch) => {
    dispatch(getOrderHistoryRequest());
    try {
        const url = `/api/orders/user/history?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`;
        const {data} = await axiosInstance.get(url);
        if(data?.status === "200") {
            dispatch(getOrderHistorySuccess(data.data));
            return data.data;
        } else {
            const errorMessage = data.data?.error;
            dispatch(getOrderHistoryFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getOrderHistoryFailure(error.message));
        throw new Error(error.response?.data?.error || error.message);
    }   
}

export const getAllOrders = (page = 1, limit = 8, status = '', sort = '', paymentMethod = '') => async (dispatch) => {
    dispatch(getAllOrdersRequest())
    try {
        let url = `/api/admin/orders?page=${page}&limit=${limit}`;
        
        if (status) {
            url += `&status=${status}`;
        }
        
        if (sort) {
            url += `&sort=${sort}`;
        }

        if (paymentMethod) {
            url += `&paymentMethod=${paymentMethod}`;
        }

        const response = await axiosInstance.get(url);
        
        if(response.data?.status === "200") {
            const ordersData = {
                orders: response.data.orders.orders,
                totalPages: response.data.orders.totalPages,
                currentPage: page,
                totalOrders: response.data.orders.totalOrders,
                limit: response.data.orders.limit
            };
            dispatch(getAllOrdersSuccess(ordersData))
            return ordersData
        } else {
            throw new Error(response.data?.error)
        }
    } catch (error) {
        dispatch(getAllOrdersFailure(error.message))
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const getOrderStatistics = () => async (dispatch) => {
    dispatch(getOrderStatisticsRequest())
    try {
        const response = await axiosInstance.get('/api/admin/orders/statistics')
        if (response.data?.status === "200") {
            dispatch(getOrderStatisticsSuccess(response.data.data))
            return response.data.data
        } else {
            throw new Error(response.data?.error)
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message
        dispatch(getOrderStatisticsFailure(errorMessage))
        throw new Error(errorMessage)
    }
}
