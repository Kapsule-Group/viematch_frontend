import * as types from "../actions/constants";

const INITIAL_STATE = {
    clinicLog: [],
    clinicDashBoard: [],
    stockManagement: [],
    purchasesByCategory: [],
    stockLevel: [],
    monthlyGraphicData: [],
    monthlyDonutData: []
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_CLINIC_LOG_SUCCESS:
            return { ...state, clinicLog: action.payload.data.results };
        case types.GET_CLINIC_DASH_BOARD_SUCCESS:
            return { ...state, clinicDashBoard: action.payload.data };
        case types.GET_STOCK_MANAGEMENT_SUCCESS:
            return {
                ...state,
                stockManagement: action.payload.data
            };
        case types.GET_PURCHASES_BY_CATEGORY_SUCCESS:
            return {
                ...state,
                purchasesByCategory: action.payload.data
            };
        case types.GET_STOCK_LEVEL_SUCCESS:
            return {
                ...state,
                stockLevel: action.payload.data
            };
        case types.GET_MONTHLY_GRAPHIC_SUCCESS:
            return {
                ...state,
                monthlyGraphicData: action.payload.data
            };
        case types.GET_MONTHLY_DONUT_SUCCESS:
            return {
                ...state,
                monthlyDonutData: action.payload.data
            };
        default:
            return state;
    }
}
