import * as types from "./constants.jsx";

export function getClinicLog() {
    return {
        type: types.GET_CLINIC_LOG,
        payload: {
            client: "default",
            request: {
                url: `/clinic-logs/?page_size=5`,
                method: "get"
            }
        }
    };
}

export function getClinicDashBoard() {
    return {
        type: types.GET_CLINIC_DASH_BOARD,
        payload: {
            client: "default",
            request: {
                url: `/clinic-dashboard/`,
                method: "get"
            }
        }
    };
}

export function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }

        acc[key].push(obj);

        return acc;
    }, {});
}

export function getStockManagement() {
    return {
        type: types.GET_STOCK_MANAGEMENT,
        payload: {
            client: "default",
            request: {
                url: `/clinic-dashboard/`,
                method: "get"
            }
        }
    };
}

export function getPurchasesByCategory() {
    return {
        type: types.GET_PURCHASES_BY_CATEGORY,
        payload: {
            client: "default",
            request: {
                url: `/purchase-by-category/`,
                method: "get"
            }
        }
    };
}

export function getStockLevel(data) {
    return {
        type: types.GET_STOCK_LEVEL,
        payload: {
            client: "default",
            request: {
                url: `/stock-level/?interval=${data}`,
                method: "get"
            }
        }
    };
}

export function getMonthlyGraphic(data) {
    return {
        type: types.GET_MONTHLY_GRAPHIC,
        payload: {
            client: "default",
            request: {
                url: `/purchase-history/?data-type=${data}`,
                method: "get"
            }
        }
    };
}

export function getMonthlyDonut(data) {
    return {
        type: types.GET_MONTHLY_DONUT,
        payload: {
            client: "default",
            request: {
                url: `/purchase-last-month/?data-type=${data}`,
                method: "get"
            }
        }
    };
}
