import * as types from "../actions/constants";

const INITIAL_STATE = {
    activityLog: [],
    activityOrder: {},
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_ACTIVITY_SUCCESS :
            return {...state, activityLog : action.payload.data};
        case types.GET_ACTIVITY_ORDER_SUCCESS :
            return {...state, activityOrder : action.payload.data};
        default:
            return state;
    }
}