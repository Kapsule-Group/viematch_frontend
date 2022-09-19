import * as types from "../actions/constants";

const INITIAL_STATE = {
    completed_requests: {},
    uncompleted_requests: {},
    allIds: {},
    active_users: {}
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_COMPLETED_REQUESTS_SUCCESS :
            return {...state, completed_requests : action.payload.data};
        case types.GET_UNCOMPLETED_REQUESTS_SUCCESS :
            let allIds = [];
            action.payload.data.results.forEach(el => allIds.push(el.id));
            return {
                ...state,
                uncompleted_requests : action.payload.data,
                allIds
            };
        case types.GET_ALL_ACTIVE_USERS_SUCCESS :
            return {...state, active_users : action.payload.data};

        default:
            return state;
    }
}