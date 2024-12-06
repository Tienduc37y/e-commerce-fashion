import * as types from "./ActionType";
import axiosInstance from "../../axios/api";

// Get All Banners
export const getBanners = () => async (dispatch) => {
    dispatch({ type: types.GET_BANNERS_REQUEST });
    try {
        const res = await axiosInstance.get('/api/banners/all');
        if(res.data?.status === "200") {
            dispatch({
                type: types.GET_BANNERS_SUCCESS,
                payload: res.data?.banners
            });
            return res.data;
        } else {
            const errorMessage = res.data?.error;
            dispatch({
                type: types.GET_BANNERS_FAILURE,
                payload: errorMessage
            });
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({
            type: types.GET_BANNERS_FAILURE,
            payload: error.response?.data?.error || error.message
        });
        throw error;
    }
};

// Create Banner
export const createBanner = (formData) => async (dispatch) => {
    dispatch({ type: types.CREATE_BANNER_REQUEST });
    try {
        const res = await axiosInstance.post('/api/banners/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if(res.data?.status === "201") {
            dispatch({
                type: types.CREATE_BANNER_SUCCESS,
                payload: res.data?.banner
            });
            return res.data;
        } else {
            const errorMessage = res.data?.error;
            dispatch({
                type: types.CREATE_BANNER_FAILURE,
                payload: errorMessage
            });
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({
            type: types.CREATE_BANNER_FAILURE,
            payload: error.response?.data?.error || error.message
        });
        throw error;
    }
};

// Update Banner
export const updateBanner = (id, formData) => async (dispatch) => {
    dispatch({ type: types.UPDATE_BANNER_REQUEST });
    try {
        const res = await axiosInstance.put(`/api/banners/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if(res.data?.status === "200") {
            dispatch({
                type: types.UPDATE_BANNER_SUCCESS,
                payload: res.data?.banner
            });
            return res.data;
        } else {
            const errorMessage = res.data?.error;
            dispatch({
                type: types.UPDATE_BANNER_FAILURE,
                payload: errorMessage
            });
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({
            type: types.UPDATE_BANNER_FAILURE,
            payload: error.response?.data?.error || error.message
        });
        throw error;
    }
};

// Delete Banner
export const deleteBanner = (id) => async (dispatch) => {
    dispatch({ type: types.DELETE_BANNER_REQUEST });
    try {
        const res = await axiosInstance.delete(`/api/banners/delete/${id}`);
        if(res.data?.status === "200") {
            dispatch({
                type: types.DELETE_BANNER_SUCCESS,
                payload: id
            });
            return res.data;
        } else {
            const errorMessage = res.data?.error;
            dispatch({
                type: types.DELETE_BANNER_FAILURE,
                payload: errorMessage
            });
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch({
            type: types.DELETE_BANNER_FAILURE,
            payload: error.response?.data?.error || error.message
        });
        throw error;
    }
}; 