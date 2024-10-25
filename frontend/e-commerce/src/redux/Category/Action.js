import axiosInstance from "../../axios/api";
import { GET_THIRD_LEVEL_CATEGORY, GET_THIRD_LEVEL_CATEGORY_SUCCESS, GET_THIRD_LEVEL_CATEGORY_FAILED } from "./ActionType";
const getThirdLevelCategoryRequest = () => ({type: GET_THIRD_LEVEL_CATEGORY})
const getThirdLevelCategorySuccess = (data) => ({type:GET_THIRD_LEVEL_CATEGORY_SUCCESS,payload:data})
const getThirdLevelCategoryFailed = (error) => ({type:GET_THIRD_LEVEL_CATEGORY_FAILED,payload:error})

export const getThirdLevelCategory = () => async (dispatch) => {
    dispatch(getThirdLevelCategoryRequest());
    try {
        const {data} = await axiosInstance.get(`/api/categories/getThirdLevelCategory`)
        if(data?.status === "200") {
            dispatch(getThirdLevelCategorySuccess(data?.thirdLevelCategories))
            return data
        }
        else {
            const errorMessage = data?.error;
            dispatch(getThirdLevelCategoryFailed(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getThirdLevelCategoryFailed(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}