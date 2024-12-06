import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_HISTORY_REQUEST,
    GET_ORDER_HISTORY_SUCCESS,
    GET_ORDER_HISTORY_FAILURE,
    GET_ALL_ORDERS_REQUEST,
    GET_ALL_ORDERS_SUCCESS,
    GET_ALL_ORDERS_FAILURE,
    GET_ORDER_STATISTICS_REQUEST,
    GET_ORDER_STATISTICS_SUCCESS,
    GET_ORDER_STATISTICS_FAILURE,
} from "./ActionType"

const initialState = {
    orders: [],
    allOrders: {
        orders: [],
        totalPages: 1,
        currentPage: 1
    },
    order: null,
    loading: false,
    error: null,
    success: false,
    statistics: {
        totalOrders: 0,
        completedOrders: 0,
        remainingOrders: 0,
        dailyRevenue: [],
        totalRevenue: 0
    },
}

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {...state, loading: true, error: null}
        case CREATE_ORDER_SUCCESS:
            return {...state, loading: false, order: action.payload, error: null, success: true}
        case CREATE_ORDER_FAILURE:
            return {...state, loading: false, error: action.payload}
        case GET_ORDER_BY_ID_REQUEST:
            return {...state, loading: true, error: null}
        case GET_ORDER_BY_ID_SUCCESS:
            return {...state, loading: false, order: action.payload, error: null, success: true}
        case GET_ORDER_BY_ID_FAILURE:
            return {...state, loading: false, error: action.payload}
        case GET_ORDER_HISTORY_REQUEST:
            return {...state, loading: true, error: null}
        case GET_ORDER_HISTORY_SUCCESS:
            return {...state, loading: false, orders: action.payload, error: null}
        case GET_ORDER_HISTORY_FAILURE:
            return {...state, loading: false, error: action.payload}
        case GET_ALL_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case GET_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                allOrders: action.payload,
                error: null
            }
        case GET_ALL_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case GET_ORDER_STATISTICS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case GET_ORDER_STATISTICS_SUCCESS:
            return {
                ...state,
                loading: false,
                statistics: action.payload,
                error: null
            }
        case GET_ORDER_STATISTICS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}
