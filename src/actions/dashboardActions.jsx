import * as types from './constants.jsx';

export function getClinicLog() {
    return {
        type: types.GET_CLINIC_LOG,
        payload: {
            client: 'default',
            request: {
                url: `/clinic-logs/?page_size=5`,
                method: 'get'
            }
        }
    };
}

export function getClinicDashBoard() {
    return {
        type: types.GET_CLINIC_DASH_BOARD,
        payload: {
            client: 'default',
            request: {
                url: `/clinic-dashboard/`,
                method: 'get'
            }
        }
    };
}