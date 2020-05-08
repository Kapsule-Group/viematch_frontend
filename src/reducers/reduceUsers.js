import * as types from "../actions/constants";

const INITIAL_STATE = {
    users_list: {},
    error: {},
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_USERS_LIST_SUCCESS:
            return {...state, users_list: action.payload.data};
        case types.POST_ADD_USER_FAIL:
            return {...state, error: action.error.response.data};
            case types.PATCH_USER_FAIL:
            return {...state, error: action.error.response.data};
        case types.RESET_USER_ERROR:
            return { ...state, error: {} };
        default:
            return state;
    }
}