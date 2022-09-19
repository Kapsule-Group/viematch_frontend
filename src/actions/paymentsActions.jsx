import * as types from './constants.jsx';

export function getPayments(activePage = 1, search = '', status = '', type = '') {
  return {
    type: types.GET_PAYMENTS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/payment/?page=${activePage}${search ? '&search=' + search : ''}${
          status ? '&method=' + status : ''
        }${type ? '&type=' + type : ''}`,
        method: 'get',
      },
    },
  };
}

export function addPayment(data) {
  return {
    type: types.ADD_PAYMENT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/payment/`,
        method: 'post',
        data,
      },
    },
  };
}

export function deletePayment(data) {
  return {
    type: types.DELETE_PAYMENT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/payment/${data}`,
        method: 'DELETE',
        data,
      },
    },
  };
}

export function invoiceLiveSearch(search = '') {
  return {
    type: types.INVOICE_LIVE_SEARCH,
    payload: {
      client: 'default',
      request: {
        url: `/admin/invoice-search/?search=${search}`,
        method: 'get',
      },
    },
  };
}
