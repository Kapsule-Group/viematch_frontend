import * as types from "../actions/constants";

const INITIAL_STATE = {
    stock_list: {},
    search_list: {},
    error: {},
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_STOCK_SUCCESS:
            return {...state, stock_list: action.payload.data};
        case types.SEARCH_STOCK_SUCCESS:
            return {...state, search_list: action.payload.data};
        case types.POST_REQUEST_FAIL:
            return {...state, error: action.error.response.data};
            case types.PATCH_QUANTITY_FAIL:
            return {...state, error: action.error.response.data};
        default:
            return state;
    }
}