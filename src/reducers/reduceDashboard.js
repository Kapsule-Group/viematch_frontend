import * as types from "../actions/constants";

const INITIAL_STATE = {
    statistics: {},
    requests: [],
    revenue: [],
    categories: [],
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_STATISTICS_SUCCESS:
            return { ...state, statistics: action.payload.data };
        case types.GET_DASHBOARD_REQUESTS_SUCCESS:
            return { ...state, requests: action.payload.data.results };
        case types.GET_REVENUE_FOR_CHART_SUCCESS:
            let array = [...action.payload.data];
            return { ...state, revenue: array.reverse() };
        case types.GET_CATEGORIES_SUCCESS:
            return { ...state, categories: action.payload.data };
        default:
            return state;
    }
}
