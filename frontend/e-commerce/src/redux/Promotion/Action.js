import axiosInstance from "../../axios/api";
import * as types from "./ActionType";

// Get All Promotions
export const getPromotions = (page = 1, limit = 7) => async (dispatch) => {
    dispatch({ type: types.GET_PROMOTIONS_REQUEST });
    try {
        const res = await axiosInstance.get(`/api/promotions/all?page=${page}&limit=${limit}`);
        if(res.data?.status === "200") {
            dispatch({type: types.GET_PROMOTIONS_SUCCESS, payload: res.data?.data})
            return res.data?.data;
        }
        else {
            const errorMessage = res.data?.error;
            dispatch({type: types.GET_PROMOTIONS_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.GET_PROMOTIONS_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw error;
    }
};

// Apply Promotion
export const applyPromotion = (code) => async (dispatch) => {
    dispatch({ type: types.APPLY_PROMOTION_REQUEST });
    try {
        const res = await axiosInstance.post('/api/promotions/apply', { code });
        if(res.data?.status === "200") {
            dispatch({type: types.APPLY_PROMOTION_SUCCESS, payload: res.data?.data})
            return res.data?.data
        }
        else {
            const errorMessage = res.data?.error;
            dispatch({type: types.APPLY_PROMOTION_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.APPLY_PROMOTION_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw new Error(error.response?.data?.error || error.message );
    }
};

// Remove Promotion from Cart
export const removePromotion = (code) => async (dispatch) => {
    dispatch({ type: types.REMOVE_PROMOTION_REQUEST });
    try {
        const res = await axiosInstance.post('/api/promotions/remove', { code });
        if(res.data?.status === "200") {
            dispatch({type: types.REMOVE_PROMOTION_SUCCESS, payload: res.data?.data})
            return res.data?.data
        }
        else {
            const errorMessage = res.data?.error;
            dispatch({type: types.REMOVE_PROMOTION_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.REMOVE_PROMOTION_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw new Error(error.response?.data?.error || error.message );
    }
};

// Create New Promotion
export const createPromotion = (promotionData) => async (dispatch) => {
    dispatch({ type: types.CREATE_PROMOTION_REQUEST });
    try {
        const res = await axiosInstance.post('/api/promotions/create', promotionData);
        if(res.data?.status === "201") {
            dispatch({
                type: types.CREATE_PROMOTION_SUCCESS, 
                payload: res.data.data
            });
            return {
                success: true,
                data: res.data
            };
        } else {
            const errorMessage = res.data?.error || 'Tạo mã giảm giá thất bại';
            dispatch({
                type: types.CREATE_PROMOTION_FAILURE, 
                payload: errorMessage
            });
            return {
                success: false,
                error: errorMessage
            };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message;
        dispatch({ 
            type: types.CREATE_PROMOTION_FAILURE, 
            payload: errorMessage
        });
        return {
            success: false,
            error: errorMessage
        };
    }
};

// Update Promotion
export const updatePromotion = (id, updateData) => async (dispatch) => {
    dispatch({ type: types.UPDATE_PROMOTION_REQUEST });
    try {
        const res = await axiosInstance.put(`/api/promotions/update/${id}`, updateData);
        if(res.data?.status === "200") {
            dispatch({type: types.UPDATE_PROMOTION_SUCCESS, payload: res.data?.data})
            return res.data?.data
        }
        else {
            const errorMessage = res.data?.error;
            dispatch({type: types.UPDATE_PROMOTION_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.UPDATE_PROMOTION_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw new Error(error.response?.data?.error || error.message );
    }
};

// Delete Promotion
export const deletePromotion = (id) => async (dispatch) => {
    dispatch({ type: types.DELETE_PROMOTION_REQUEST });
    try {
        const res = await axiosInstance.delete(`/api/promotions/delete/${id}`);
        if(res.data?.status === "200") {
            dispatch({type: types.DELETE_PROMOTION_SUCCESS, payload: id})
            return res.data?.data
        }
        else {
            const errorMessage = res.data?.error;
            dispatch({type: types.DELETE_PROMOTION_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.DELETE_PROMOTION_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw new Error(error.response?.data?.error || error.message );
    }
};

// Toggle Visibility
export const toggleVisibility = (id) => async (dispatch) => {
    dispatch({ type: types.TOGGLE_VISIBILITY_REQUEST });
    try {
        const res = await axiosInstance.patch(`/api/promotions/toggle-visibility/${id}`);
        if(res.data?.status === "200") {
            dispatch({type: types.TOGGLE_VISIBILITY_SUCCESS, payload: res.data?.data})
            return res.data?.data
        }
        else {
            const errorMessage = res.data?.error;
            dispatch({type: types.TOGGLE_VISIBILITY_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.TOGGLE_VISIBILITY_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw new Error(error.response?.data?.error || error.message );
    }
};

// Find Promotion by Code
export const findPromotionByCode = (code, page = 1, limit = 7) => async (dispatch) => {
    dispatch({ type: types.FIND_PROMOTION_REQUEST });
    try {
        const res = await axiosInstance.get(`/api/promotions/find/${code}?page=${page}&limit=${limit}`);
        if(res.data?.status === "200") {
            dispatch({type: types.FIND_PROMOTION_SUCCESS, payload: res.data?.data});
            return res.data?.data;
        } else {
            const errorMessage = res.data?.error;
            dispatch({type: types.FIND_PROMOTION_FAILURE, payload: errorMessage});
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({ 
            type: types.FIND_PROMOTION_FAILURE, 
            payload: error.response?.data?.error || error.message 
        });
        throw new Error(error.response?.data?.error || error.message );
    }
};

