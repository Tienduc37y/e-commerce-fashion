import * as types from "./ActionType";

const initialState = {
    banners: [],
    loading: false,
    error: null
};

const bannerReducer = (state = initialState, action) => {
    switch (action.type) {
        // Request cases
        case types.GET_BANNERS_REQUEST:
        case types.CREATE_BANNER_REQUEST:
        case types.UPDATE_BANNER_REQUEST:
        case types.DELETE_BANNER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        // Success cases
        case types.GET_BANNERS_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: action.payload
            };

        case types.CREATE_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: [...state.banners, action.payload]
            };

        case types.UPDATE_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: state.banners.map(banner =>
                    banner._id === action.payload._id ? action.payload : banner
                )
            };

        case types.DELETE_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
                banners: state.banners.filter(banner => banner._id !== action.payload)
            };

        // Failure cases
        case types.GET_BANNERS_FAILURE:
        case types.CREATE_BANNER_FAILURE:
        case types.UPDATE_BANNER_FAILURE:
        case types.DELETE_BANNER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default bannerReducer; 