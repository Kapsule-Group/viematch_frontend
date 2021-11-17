import * as types from "../actions/constants";

const INITIAL_STATE = {
    // users_list: {},
    items: {},
    cats: [],
    promotionals: [],
    cats_results: {},
    search_categories: {},
    search_results: {},
    brands: [],
    category_results: {},
    product_details: {},
    recommended: {}
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_SUB_CAT_SUCCESS:
            return { ...state, items: action.payload.data };
        case types.GET_CAT_SUCCESS:
            return { ...state, cats_results: action.payload.data };
        case types.GET_MAIN_CATALOG_SUCCESS:
            return { ...state, cats: action.payload.data };
        case types.GET_PROMOTIONALS_SUCCESS:
            const newArr = [];
            for (let i = 0; i < Math.ceil(state.cats.length / 3); i++) {
                newArr.push(state.cats.slice(i * 3, i * 3 + 3));
            }
            for (let i = 0; i < action.payload.data.length; i++) {
                newArr[i].push({ ...action.payload.data[i], promotional: true });
            }

            return { ...state, cats: newArr.flat() };
        case types.GET_SEARCH_RESULTS_CATEGORIES_SUCCESS:
            return { ...state, search_categories: action.payload.data };
        case types.GET_SEARCH_RESULTS_SUCCESS:
            return { ...state, search_results: action.payload.data };
        case types.GET_BRANDS_SUCCESS:
            return { ...state, brands: action.payload.data };
        case types.GET_CATEGORY_RESULTS_SUCCESS:
            return { ...state, category_results: action.payload.data };
        case types.GET_PRODUCT_DETAILS_SUCCESS:
            return { ...state, product_details: action.payload.data };
        case types.GET_RECOMMENDED_SUCCESS:
            return { ...state, recommended: action.payload.data };
        default:
            return state;
    }
}
