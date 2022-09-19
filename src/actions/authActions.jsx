import * as types from "./constants.jsx";

export function postLogin(data) {
    return {
        type: types.LOGIN,
        payload: {
            client: "default",
            request: {
                url: `/auth/login/`,
                method: "post",
                data,
            },
        },
    };
}

export function getRole() {
    return {
        type: types.GET_ROLE,
        payload: {
            client: "default",
            request: {
                url: `/me/`,
                method: "get",
            },
        },
    };
}
