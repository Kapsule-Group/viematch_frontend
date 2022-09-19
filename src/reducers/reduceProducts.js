import * as types from "../actions/constants";

const INITIAL_STATE = {
    singleProduct: {},
    brands: [],
    loading: false,
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_SINGLE_PRODUCT_SUCCESS:
            return { ...state, singleProduct: action.payload.data };
        case types.GET_BRANDS_SUCCESS:
            return { ...state, brands: action.payload.data };
        case types.REPLACE_PRODUCT:
            return { ...state, loading: true };
        case types.REPLACE_PRODUCT_SUCCESS:
            case types.REPLACE_PRODUCT_FAIL:
            return { ...state, loading: false };
        default:
            return state;
    }
}
