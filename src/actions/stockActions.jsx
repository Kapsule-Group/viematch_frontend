import * as types from "./constants.jsx";

export function getStock(marker, page, quantity) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory/?${quantity ? "ordering=" + quantity + "&" : ""}${
                    page ? "page=" + page + "&" : ""
                }stock=${marker}`,
                method: "GET"
            }
        }
    };
}

export function stockSettings(type, data) {
    if (type === "GET") {
        return {
            type: types.STOCK_SETTINGS,
            payload: {
                client: "default",
                request: {
                    url: `/stock-settings/`,
                    method: type
                }
            }
        };
    } else if (type === "PATCH") {
        return {
            type: types.STOCK_SETTINGS_PATCH,
            payload: {
                client: "default",
                request: {
                    url: `/stock-settings/`,
                    method: type,
                    data
                }
            }
        };
    }
}

export function getCartStock(activity, page) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory/?page=${page}&page_size=50${activity ? ` $status=${activity}` : ""}`,
                method: "GET"
            }
        }
    };
}
//
// export function switcher(marker, quantity) {
//     return {
//         type: types.SWITCHER,
//         payload: {
//             client: 'default',
//             request: {
//                 url: `/inventory/?stock=${marker}&ordering=${quantity}`,
//                 method: "GET",
//             }
//         }
//     };
// }

export function getSearchList(id) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory/?id__in=${id}`,
                method: "GET"
            }
        }
    };
}

export function searchStock(marker, prod) {
    return {
        type: types.SEARCH_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory-search/?stock=${marker}${prod && prod.length !== 0 ? `&search=${prod}` : ""}`,
                method: "GET"
            }
        }
    };
}

export function patchQuantity(id, data) {
    return {
        type: types.PATCH_QUANTITY,
        payload: {
            client: "default",
            request: {
                url: `/quantity-update/${id}/`,
                method: "PATCH",
                data
            }
        }
    };
}

//patch cart requests
export function patchCartQuantity(id, data) {
    return {
        type: types.PATCH_QUANTITY,
        payload: {
            client: "default",
            request: {
                url: `/cart-update/${id}/`,
                method: "PATCH",
                data
            }
        }
    };
}

export function postRequest(data) {
    return {
        type: types.POST_REQUEST,
        payload: {
            client: "default",
            request: {
                url: `/requests/`,
                method: "POST",
                data
            }
        }
    };
}

export function getSettings() {
    return {
        type: types.POST_REQUEST,
        payload: {
            client: "default",
            request: {
                url: `/inventory-settings/`,
                method: "GET"
            }
        }
    };
}

export function updateSetting(userId, data) {
    return {
        type: types.POST_REQUEST,
        payload: {
            client: "default",
            request: {
                url: `/inventory-settingsUpdate/${userId}/`,
                method: "PUT",
                data
            }
        }
    };
}

export function createSub(data) {
    return {
        type: types.CREATE_SUB,
        payload: {
            client: "default",
            request: {
                url: `/subscription/`,
                method: "POST",
                data
            }
        }
    };
}
