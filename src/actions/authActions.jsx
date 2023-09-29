import * as types from "./constants.jsx";

export function postRegisterFirstStep(data) {
    return {
        type: types.REGISTER_FIRST_STEP,
        payload: {
            client: "default",
            request: {
                url: `/auth/hospital-credential/`,
                method: "post",
                data
            }
        }
    };
}

export function postRegisterSecondStep(data) {
    return {
        type: types.REGISTER_SECOND_STEP,
        payload: {
            client: "default",
            request: {
                url: `/auth/owner/`,
                method: "post",
                data
            }
        }
    };
}

export function postLogin(data) {
    return {
        type: types.LOGIN,
        payload: {
            client: "default",
            request: {
                url: `/auth/login/`,
                method: "post",
                data
            }
        }
    };
}

export function postResetPassword(data) {
    return {
        type: types.RESET_PASSWORD,
        payload: {
            client: "default",
            request: {
                url: `/auth/reset-password/`,
                method: "post",
                data
            }
        }
    };
}

export function postPasswordApprove(data) {
    return {
        type: types.CHANGE_PASSWORD,
        payload: {
            client: "default",
            request: {
                url: `/auth/reset-password/approve/`,
                method: "post",
                data
            }
        }
    };
}
export function sendMessage(data, id) {
    return {
        type: types.SEND_MESSAGE,
        payload: {
            client: "default",
            request: {
                url: `/auth/message/${id}/`,
                method: "PUT",
                data
            }
        }
    };
}

export function getAgreements() {
    return {
        type: types.GET_AGREEMENTS,
        payload: {
            client: "default",
            request: {
                url: `/auth/user-agreements/`,
                method: "get"
            }
        }
    };
}

export function getRegions() {
    return {
        type: types.GET_REGIONS,
        payload: {
            client: "default",
            request: {
                url: `/region/`,
                method: "get"
            }
        }
    };
}
