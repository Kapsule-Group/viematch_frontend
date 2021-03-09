import * as types from './constants.jsx';

export function getActivity1(status/* , activity, page */) {
    return {
        type: types.GET_ACTIVITY,
        payload: {
            client: 'default',
            request: {
                 //url: `/clinic-logs/?page=${page}&page_size=10${activity ? `&activity=${activity}` : ''}`,
                 //url: `/requests/?page=${page}&page_size=10${activity ? ` $status=${activity}` : ''}`,
                 url: `/order/${status === 'all' ? '' : `?status=${status}`}`,
                method: 'get'
            }
        }
    };
}

export function getActivity(activity, page) {
    return {
        type: types.GET_ACTIVITY,
        payload: {
            client: 'default',
            request: {
                 //url: `/clinic-logs/?page=${page}&page_size=10${activity ? `&activity=${activity}` : ''}`,
                //  url: `/requests/?page=${page}&page_size=10`,
                url: `/cart/?page=${page}&page_size=10`,
                 //url: `/order/?status=${status}`,
                method: 'get'
            }
        }
    };
}

export function getActivityOrder(id/* , activity, page */) {
    return {
        type: types.GET_ACTIVITY_ORDER,
        payload: {
            client: 'default',
            request: {
                 //url: `/clinic-logs/?page=${page}&page_size=10${activity ? `&activity=${activity}` : ''}`,
                 //url: `/requests/?page=${page}&page_size=10${activity ? ` $status=${activity}` : ''}`,
                 url: `/order/${id}/`,
                method: 'get'
            }
        }
    };
}

export function patchQuantity(request, data) {
    return {
        type: types.PATCH_QUANTITY,
        payload: {
            client: 'default',
            request: {
                url: `/cart-quantity-update/${data}/`,
                method: "PATCH",
                data
            }
        }
    };
}

export function deleteOrderItem(order_item_id) {
    return {
        type: types.DELETE_ORDER_ITEM,
        payload: {
            client: 'default',
            request: {
                url: `/order-item/${order_item_id}/`,
                method: "DELETE"
            }
        }
    };
}

export function nextStep(id) {
    return {
        type: types.NEXT_STEP,
        payload: {
            client: 'default',
            request: {
                url: `/order/${id}/proceed/`,
                method: "POST"
            }
        }
    };
}

export function patchCart(id, data) {
    return {
        type: types.PATCH_CART_REQUEST,
        payload: {
            client: 'default',
            request: {
                url: `/cart-quantity-update/${id}/`,
                method: "PATCH",
                data
            }
        }
    };
}

export function patchOrderFile(id, data) {
    return {
        type: types.PATCH_PURCHASE_ORDER_FILE,
        payload: {
            client: 'default',
            request: {
                url: `/order/${id}/upload-po-file/`,
                method: "PATCH",
                data
            }
        }
    };
}

export function sortFunction(a, b) {
    var dateA = new Date(a.date_created).getTime();
    var dateB = new Date(b.date_created).getTime();
    return dateA > dateB ? 1 : -1;
};


export function sortFunctioncart(a, b) {
    var dateA = new Date(a.date_created).getTime();
    var dateB = new Date(b.date_created).getTime();
    return dateA > dateB ? -1 : 1;
}; 