import * as types from "../actions/constants";

const INITIAL_STATE = {
    users_list: {},
    error: {},
    userInfo: {},
    cartCount: {}
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_USERS_LIST_SUCCESS:
            return { ...state, users_list: action.payload.data };
        case types.POST_ADD_USER_FAIL:
            return { ...state, error: action.error.response.data };
        case types.PATCH_USER_FAIL:
            return { ...state, error: action.error.response.data };
        case types.RESET_USER_ERROR:
            return { ...state, error: {} };
        case types.GET_USER_INFO_SUCCESS:
            return { ...state, userInfo: action.payload.data };
        case types.GET_CART_COUNT_SUCCESS:
            return {
                ...state,
                cartCount: action.payload.data
            };
        default:
            return state;
    }
}
