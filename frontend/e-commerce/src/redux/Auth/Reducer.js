import { CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUESET, CHANGE_PASSWORD_SUCCESS, GET_TOKEN_RESET_PASSWORD_FAILURE, GET_TOKEN_RESET_PASSWORD_REQUEST, GET_TOKEN_RESET_PASSWORD_SUCCESS, GET_USER_FAILURE, GET_USER_REQUESET, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUESET, LOGIN_SUCCESS, LOGOUT, REFRESH_TOKEN_FAILURE, REFRESH_TOKEN_REQUESET, REFRESH_TOKEN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUESET, REGISTER_SUCCESS, RESET_PASSWORD_REQUEST, UPDATE_ADDRESS_REQUEST, UPDATE_ADDRESS_SUCCESS, UPDATE_ADDRESS_FAILURE } from "./ActionType";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    accessToken: null,
    refreshToken: null,
    role: null
}
export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUESET:
        case LOGIN_REQUESET:
        case GET_USER_REQUESET:
            return {...state, isLoading: true, error: null}
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {...state, isLoading: false, error: null, role: action.payload?.role, accessToken: action.payload?.tokens?.access?.token, refreshToken: action.payload?.tokens?.refresh?.token}
        case GET_USER_SUCCESS:
            return {...state, isLoading: false, error: null, role: action.payload?.role, user: action.payload, accessToken: action.payload?.tokens?.access?.token, refreshToken: action.payload?.tokens?.refresh?.token}
        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
            return {...state, isLoading: false, error: action.payload}
        case GET_TOKEN_RESET_PASSWORD_REQUEST:
            return { ...state, loading: true, error: null, success: false };
        case GET_TOKEN_RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, success: true };
        case GET_TOKEN_RESET_PASSWORD_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case RESET_PASSWORD_REQUEST:
            return { ...state, loading: true, error: null, success: false };
        case REFRESH_TOKEN_SUCCESS:
            return { ...state, loading: false, error: null, success: true, role: action.payload.role, user: action.payload, accessToken: action.payload?.tokens?.access?.token, refreshToken: action.payload?.tokens?.refresh?.token };
        case REFRESH_TOKEN_FAILURE:
            return { ...state, loading: false, error: action.payload, success: false };
        case CHANGE_PASSWORD_REQUESET:
            return {...state, loading: true, error: null, success: false}
        case CHANGE_PASSWORD_SUCCESS:
            return {...state, loading: false, error: null, success: true}
        case CHANGE_PASSWORD_FAILURE:
            return {...state, laoding: false, error: action.payload, success: false}
        case LOGOUT:
            return {...initialState}
        case UPDATE_ADDRESS_REQUEST:
            return {...state, isLoading: true, error: null}
        case UPDATE_ADDRESS_SUCCESS:
            return {
                ...state, 
                isLoading: false, 
                error: null,
                user: action.payload
            }
        case UPDATE_ADDRESS_FAILURE:
            return {...state, isLoading: false, error: action.payload}
        default:
            return state;
    }
}

