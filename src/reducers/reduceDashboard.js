import * as types from "../actions/constants";

const INITIAL_STATE = {
    clinicLog: [],
    clinicDashBoard: []
};

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case types.GET_CLINIC_LOG_SUCCESS :
            return {...state, clinicLog : action.payload.data.results};
        case types.GET_CLINIC_DASH_BOARD_SUCCESS :
            return {...state, clinicDashBoard : action.payload.data};

        default:
            return state;
    }
}