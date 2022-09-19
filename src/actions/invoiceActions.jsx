import * as types from './constants.jsx';

export function getInvoice(page = 1) {
  return {
    type: types.GET_INVOICE,
    payload: {
      client: 'default',
      request: {
        url: `/admin/invoice/?page=${page}`,
        method: 'get',
      },
    },
  };
}

export function getInvoiceOptions(query = '') {
  return {
    type: types.GET_INVOICE_OPTIONS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/user-search/?search=${query}`,
        method: 'get',
      },
    },
  };
}

export function getInvoiceProductOptions(query = '') {
  return {
    type: types.GET_INVOICE_PRODUCT_OPTIONS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product-search/?search=${query}`,
        method: 'get',
      },
    },
  };
}

export function getProformaUsers() {
  return {
    type: types.GET_PRFORMA_USERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/user-search/`,
        method: 'get',
      },
    },
  };
}

export function postInvoice(data) {
  return {
    type: types.POST_INVOICE,
    payload: {
      client: 'default',
      request: {
        url: `/admin/create-invoice/`,
        method: 'POST',
        data,
      },
    },
  };
}

export function getActivityOrder(id) {
  return {
    type: types.GET_ACTIVITY_ORDER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/invoice/${id}/`,
        method: 'get',
      },
    },
  };
}

export function sortFunction(a, b) {
  var dateA = new Date(a.date_created).getTime();
  var dateB = new Date(b.date_created).getTime();
  return dateA > dateB ? 1 : -1;
}

export function userQuickCreate(data) {
  return {
    type: types.USER_QUICK_CREATE,
    payload: {
      client: 'default',
      request: {
        url: `/admin/user/quick-create/`,
        method: 'post',
        data,
      },
    },
  };
}

export function productQuickCreate(data) {
  return {
    type: types.PRODUCT_QUICK_CREATE,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/quick-create/`,
        method: 'post',
        data,
      },
    },
  };
}

export function getUnnecessaryList(id) {
  return {
    type: types.GET_UNNECESSARY,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/orders/`,
        method: 'get',
      },
    },
  };
}

export function getReplacedList(id) {
  return {
    type: types.GET_REPLACED,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/orders/`,
        method: 'get',
      },
    },
  };
}
