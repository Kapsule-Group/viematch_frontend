import * as types from './constants.jsx';

export function getDemandSubs(page = 1, search = '', status = null) {
  return {
    type: types.GET_DEMAND_SUBS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/subscription/?page=${page}&search=${search}${
          status ? `&status=${status}` : ''
        }`,
        method: 'GET',
      },
    },
  };
}

export function getCalendar() {
  return {
    type: types.GET_CALENDAR,
    payload: {
      client: 'default',
      request: {
        url: `/admin/subscription/event/`,
        method: 'GET',
      },
    },
  };
}

export function getSingleSub(id) {
  return {
    type: types.GET_SINGLE_SUB,
    payload: {
      client: 'default',
      request: {
        url: `/admin/subscription/${id}/`,
        method: 'GET',
      },
    },
  };
}

export function postSub(id, data) {
  return {
    type: types.POST_SUB,
    payload: {
      client: 'default',
      request: {
        url: `/admin/subscription/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function cancelSub(id) {
  return {
    type: types.POST_SUB,
    payload: {
      client: 'default',
      request: {
        url: `/admin/subscription/${id}/cancel/`,
        method: 'POST',
      },
    },
  };
}

export function deleteSub(id) {
  return {
    type: types.DELETE_SUB,
    payload: {
      client: 'default',
      request: {
        url: `/admin/subscription/${id}/delete/`,
        method: 'DELETE',
      },
    },
  };
}
