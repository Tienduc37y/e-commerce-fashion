import axiosInstance from "../../axios/api";
import * as types from "./ActionType";

// Giữ lại getThirdLevelCategory actions
const getThirdLevelCategoryRequest = () => ({type: types.GET_THIRD_LEVEL_CATEGORY})
const getThirdLevelCategorySuccess = (data) => ({type: types.GET_THIRD_LEVEL_CATEGORY_SUCCESS, payload: data})
const getThirdLevelCategoryFailed = (error) => ({type: types.GET_THIRD_LEVEL_CATEGORY_FAILED, payload: error})

export const getThirdLevelCategory = () => async (dispatch) => {
    dispatch(getThirdLevelCategoryRequest());
    try {
        const {data} = await axiosInstance.get(`/api/categories/getThirdLevelCategory`)
        if(data?.status === "200") {
            dispatch(getThirdLevelCategorySuccess(data.categories));
            return data.categories;
        } else {
            const errorMessage = data?.error;
            dispatch(getThirdLevelCategoryFailed(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getThirdLevelCategoryFailed(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

// Actions cho nam
const getMenCategoriesRequest = () => ({type: types.GET_MEN_CATEGORIES});
const getMenCategoriesSuccess = (data) => ({type: types.GET_MEN_CATEGORIES_SUCCESS, payload: data});
const getMenCategoriesFailed = (error) => ({type: types.GET_MEN_CATEGORIES_FAILED, payload: error});

// Actions cho nữ  
const getWomenCategoriesRequest = () => ({type: types.GET_WOMEN_CATEGORIES});
const getWomenCategoriesSuccess = (data) => ({type: types.GET_WOMEN_CATEGORIES_SUCCESS, payload: data});
const getWomenCategoriesFailed = (error) => ({type: types.GET_WOMEN_CATEGORIES_FAILED, payload: error});

export const getMenCategories = () => async (dispatch) => {
    dispatch(getMenCategoriesRequest());
    try {
        const shirts = await axiosInstance.get('/api/categories/men/shirts');
        const pants = await axiosInstance.get('/api/categories/men/pants');
        
        if(shirts.data?.status === "200" && pants.data?.status === "200") {
            const categories = {
                shirts: shirts.data.categories,
                pants: pants.data.categories
            };
            dispatch(getMenCategoriesSuccess(categories));
            return categories;
        }
    } catch (error) {
        dispatch(getMenCategoriesFailed(error.message));
        throw error;
    }
};

export const getWomenCategories = () => async (dispatch) => {
    dispatch(getWomenCategoriesRequest());
    try {
        const shirts = await axiosInstance.get('/api/categories/women/shirts');
        const pants = await axiosInstance.get('/api/categories/women/pants');
        
        if(shirts.data?.status === "200" && pants.data?.status === "200") {
            const categories = {
                shirts: shirts.data.categories,
                pants: pants.data.categories
            };
            dispatch(getWomenCategoriesSuccess(categories));
            return categories;
        }
    } catch (error) {
        dispatch(getWomenCategoriesFailed(error.message));
        throw error;
    }
};

// Thêm actions mới cho Top Level Categories
const getTopLevelCategoryRequest = () => ({type: types.GET_TOP_LEVEL_CATEGORY});
const getTopLevelCategorySuccess = (data) => ({type: types.GET_TOP_LEVEL_CATEGORY_SUCCESS, payload: data});
const getTopLevelCategoryFailed = (error) => ({type: types.GET_TOP_LEVEL_CATEGORY_FAILED, payload: error});

export const getTopLevelCategory = () => async (dispatch) => {
    dispatch(getTopLevelCategoryRequest());
    try {
        const {data} = await axiosInstance.get(`/api/categories/getTopLevelCategory`);
        if(data?.status === "200") {
            dispatch(getTopLevelCategorySuccess(data.categories));
            return data.categories;
        } else {
            const errorMessage = data?.error;
            dispatch(getTopLevelCategoryFailed(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getTopLevelCategoryFailed(error.message));
        throw new Error(error.response?.data?.error || error.message);
    }
};

// Thêm actions cho Second Level Categories
const getSecondLevelCategoryRequest = () => ({type: types.GET_SECOND_LEVEL_CATEGORY});
const getSecondLevelCategorySuccess = (data) => ({type: types.GET_SECOND_LEVEL_CATEGORY_SUCCESS, payload: data});
const getSecondLevelCategoryFailed = (error) => ({type: types.GET_SECOND_LEVEL_CATEGORY_FAILED, payload: error});

export const getSecondLevelCategory = () => async (dispatch) => {
    dispatch(getSecondLevelCategoryRequest());
    try {
        const {data} = await axiosInstance.get(`/api/categories/getSecondLevelCategory`);
        if(data?.status === "200") {
            dispatch(getSecondLevelCategorySuccess(data.categories));
            return data.categories;
        } else {
            const errorMessage = data?.error;
            dispatch(getSecondLevelCategoryFailed(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getSecondLevelCategoryFailed(error.message));
        throw new Error(error.response?.data?.error || error.message);
    }
};