import * as types from './constants.jsx';
import moment from 'moment';

const base = 'http://api.viebeg.4-com.pro/api/v0';

export function getCustomers(approval, requestedPageNumber, url, search = '') {
  let newUrl;
  if (url !== null && url.includes(base)) {
    newUrl = url.replace(base, '');
  } else {
    newUrl = url;
  }

  return {
    type: types.GET_CUSTOMERS,
    payload: {
      client: 'default',
      request: {
        url: url
          ? newUrl
          : `/customers/?page=${requestedPageNumber}&page_size=10&approval=${approval}${
              search ? '&search=' + search : ''
            }`,
        method: 'GET',
      },
    },
  };
}

export function approveAct(id, action) {
  return {
    type: types.CUSTOMER_ACTION,
    payload: {
      client: 'default',
      request: {
        url: `/customer/${id}/`,
        method: action ? 'PUT' : 'DELETE',
      },
    },
  };
}

export function getCertainCustomer(id, page) {
  return {
    type: types.GET_CERTAIN_CUSTOMER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/customer/${id}/stock/${page ? '?page=' + page : ''}`,
        method: 'get',
      },
    },
  };
}

export function getUserInner(id) {
  return {
    type: types.GET_USER_INNER,
    payload: {
      client: 'default',
      request: {
        url: `/customer/${id}/`,
        method: 'get',
      },
    },
  };
}

export function clearCustomerInner() {
  return {
    type: types.CLEAR_CUSTOMER_SUCCESS,
    payload: {
      client: 'default',
    },
  };
}

export function getUserSubs(id, page = 1, search = '', status = null) {
  return {
    type: types.GET_USER_SUBS,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer/${id}/subscription/?page=${page}&search=${search}${
          status ? `&status=${status}` : ''
        }`,
        method: 'get',
      },
    },
  };
}

export function addInfo(id, data) {
  return {
    type: types.ADD_INFO,
    payload: {
      client: 'default',
      request: {
        url: `/admin/user/update-incomplete/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function regionCustomerBalance(page, region, search) {
  return {
    type: types.GET_REGIONS_BALANCE,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer-statements/?page=${page}${search ? '&search=' + search : ''}${
          region ? '&region=' + region : ''
        }`,
        method: 'get',
      },
    },
  };
}

export function searchBalanceInfo(page, region, search) {
  return {
    type: types.GET_BALANCE_INFO,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer-statements/?page=${page}${search ? '&search=' + search : ''}${
          region ? '&region=' + region : ''
        }`,
        method: 'get',
      },
    },
  };
}

export function getCustomerStatements(id, page, from, to) {
  return {
    type: types.GET_CUSTOMER_STATEMENTS,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer/${id}/balance-activity/?page=${page}${
          from ? '&date_from=' + from : ''
        }${to ? '&date_to=' + to : ''}`,
        method: 'get',
      },
    },
  };
}

export function getCustomerStatementsHeader(id) {
  return {
    type: types.GET_CUSTOMER_STATEMENTS_HEADER,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer/${id}/balance-activity/user-info/`,
        method: 'get',
      },
    },
  };
}

export function addCustomerPayment(id, data) {
  return {
    type: types.ADD_CUSTOMER_PAYMENT,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer/${id}/payment/`,
        method: 'post',
        data,
      },
    },
  };
}

export function updateBalanceForward(id, data) {
  return {
    type: types.BALANCE_FORWARD,
    payload: {
      client: 'default',
      request: {
        url: `admin/balance-forward/${id}/edit/`,
        method: 'put',
        data,
      },
    },
  };
}

export function getCustomerPDF(id, page, from, to) {
  return {
    type: types.GET_CUSTOMER_PDF,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer/${id}/balance-activity-pdf/?page=${page}${
          from ? '&date_from=' + from : ''
        }${to ? '&date_to=' + to : ''}`,
        method: 'get',
      },
    },
  };
}

export function getFirstPaidOrders(id) {
  return {
    type: types.GET_FIRSTPAID_ORDERS,
    payload: {
      client: 'default',
      request: {
        url: `admin/customer/${id}/payment/`,
        method: 'get',
      },
    },
  };
}
