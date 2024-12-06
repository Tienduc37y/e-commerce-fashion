import axiosInstance from '../../axios/api';
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

// Create Review
export const createReview = (reviewData) => async (dispatch) => {
    dispatch({ type: CREATE_REVIEW_REQUEST });
    
    try {
        const token = localStorage.getItem("jwt");
        const formData = new FormData();
        
        // Thêm dữ liệu review vào formData
        formData.append('productId', reviewData.productId);
        formData.append('review', reviewData.description);
        formData.append('rating', reviewData.rating);
        
        // Thêm các file ảnh
        reviewData.images.forEach((image) => {
            formData.append('images', image);
        });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const { data } = await axiosInstance.post('/api/reviews/create', formData, config);
        
        dispatch({
            type: CREATE_REVIEW_SUCCESS,
            payload: data
        });

        return data;
    } catch (error) {
        dispatch({
            type: CREATE_REVIEW_FAILURE,
            payload: error.response?.data?.message || "Có lỗi xảy ra"
        });
        throw error;
    }
};

// Get Product Reviews (for normal users)
export const getProductReviews = (productId) => async (dispatch) => {
    dispatch({ type: GET_REVIEWS_REQUEST });
    
    try {
        const { data } = await axiosInstance.get(`/api/reviews/product/${productId}`);
        
        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data
        });
        
        return data;
    } catch (error) {
        dispatch({
            type: GET_REVIEWS_FAILURE,
            payload: error.response?.data?.message || "Có lỗi xảy ra"
        });
        throw error;
    }
};

// Get All Reviews (for admin)
export const getAllReviewsAdmin = () => async (dispatch) => {
    dispatch({ type: GET_ALL_REVIEWS_ADMIN_REQUEST });
    
    try {
        const { data } = await axiosInstance.get('/api/reviews/admin/all');
        
        dispatch({
            type: GET_ALL_REVIEWS_ADMIN_SUCCESS,
            payload: data
        });
        
        return data;
    } catch (error) {
        dispatch({
            type: GET_ALL_REVIEWS_ADMIN_FAILURE,
            payload: error.response?.data?.message || "Có lỗi xảy ra"
        });
        throw error;
    }
};

// Reply to Review
export const replyToReview = (reviewId, reply) => async (dispatch) => {
    dispatch({ type: ADD_RESPONSE_REQUEST });
    
    try {
        const { data } = await axiosInstance.put(`/api/reviews/admin/reply/${reviewId}`, { reply });
        
        dispatch({
            type: ADD_RESPONSE_SUCCESS,
            payload: data
        });
        
        // Refresh reviews list after reply
        dispatch(getAllReviewsAdmin());
        
        return data;
    } catch (error) {
        dispatch({
            type: ADD_RESPONSE_FAILURE,
            payload: error.response?.data?.message || "Có lỗi xảy ra"
        });
        throw error;
    }
};

export const updateReplyReview = (reviewId, reply) => async (dispatch) => {
    dispatch({ type: UPDATE_REPLY_REQUEST });
    
    try {
        const { data } = await axiosInstance.patch(`/api/reviews/admin/reply/${reviewId}`, { reply });
        
        dispatch({
            type: UPDATE_REPLY_SUCCESS,
            payload: data
        });
        
        // Refresh reviews list
        dispatch(getAllReviewsAdmin());
        
        return data;
    } catch (error) {
        dispatch({
            type: UPDATE_REPLY_FAILURE,
            payload: error.response?.data?.message || "Có lỗi xảy ra"
        });
        throw error;
    }
};

export const deleteReplyReview = (reviewId) => async (dispatch) => {
    dispatch({ type: DELETE_REPLY_REQUEST });
    
    try {
        const { data } = await axiosInstance.delete(`/api/reviews/admin/reply/${reviewId}`);
        
        dispatch({
            type: DELETE_REPLY_SUCCESS,
            payload: data
        });
        
        // Refresh reviews list
        dispatch(getAllReviewsAdmin());
        
        return data;
    } catch (error) {
        dispatch({
            type: DELETE_REPLY_FAILURE,
            payload: error.response?.data?.message || "Có lỗi xảy ra"
        });
        throw error;
    }
};

// Thêm action creators
const findReviewByProductRequest = () => ({ type: FIND_REVIEW_BY_PRODUCT });
const findReviewByProductSuccess = (reviews) => ({ type: FIND_REVIEW_BY_PRODUCT_SUCCESS, payload: reviews });
const findReviewByProductFailed = (error) => ({ type: FIND_REVIEW_BY_PRODUCT_FAILED, payload: error });

// Thêm action function
export const findReviewByProduct = (title) => async (dispatch) => {
    dispatch(findReviewByProductRequest());
    try {
        const response = await axiosInstance.get(`/api/reviews/search?title=${title}`);
        if (response.data?.status === "200") {
            dispatch(findReviewByProductSuccess(response.data.reviews));
            return response.data.reviews;
        } else {
            throw new Error(response.data?.error);
        }
    } catch (error) {
        dispatch(findReviewByProductFailed(error.message));
        throw error;
    }
};
