import { GET_THIRD_LEVEL_CATEGORY, GET_THIRD_LEVEL_CATEGORY_SUCCESS, GET_THIRD_LEVEL_CATEGORY_FAILED } from "./ActionType";
const initialState = {
    loading: false,
    categories: [],
    error: null
}

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_THIRD_LEVEL_CATEGORY:
            return {...state, loading: true}
        case GET_THIRD_LEVEL_CATEGORY_SUCCESS:
            return {...state, categories: action.payload, loading: false}
        case GET_THIRD_LEVEL_CATEGORY_FAILED:
            return {...state, error: action.payload, loading: false}
        default:
            return state;
    }
}
