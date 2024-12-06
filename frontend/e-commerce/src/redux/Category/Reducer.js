import * as types from "./ActionType";

const initialState = {
    loading: false,
    categories: [],
    topLevelCategories: [],
    secondLevelCategories: [],
    menCategories: {
        shirts: [],
        pants: []
    },
    womenCategories: {
        shirts: [],
        pants: []
    },
    error: null
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.GET_TOP_LEVEL_CATEGORY:
            return {...state, loading: true};
        case types.GET_TOP_LEVEL_CATEGORY_SUCCESS:
            return {...state, topLevelCategories: action.payload, loading: false};
        case types.GET_TOP_LEVEL_CATEGORY_FAILED:
            return {...state, error: action.payload, loading: false};
            
        case types.GET_SECOND_LEVEL_CATEGORY:
            return {...state, loading: true};
        case types.GET_SECOND_LEVEL_CATEGORY_SUCCESS:
            return {...state, secondLevelCategories: action.payload, loading: false};
        case types.GET_SECOND_LEVEL_CATEGORY_FAILED:
            return {...state, error: action.payload, loading: false};
            
        case types.GET_THIRD_LEVEL_CATEGORY:
            return {...state, loading: true};
        case types.GET_THIRD_LEVEL_CATEGORY_SUCCESS:
            return {...state, categories: action.payload, loading: false};
        case types.GET_THIRD_LEVEL_CATEGORY_FAILED:
            return {...state, error: action.payload, loading: false};
            
        case types.GET_MEN_CATEGORIES:
            return {...state, loading: true};
        case types.GET_MEN_CATEGORIES_SUCCESS:
            return {...state, menCategories: action.payload, loading: false};
        case types.GET_MEN_CATEGORIES_FAILED:
            return {...state, error: action.payload, loading: false};
            
        case types.GET_WOMEN_CATEGORIES:
            return {...state, loading: true};
        case types.GET_WOMEN_CATEGORIES_SUCCESS:
            return {...state, womenCategories: action.payload, loading: false};
        case types.GET_WOMEN_CATEGORIES_FAILED:
            return {...state, error: action.payload, loading: false};
            
        default:
            return state;
    }
};
