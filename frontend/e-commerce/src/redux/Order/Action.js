import axiosInstance from "../../axios/api";
import { CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE, GET_ORDER_BY_ID_REQUEST, GET_ORDER_BY_ID_SUCCESS, GET_ORDER_BY_ID_FAILURE, GET_ORDER_HISTORY_REQUEST, GET_ORDER_HISTORY_SUCCESS, GET_ORDER_HISTORY_FAILURE } from "./ActionType";

const createOrderRequest = () => ({type: CREATE_ORDER_REQUEST})
const createOrderSuccess = (data) => ({type: CREATE_ORDER_SUCCESS, payload: data})
const createOrderFailure = (error) => ({type: CREATE_ORDER_FAILURE, payload: error})

const getOrderByIdRequest = () => ({type: GET_ORDER_BY_ID_REQUEST})
const getOrderByIdSuccess = (data) => ({type: GET_ORDER_BY_ID_SUCCESS, payload: data})
const getOrderByIdFailure = (error) => ({type: GET_ORDER_BY_ID_FAILURE, payload: error})

const getOrderHistoryRequest = () => ({type: GET_ORDER_HISTORY_REQUEST})
const getOrderHistorySuccess = (data) => ({type: GET_ORDER_HISTORY_SUCCESS, payload: data})
const getOrderHistoryFailure = (error) => ({type: GET_ORDER_HISTORY_FAILURE, payload: error})

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
            dispatch(getOrderByIdSuccess(data))
            return data
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
