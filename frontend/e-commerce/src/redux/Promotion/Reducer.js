import {
    GET_PROMOTIONS_REQUEST, GET_PROMOTIONS_SUCCESS, GET_PROMOTIONS_FAILURE,
    APPLY_PROMOTION_REQUEST, APPLY_PROMOTION_SUCCESS, APPLY_PROMOTION_FAILURE,
    CREATE_PROMOTION_REQUEST, CREATE_PROMOTION_SUCCESS, CREATE_PROMOTION_FAILURE,
    UPDATE_PROMOTION_REQUEST, UPDATE_PROMOTION_SUCCESS, UPDATE_PROMOTION_FAILURE,
    DELETE_PROMOTION_REQUEST, DELETE_PROMOTION_SUCCESS, DELETE_PROMOTION_FAILURE,
    REMOVE_PROMOTION_REQUEST, REMOVE_PROMOTION_SUCCESS, REMOVE_PROMOTION_FAILURE,
    TOGGLE_VISIBILITY_REQUEST, TOGGLE_VISIBILITY_SUCCESS, TOGGLE_VISIBILITY_FAILURE,
    FIND_PROMOTION_REQUEST, FIND_PROMOTION_SUCCESS, FIND_PROMOTION_FAILURE
} from "./ActionType";

const initialState = {
    promotions: {
        promotions: [],
        totalPromotions: 0,
        currentPage: 1,
        totalPages: 1,
        limit: 7
    },
    loading: false,
    error: null,
    appliedPromotion: null,
    foundPromotion: null
};

const promotionReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PROMOTIONS_REQUEST:
        case APPLY_PROMOTION_REQUEST:
        case CREATE_PROMOTION_REQUEST:
        case UPDATE_PROMOTION_REQUEST:
        case DELETE_PROMOTION_REQUEST:
        case REMOVE_PROMOTION_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_PROMOTIONS_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                promotions: action.payload
            };

        case CREATE_PROMOTION_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                promotions: {
                    ...state.promotions,
                    promotions: [...state.promotions.promotions, action.payload]
                }
            };

        case UPDATE_PROMOTION_SUCCESS:
            return {
                ...state,
                loading: false,
                promotions: {
                    ...state.promotions,
                    promotions: state.promotions.promotions.map(promo =>
                        promo._id === action.payload._id ? action.payload : promo
                    )
                }
            };

        case DELETE_PROMOTION_SUCCESS:
            return {
                ...state,
                loading: false,
                promotions: {
                    ...state.promotions,
                    promotions: state.promotions.promotions.filter(promo => 
                        promo._id !== action.payload
                    )
                }
            };

        case TOGGLE_VISIBILITY_SUCCESS:
            return {
                ...state,
                loading: false,
                promotions: {
                    ...state.promotions,
                    promotions: state.promotions.promotions.map(promo =>
                        promo._id === action.payload._id
                            ? { ...promo, visible: !promo.visible }
                            : promo
                    )
                }
            };

        case APPLY_PROMOTION_SUCCESS:
            return { ...state, loading: false, appliedPromotion: action.payload };

        case REMOVE_PROMOTION_SUCCESS:
            return { ...state, loading: false, appliedPromotion: null };

        case GET_PROMOTIONS_FAILURE:
        case APPLY_PROMOTION_FAILURE:
        case CREATE_PROMOTION_FAILURE:
        case UPDATE_PROMOTION_FAILURE:
        case DELETE_PROMOTION_FAILURE:
        case REMOVE_PROMOTION_FAILURE:
        case TOGGLE_VISIBILITY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case FIND_PROMOTION_REQUEST:
            return { ...state, loading: true, error: null };

        case FIND_PROMOTION_SUCCESS:
            return { ...state, loading: false, foundPromotion: action.payload };

        case FIND_PROMOTION_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default promotionReducer;

