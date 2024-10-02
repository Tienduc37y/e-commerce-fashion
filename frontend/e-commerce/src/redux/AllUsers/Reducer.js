import { FIND_USER_FAILURE, FIND_USER_REQUEST, FIND_USER_SUCCESS, GET_ALL_USER_FAILURE, GET_ALL_USER_REQUESET, GET_ALL_USER_SUCCESS, REMOVE_USER_FAILURE, REMOVE_USER_REQUESET, REMOVE_USER_SUCCESS, UPDATE_USER_FAILURE, UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS } from "./ActionType";

const initialState = {
    users: [],
    isLoading: false,
    error: null,
}

export const AllUsersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_USER_REQUESET:
            return {...state, isLoading: true}
        case GET_ALL_USER_SUCCESS:
            return {...state, isLoading: false, users: action.payload}
        case GET_ALL_USER_FAILURE: 
            return {...state, isLoading: false, error: action.payload}
        case REMOVE_USER_REQUESET:
            return {...state, isLoading: true}
        case REMOVE_USER_SUCCESS:
            return {...state, isLoading: false}
        case REMOVE_USER_FAILURE:
            return {...state, isLoading: false, error: action.payload}
        case FIND_USER_REQUEST:
            return {...state, isLoading: true}
        case FIND_USER_SUCCESS:
            return {...state, isLoading: false, users: action.payload}
        case FIND_USER_FAILURE:
            return {...state, isLoading: false, error: action.payload}
        case UPDATE_USER_REQUEST:
            return {...state, isLoading: true}
        case UPDATE_USER_SUCCESS:
            return {...state, isLoading: false, users: action.payload}
        case UPDATE_USER_FAILURE:
            return {...state, isLoading: false, error: action.payload}
        default:
            return state;
    }
}