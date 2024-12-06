import axiosInstance from "../../axios/api"
import { GET_ALL_USER_FAILURE, GET_ALL_USER_REQUESET, GET_ALL_USER_SUCCESS, REMOVE_USER_FAILURE, REMOVE_USER_REQUESET, REMOVE_USER_SUCCESS, FIND_USER_FAILURE, FIND_USER_REQUEST, FIND_USER_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS } from "./ActionType"

const getAllUserRequest = () => ({type:GET_ALL_USER_REQUESET})
const getAllUserSuccess = (users) => ({type:GET_ALL_USER_SUCCESS,payload:users})
const getAllUserFailure = (error) => ({type:GET_ALL_USER_FAILURE,payload:error})

const removeUserRequest = () => ({type:REMOVE_USER_REQUESET})
const removeUserSuccess = () => ({type:REMOVE_USER_SUCCESS})
const removeUserFailure = (error) => ({type:REMOVE_USER_FAILURE,payload:error})

const findUserRequest = () => ({type:FIND_USER_REQUEST})
const findUserSuccess = (user) => ({type:FIND_USER_SUCCESS,payload:user})
const findUserFailure = (error) => ({type:FIND_USER_FAILURE,payload:error})

const updateUserRequest = () => ({type:UPDATE_USER_REQUEST})
const updateUserSuccess = (user) => ({type:UPDATE_USER_SUCCESS,payload:user})
const updateUserFailure = (error) => ({type:UPDATE_USER_FAILURE,payload:error})

export const getAllUsers = (page = 1, limit = 7) => async (dispatch) => {
    dispatch(getAllUserRequest());
    try {
        const res = await axiosInstance.get(`/api/admin/get_all_user?page=${page}&limit=${limit}`);
        if (res.data?.status === "200") {
            dispatch(getAllUserSuccess(res.data));
            return {
                data: res.data.data,
                pagination: res.data.pagination
            };
        } else {
            const errorMessage = res.data?.error;
            dispatch(getAllUserFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(getAllUserFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const deleteUserById = (id) => async (dispatch) => {
    dispatch(removeUserRequest())
    try {
      const res = await axiosInstance.delete(`/api/admin/delete_user/${id}`);
      if (res.data?.status === "200") {
        dispatch(removeUserSuccess())
        dispatch(getAllUsers());
        return null
    } else {
        const errorMessage = res.data?.error;
        dispatch(removeUserFailure(errorMessage));
        throw new Error(errorMessage);
    }
    } catch (error) {
        dispatch(removeUserFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
};

export const findUserByName = (name, page = 1, limit = 7) => async (dispatch) => {
    dispatch(findUserRequest())
    try {
        const res = await axiosInstance.post(`/api/admin/find_user?page=${page}&limit=${limit}`, {
            username: name
        });
        
        if (res.data?.status === "200") {
            dispatch(findUserSuccess(res.data.data))
            return {
                data: res.data.data,
                pagination: res.data.pagination
            };
        } else {
            const errorMessage = res.data?.error || "Không tìm thấy người dùng phù hợp";
            dispatch(findUserFailure(errorMessage));
            return {
                data: [],
                pagination: {
                    currentPage: 1,
                    totalPages: 0,
                    totalItems: 0,
                    itemsPerPage: limit
                }
            };
        }
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Đã xảy ra lỗi khi tìm kiếm người dùng";
        dispatch(findUserFailure(errorMessage));
        throw new Error(errorMessage);
    }
}

export const updateUser = (user) => async (dispatch) => {
    dispatch(updateUserRequest())
    try {
        const res = await axiosInstance.put(`/api/users/update_user/${user.id}`, user);
        if (res.data?.status === "200") {
            const updatedUser = res.data.data;
            if (!updatedUser._id) {
                updatedUser._id = user.id;
            }
            dispatch(updateUserSuccess(updatedUser))
            return { success: true, user: updatedUser };
        } else {
            throw new Error(res.data?.error || "Cập nhật không thành công");
        }
    } catch (error) {
        dispatch(updateUserFailure(error.message));
        return { success: false, error: error.response?.data?.error || error.message };
    }
}   
