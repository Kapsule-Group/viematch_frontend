import * as types from "../actions/constants";

const INITIAL_STATE = {
    hospital_credentials: {},
    error: {},
    agreements: {}
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.REGISTER_FIRST_STEP_SUCCESS:
            return { ...state, hospital_credentials: action.payload.data };
        case types.REGISTER_FIRST_STEP_FAIL:
            return { ...state, error: action.error.response.data };
        case types.LOGIN_FAIL:
            return { ...state, error: action.error.response.data };
        case types.CHANGE_PASSWORD_FAIL:
            return { ...state, error: action.error.response.data };
        case types.RESET_PASSWORD_FAIL:
            return { ...state, error: action.error.response.data };
        case types.RESET_USER_ERROR:
            return { ...state, error: {} };
        case types.GET_AGREEMENTS_SUCCESS:
            return { ...state, agreements: action.payload.data };
        default:
            return state;
    }
}
