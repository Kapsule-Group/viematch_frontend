import * as types from './constants.jsx';

export function getActivity(activity, page) {
    return {
        type: types.GET_ACTIVITY,
        payload: {
            client: 'default',
            request: {
                url: `/clinic-logs/?page=${page}&page_size=10${activity ? `&activity=${activity}` : ''}`,
                method: 'get'
            }
        }
    };
}
