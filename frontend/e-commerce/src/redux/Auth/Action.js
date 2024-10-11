import axiosInstance from "../../axios/api"
import { removeAccessToken, removeRefreshToken, removeRole, setAccessToken, setRefreshToken, setRole} from "../../utils/authFunction"
import { GET_TOKEN_RESET_PASSWORD_FAILURE, GET_TOKEN_RESET_PASSWORD_REQUEST, GET_TOKEN_RESET_PASSWORD_SUCCESS, GET_USER_FAILURE, GET_USER_REQUESET, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESET, LOGIN_SUCCESS, LOGOUT, REFRESH_TOKEN_FAILURE, REFRESH_TOKEN_REQUESET, REFRESH_TOKEN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUESET, REGISTER_SUCCESS, RESET_PASSWORD_FAILURE, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUESET, CHANGE_PASSWORD_SUCCESS } from "./ActionType"

const loginRequest = () => ({type:LOGIN_REQUESET})
const loginSuccess = (user) => ({type:LOGIN_SUCCESS,payload:user})
const loginFailure = (error) => ({type:LOGIN_FAILURE,payload:error})

const registerRequest = () => ({type:REGISTER_REQUESET})
const registerSuccess = (user) => ({type:REGISTER_SUCCESS,payload:user})
const registerFailure = (error) => ({type:REGISTER_FAILURE,payload:error})

const getUserRequest = () => ({type:GET_USER_REQUESET})
const getUserSuccess = (user) => ({type:GET_USER_SUCCESS,payload:user})
const getUserFailure = (error) => ({type:GET_USER_FAILURE,payload:error})

const getTokenRequest = () => ({type:GET_TOKEN_RESET_PASSWORD_REQUEST})
const getTokenSuccess = () => ({type:GET_TOKEN_RESET_PASSWORD_SUCCESS})
const getTokenFailure = (error) => ({type:GET_TOKEN_RESET_PASSWORD_FAILURE,payload:error})

const resetPasswordRequest = () => ({type:RESET_PASSWORD_REQUEST})
const resetPasswordSuccess = () => ({type:RESET_PASSWORD_SUCCESS})
const resetPasswordFailure = (error) => ({type:RESET_PASSWORD_FAILURE,payload:error})

const refreshTokenRequest = () => ({type:REFRESH_TOKEN_REQUESET})
const refreshTokenSuccess = (user) => ({type:REFRESH_TOKEN_SUCCESS,payload: user})
const refreshTokenFailure = (error) => ({type:REFRESH_TOKEN_FAILURE,payload:error})

const changePasswordRequest = () => ({type:CHANGE_PASSWORD_REQUESET})
const changePasswordSuccess = () => ({type:CHANGE_PASSWORD_SUCCESS})
const changePasswordFailure = (error) => ({type:CHANGE_PASSWORD_FAILURE,payload:error})

const logOut = () => ({type:LOGOUT,payload: null})


export const login = (userData) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const res = await axiosInstance.post('/auth/signin', userData);
        if (res.data?.status === "200") {
            const user = res.data?.data?.user;
            setAccessToken(user?.tokens?.access?.token)
            setRefreshToken(user?.tokens?.refresh?.token)
            setRole(user?.role)
            dispatch(loginSuccess(user));
            return user?.role;
        } else {
            const errorMessage = res.data?.error;
            dispatch(loginFailure(errorMessage));
            throw new Error(errorMessage);
        }
    } catch (error) {
        dispatch(loginFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const register = (userData, isAdminCreating = false) => async (dispatch) => {
    dispatch(registerRequest())
    try {
        const res = await axiosInstance.post(`/auth/signup`, userData)
        if(res.data?.status === "201"){
            const user = res?.data?.data?.user
            if (!isAdminCreating) {
                setAccessToken(user?.tokens?.access?.token)
                setRefreshToken(user?.tokens?.refresh?.token)
                setRole(user?.role)
            }
            dispatch(registerSuccess(user))
            return { success: true, user }
        }
        else {
            dispatch(registerFailure(res.data?.error))
            throw new Error(res.data?.error)
        }
    } catch (error) {
        dispatch(registerFailure(error.message))
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const getUser = () => async (dispatch) => {
    dispatch(getUserRequest())
    try {
        const res = await axiosInstance.get(`/api/users/profile`)
        const user = res?.data?.data?.user

        dispatch(getUserSuccess(user))
    } catch (error) {
        dispatch(getUserFailure(error.message))
    }
}

export const logout = () => (dispatch) => {
    dispatch(logOut())
    removeAccessToken()
    removeRefreshToken()
    removeRole()
}

export const getTokenResetPassword = (email) => async (dispatch) => {
    dispatch(getTokenRequest());
    try {
        if(email){
            const res = await axiosInstance.post('/auth/get-reset-token', { email });
            dispatch(getTokenSuccess())
            return null
        }
        else {
            throw new Error(res?.error)
        }
    } catch (error) {
        dispatch(getTokenFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
};

export const resetPassword = (data) => async (dispatch) => {
    dispatch(resetPasswordRequest());
    try {
        const res = await axiosInstance.post('/auth/reset-password', data);
        dispatch(resetPasswordSuccess())
    } catch (error) {
        dispatch(resetPasswordFailure(error.message));
        throw new Error(error.response?.data?.error || error.message)
    }
};

export const refreshTokenAuth = (token) => async (dispatch) => {
    dispatch(refreshTokenRequest())
    try {
        const res = await axiosInstance.post('/auth/refresh-token',{token: token})
        if(res.data?.status === "200") {
            dispatch(refreshTokenSuccess(res.data?.data?.user))
            return res.data?.data?.user
        }
        else {
            throw new Error(res.data?.error)
        }
    } catch (error) {
        dispatch(refreshTokenFailure(error.message))
        throw new Error(error.response?.data?.error || error.message)
    }
}

export const changePassword = (password) => async (dispatch) => {
    dispatch(changePasswordRequest())
    try {
        const res = await axiosInstance.post('/auth/change-password',password)
        if(res.data?.status === "200") {
            dispatch(changePasswordSuccess())
            return null
        } else {
            throw new Error(res.data?.error)
        }
    } catch (error) {
        dispatch(changePasswordFailure(error.message))
        throw new Error(error.response?.data?.error || error.message)
    }
}


