import * as types from "../actions/constants";

const INITIAL_STATE = {
    demandSubs: {},
    calendar: [],
    singleSub: {},
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_DEMAND_SUBS_SUCCESS:
            return { ...state, demandSubs: action.payload.data };
        case types.GET_CALENDAR_SUCCESS:
            return { ...state, calendar: action.payload.data };
        case types.GET_SINGLE_SUB_SUCCESS:
            return { ...state, singleSub: action.payload.data };
        default:
            return state;
    }
}
