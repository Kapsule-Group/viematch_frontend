import * as types from "../actions/constants";

const INITIAL_STATE = {
    error_auth: {},
    data: {},
    resultsDot: {},
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.LOGIN_FAIL:
            return { ...state, error_auth: action.error.response.data };
        case types.GET_ROLE_SUCCESS:
            return { ...state, data: action.payload.data };
        case types.NEED_DOT_SUCCESS:
            return { ...state, resultsDot: action.payload.data };
        default:
            return state;
    }
}
