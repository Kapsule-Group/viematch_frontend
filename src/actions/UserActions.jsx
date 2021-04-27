import * as types from "./constants.jsx";

export function patchUser(id, data) {
    return {
        type: types.PATCH_USER,
        payload: {
            client: "default",
            request: {
                url: `/auth/user-management/${id}/`,
                method: "PATCH",
                data
            }
        }
    };
}
export function deleteUser(id) {
    return {
        type: types.DELETE_USER,
        payload: {
            client: "default",
            request: {
                url: `/auth/user-management/${id}/`,
                method: "delete"
            }
        }
    };
}

export function postAddUser(data) {
    return {
        type: types.POST_ADD_USER,
        payload: {
            client: "default",
            request: {
                url: `/auth/add-user/`,
                method: "POST",
                data
            }
        }
    };
}

export function getUsersList() {
    return {
        type: types.GET_USERS_LIST,
        payload: {
            client: "default",
            request: {
                url: `/auth/user-management-list/`,
                method: "get"
            }
        }
    };
}

export function resetErrorUsers() {
    return { type: types.RESET_USER_ERROR };
}

export function getUserInfo() {
    return {
        type: types.GET_USER_INFO,
        payload: {
            client: "default",
            request: {
                url: `/currency/`,
                method: "get"
            }
        }
    };
}

export function getCartCount() {
    return {
        type: types.GET_CART_COUNT,
        payload: {
            client: "default",
            request: {
                url: `/cart-count/`,
                method: "get"
            }
        }
    };
}
