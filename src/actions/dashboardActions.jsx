import * as types from './constants.jsx';

export function getStatistics() {
    return {
        type: types.GET_STATISTICS,
        payload: {
            client: 'default',
            request: {
                url: `/dashboard-statistic/`,
                method: 'get'
            }
        }
    };
}

export function getDashboardRequests() {
    return {
        type: types.GET_DASHBOARD_REQUESTS,
        payload: {
            client: 'default',
            request: {
                url: `/requests/?page_size=5&status=uncompleted`,
                method: 'get'
            }
        }
    };
}

export function getRevenueForChart() {
    return {
        type: types.GET_REVENUE_FOR_CHART,
        payload: {
            client: 'default',
            request: {
                url: `/admin-dashboard-chart/`,
                method: 'get'
            }
        }
    };
}