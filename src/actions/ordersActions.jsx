import * as types from './constants.jsx';

export function getOrders(activePage = 1, search = '', status = '', role = null, is_confirmed) {
  return {
    type: types.GET_ORDERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/?page=${activePage}${search ? '&search=' + search : ''}${
          status ? '&status=' + status : ''
        }${role ? '&role=' + role : ''}${
          is_confirmed ? '&is_confirmed_by_customer=' + is_confirmed : ''
        }`,
        method: 'get',
      },
    },
  };
}

export function getActiveOrders(
  activePage = 1,
  search = '',
  status = '',
  role = null,
  is_confirmed,
) {
  return {
    type: types.GET_ACTIVE_ORDERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/action/?page=${activePage}${search ? '&search=' + search : ''}${
          status ? '&status=' + status : ''
        }${role ? '&role=' + role : ''}${
          is_confirmed ? '&is_confirmed_by_customer=' + is_confirmed : ''
        }`,
        method: 'get',
      },
    },
  };
}

export function getDisableOrders(
  activePage = 1,
  search = '',
  status = '',
  role = null,
  is_confirmed,
) {
  return {
    type: types.GET_DISABLED_ORDERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/disabled/?page=${activePage}${search ? '&search=' + search : ''}${
          status ? '&status=' + status : ''
        }${role ? '&role=' + role : ''}${
          is_confirmed ? '&is_confirmed_by_customer=' + is_confirmed : ''
        }`,
        method: 'get',
      },
    },
  };
}

export function createOrder(data) {
  return {
    type: types.CREATE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/create-invoice-form/`,
        method: 'POST',
        data,
      },
    },
  };
}

export function makeProformaApproved(id) {
  return {
    type: types.APPROVE_PROFORMA,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/approve/`,
        method: 'POST',
      },
    },
  };
}

export function createProforma(data) {
  return {
    type: types.CREATE_PROFORMA,
    payload: {
      client: 'default',
      request: {
        url: `/admin/create-proforma-form/`,
        method: 'POST',
        data,
      },
    },
  };
}

export function getSingleOrder(id) {
  return {
    type: types.GET_SINGLE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/`,
        method: 'get',
      },
    },
  };
}
export function getSingleDisabledOrder(id) {
  return {
    type: types.GET_SINGLE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/disable/`,
        method: 'get',
      },
    },
  };
}

export function changeOrder(id, data) {
  return {
    type: types.CHANGE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function changeSalesOrder(id, data) {
  return {
    type: types.CHANGE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/sales-rep/order/${id}/edit/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function toApproval(id, data) {
  return {
    type: types.CHANGE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/sales-rep/order/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function approveRequest(id, data) {
  return {
    type: types.CHANGE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/regional-manager/order/${id}/confirm/`,
        method: 'POST',
        data,
      },
    },
  };
}

export function partialChangeOrder(id, data) {
  return {
    type: types.PARTIAL_CHANGE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/partial-update/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function changeRegionalQty(id, managerId, data) {
  return {
    type: types.CHANGE_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/${managerId}/product/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function getSalesList() {
  return {
    type: types.GET_SALES_LIST,
    payload: {
      client: 'default',
      request: {
        url: `/admin/my-sales-rep/`,
        method: 'get',
      },
    },
  };
}
export function paymentCreate(data) {
  return {
    type: types.PAYMENT_CREATE,
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

export function refundCreate(data) {
  return {
    type: types.REFUND_CREATE,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order-to-refund/`,
        method: 'post',
        data,
      },
    },
  };
}

export function paymentGet(method = '', search = '') {
  return {
    type: types.GET_PAYMENTS_LIST,
    payload: {
      client: 'default',
      request: {
        url: `admin/order/${search}/balance-event/`,
        method: 'get',
      },
    },
  };
}

export function markPaid(id) {
  return {
    type: types.MARK_PAID,
    payload: {
      client: 'default',
      request: {
        url: `admin/order/${id}/mark-paid/`,
        method: 'post',
      },
    },
  };
}

export function switchToInvoice(id) {
  return {
    type: types.SWITCH_TO_INVOICE,
    payload: {
      client: 'default',
      request: {
        url: `admin/order/${id}/switch-to-invoice/ `,
        method: 'post',
      },
    },
  };
}

export function getUnreadOrders() {
  return {
    type: types.GET_UNREAD_ORDERS,
    payload: {
      client: 'default',
      request: {
        url: `admin/order/action-count/`,
        method: 'get',
      },
    },
  };
}

export function changeTin(data) {
  return {
    type: types.CHANGE_TIN,
    payload: {
      data,
    },
  };
}

export function checkEstimateBalance(id, data) {
  return {
    type: types.POST_ESTIMATE_BALANCE,
    payload: {
      client: 'default',
      request: {
        url: `admin/order/${id}/estimate-balance/ `,
        method: 'post',
        data,
      },
    },
  };
}

export function changeCustomer(id, data) {
  return {
    type: types.CHANGE_CUSTOMER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/change-customer/`,
        method: 'patch',
        data,
      },
    },
  };
}

export function disableInvoice(id, data) {
  return {
    type: types.DISABLE_INVOICE,
    payload: {
      client: 'default',
      request: {
        url: `/admin/order/${id}/disable/`,
        method: 'post',
        data,
      },
    },
  };
}
