import * as types from './constants.jsx';

export function getCompletedRequests(page, customers) {
    return {
        type: types.GET_COMPLETED_REQUESTS,
        payload: {
            client: 'default',
            request: {
                url: `/requests/?status=completed${customers.length > 0 ? `&customer_name=${customers}` : ''}&page_size=10&page=${page}`,
                method: 'get'
            }
        }
    };
}

export function getUncompletedRequests(page, customers) {
    return {
        type: types.GET_UNCOMPLETED_REQUESTS,
        payload: {
            client: 'default',
            request: {
                url: `/requests/?status=uncompleted${customers.length > 0 ? `&customer_name=${customers}` : ''}&page_size=10&page=${page}`,
                method: 'get'
            }
        }
    };
}

export function getAllActiveUsers() {
    return {
        type: types.GET_ALL_ACTIVE_USERS,
        payload: {
            client: 'default',
            request: {
                url: `/active-clinics/`,
                method: 'get'
            }
        }
    };
}

export function putRequestToCompleted(id) {
    return {
        type: types.PUT_REQUEST_TO_COMPLETED,
        payload: {
            client: 'default',
            request: {
                url: `/request-update/${id}/`,
                method: 'put'
            }
        }
    };
}

export function putRequestsToCompleted(data) {
    return {
        type: types.PUT_REQUESTS_TO_COMPLETED,
        payload: {
            client: 'default',
            request: {
                url: `/request-update-list/`,
                method: 'put',
                data
            }
        }
    };
}