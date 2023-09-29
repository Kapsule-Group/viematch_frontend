import * as types from "../actions/constants";

const INITIAL_STATE = {
    listPhone: [],
    phone: {},
    users_list: {},
    error: {},
    userInfo: {},
    cartCount: {},
    categories: [],
    liveSearch: [],
    banners: [],
    searchID: null,
    loading: false
};

export default function(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.GET_USERS_LIST_SUCCESS:
            return { ...state, users_list: action.payload.data };
        case types.POST_ADD_USER_FAIL:
            return { ...state, error: action.error.response.data };
        case types.PATCH_USER_FAIL:
            return { ...state, error: action.error.response.data };
        case types.RESET_USER_ERROR:
            return { ...state, error: {} };
        case types.GET_USER_INFO_SUCCESS:
            return { ...state, userInfo: action.payload.data };

        case types.GET_PHONE_SUCCESS:
            return { ...state, phone: action.payload.data };
        case types.GET_LIST_PHONE_SUCCESS:
            return { ...state, listPhone: action.payload.data };

        case types.POST_REQUEST:
            return { ...state, loading: true };
        case types.POST_REQUEST_FAIL:
        case types.POST_REQUEST_SUCCESS:
            return { ...state, loading: false };

        case types.GET_CART_COUNT_SUCCESS:
            return {
                ...state,
                cartCount: action.payload.data
            };
        case types.GET_SEARCH_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload.data
            };
        case types.GET_LIVE_SEARCH_SUCCESS:
            return {
                ...state,
                liveSearch: action.payload.data
            };
        case types.GET_BANNERS_SUCCESS:
            return {
                ...state,
                banners: action.payload.data
            };
        case `@@router/LOCATION_CHANGE`:
            action.payload.location.pathname === "/main/activity" &&
                action.payload.action === "POP" &&
                localStorage.setItem(
                    "id",

                    action.payload.location.search
                );
            action.payload.location.pathname === "/main/activity" &&
                action.payload.action === "POP" &&
                sessionStorage.setItem(
                    "id",

                    action.payload.location.search
                );

            return {
                ...state,
                searchID:
                    action.payload.location.pathname === "/main/activity"
                        ? action.payload.location.search
                        : state.searchID
            };
        default:
            return state;
    }
}
