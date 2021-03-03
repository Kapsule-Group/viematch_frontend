//import * as types from "../actions/constants";

const INITIAL_STATE = {
    // users_list: {},

};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        // case types.GET_USERS_LIST_SUCCESS:
        //     return {...state, users_list: action.payload.data};
        default:
            return state;
    }
}