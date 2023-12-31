import * as types from "../actions/constants";

const INITIAL_STATE = {
    loading: false,
    stock_list: {},
    search_list: {},
    stock_settings: {},
    stock_setting_error: ""
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_STOCK_SUCCESS:
            return { ...state, stock_list: action.payload.data };
        case types.STOCK_SETTINGS_SUCCESS:
            return { ...state, stock_settings: action.payload.data };
        case types.SEARCH_STOCK_SUCCESS:
            return { ...state, search_list: action.payload.data };

        case types.POST_REQUEST:
            return { ...state, loading: true };

        case types.POST_REQUEST_SUCCESS:
            return { ...state, loading: false };
        case types.POST_REQUEST_FAIL:
            return { ...state, error: action.error.response.data, loading: false };
        case types.PATCH_QUANTITY_FAIL:
            return { ...state, error: action.error.response.data };
        case types.STOCK_SETTINGS_PATCH_FAIL:
            return { ...state, stock_setting_error: action.error.response.data.non_field_errors };

        case types.CUSTOMER_STOCK:
            return { ...state, loading: true };
        case types.CUSTOMER_STOCK_SUCCESS:
        case types.CUSTOMER_STOCK_FAIL:
            return { ...state, loading: false };

        default:
            return state;
    }
}
