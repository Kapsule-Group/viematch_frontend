import * as types from "../actions/constants";

const INITIAL_STATE = {
    loading: false,
    activityLog: [],
    activityOrder: {},
    subscriptions: {}
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_ACTIVITY_SUCCESS:
            return { ...state, activityLog: action.payload.data };
        case types.GET_ACTIVITY_ORDER:
            return { ...state, loading: true };
        case types.GET_ACTIVITY_ORDER_FAIL:
            return { ...state, loading: false };
        case types.GET_ACTIVITY_ORDER_SUCCESS:
            return { ...state, loading: false, activityOrder: action.payload.data };
        case types.GET_SUBS_SUCCESS:
            return { ...state, subscriptions: action.payload.data };
        default:
            return state;
    }
}
