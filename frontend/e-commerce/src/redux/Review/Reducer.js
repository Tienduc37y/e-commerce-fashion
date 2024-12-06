import {
    CREATE_REVIEW_REQUEST,
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAILURE,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAILURE,
    GET_ALL_REVIEWS_ADMIN_REQUEST,
    GET_ALL_REVIEWS_ADMIN_SUCCESS,
    GET_ALL_REVIEWS_ADMIN_FAILURE,
    ADD_RESPONSE_REQUEST,
    ADD_RESPONSE_SUCCESS,
    ADD_RESPONSE_FAILURE,
    UPDATE_REPLY_REQUEST,
    UPDATE_REPLY_SUCCESS,
    UPDATE_REPLY_FAILURE,
    DELETE_REPLY_REQUEST,
    DELETE_REPLY_SUCCESS,
    DELETE_REPLY_FAILURE,
    FIND_REVIEW_BY_PRODUCT,
    FIND_REVIEW_BY_PRODUCT_SUCCESS,
    FIND_REVIEW_BY_PRODUCT_FAILED
} from './ActionType';

const initialState = {
    reviews: [],
    adminReviews: [],
    loading: false,
    error: null,
    success: false
};

export const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_REVIEW_REQUEST:
        case GET_REVIEWS_REQUEST:
        case GET_ALL_REVIEWS_ADMIN_REQUEST:
        case ADD_RESPONSE_REQUEST:
        case UPDATE_REPLY_REQUEST:
        case DELETE_REPLY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case CREATE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true
            };

        case GET_REVIEWS_SUCCESS:
            return {
                ...state,
                loading: false,
                reviews: action.payload.reviews
            };

        case GET_ALL_REVIEWS_ADMIN_SUCCESS:
            return {
                ...state,
                loading: false,
                adminReviews: action.payload.data
            };

        case ADD_RESPONSE_SUCCESS:
        case UPDATE_REPLY_SUCCESS:
        case DELETE_REPLY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true
            };

        case CREATE_REVIEW_FAILURE:
        case GET_REVIEWS_FAILURE:
        case GET_ALL_REVIEWS_ADMIN_FAILURE:
        case ADD_RESPONSE_FAILURE:
        case UPDATE_REPLY_FAILURE:
        case DELETE_REPLY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        case FIND_REVIEW_BY_PRODUCT:
            return { ...state, loading: true };
        case FIND_REVIEW_BY_PRODUCT_SUCCESS:
            return { ...state, adminReviews: action.payload, loading: false };
        case FIND_REVIEW_BY_PRODUCT_FAILED:
            return { ...state, error: action.payload, loading: false };

        default:
            return state;
    }
};
