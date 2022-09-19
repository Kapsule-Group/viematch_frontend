import * as types from './constants.jsx';

export function getManagers() {
  return {
    type: types.GET_MANAGERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/`,
        method: 'get',
      },
    },
  };
}

export function getCreditManagers() {
  return {
    type: types.GET_CREDIT_MANAGERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/credit-manager/`,
        method: 'get',
      },
    },
  };
}

export function getRegions() {
  return {
    type: types.GET_REGIONS,
    payload: {
      client: 'default',
      request: {
        url: `/region/`,
        method: 'get',
      },
    },
  };
}

export function getRegion(id) {
  return {
    type: types.GET_REGION,
    payload: {
      client: 'default',
      request: {
        url: `/region/${id}`,
        method: 'get',
      },
    },
  };
}

export function deleteRegion(id) {
  return {
    type: types.DELETE_REGION,
    payload: {
      client: 'default',
      request: {
        url: `/region/${id}/`,
        method: 'delete',
      },
    },
  };
}

export function createRegion(data) {
  return {
    type: types.CREATE_REGION,
    payload: {
      client: 'default',
      request: {
        url: `/region/`,
        method: 'post',
        data,
      },
    },
  };
}

export function createCreditManager(data) {
  return {
    type: types.CREATE_CREDIT_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/credit-manager/`,
        method: 'post',
        data,
      },
    },
  };
}

export function changeRegion(id, data) {
  return {
    type: types.CHANGE_REGION,
    payload: {
      client: 'default',

      request: {
        url: `/region/${id}/`,
        method: 'patch',
        data,
      },
    },
  };
}

export function handleChangeRegion(nameField, value) {
  return {
    type: types.HANDLE_CHANGE_REGION_SUCCESS,
    payload: {
      client: 'default',
      data: { nameField, value },
    },
  };
}

export function clearSignnatureFile() {
  return {
    type: types.HANDLE_CLEAR_SIGNATURE_SUCCESS,
    payload: {
      client: 'default',
    },
  };
}

export function clearLogoFile() {
  return {
    type: types.HANDLE_CLEAR_LOGO_SUCCESS,
    payload: {
      client: 'default',
    },
  };
}

export function handleClearRegion() {
  return {
    type: types.HANDLE_CLEAR_REGION_SUCCESS,
    payload: {
      client: 'default',
    },
  };
}

export function createManager(data) {
  return {
    type: types.CREATE_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/`,
        method: 'post',
        data,
      },
    },
  };
}

export function deleteManager(id) {
  return {
    type: types.DELETE_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/${id}/`,
        method: 'delete',
      },
    },
  };
}

export function changeManager(id, data) {
  return {
    type: types.CHANGE_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/${id}/`,
        method: 'patch',
        data,
      },
    },
  };
}

export function changeCreditManagers(id, data) {
  return {
    type: types.CHANGE_CREDIT_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/credit-manager/${id}/`,
        method: 'patch',
        data,
      },
    },
  };
}

export function createCustomer(data) {
  return {
    type: types.CREATE_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/create-customer/`,
        method: 'post',
        data,
      },
    },
  };
}

export function editCustomer(id, data) {
  return {
    type: types.CUSTOMER_UPDATE,
    payload: {
      client: 'default',
      request: {
        url: `/update-customer/${id}/`,
        method: 'patch',
        data,
      },
    },
  };
}

export function editCustomerPartial(data) {
  return {
    type: types.CUSTOMER_UPDATE_PARTIAL,
    payload: { data },
  };
}

export function getSales() {
  return {
    type: types.GET_SALES,
    payload: {
      client: 'default',
      request: {
        url: `/admin/sales-rep/`,
        method: 'get',
      },
    },
  };
}

export function createSales(data) {
  return {
    type: types.CREATE_SALES,
    payload: {
      client: 'default',
      request: {
        url: `/admin/sales-rep/`,
        method: 'post',
        data,
      },
    },
  };
}

export function deleteSales(id) {
  return {
    type: types.DELETE_SALES,
    payload: {
      client: 'default',
      request: {
        url: `/admin/sales-rep/${id}/`,
        method: 'delete',
      },
    },
  };
}

export function deleteCreditManager(id) {
  return {
    type: types.DELETE_CREDIT_MANAGER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/credit-manager/${id}/`,
        method: 'delete',
      },
    },
  };
}

export function changeSales(id, data) {
  return {
    type: types.CHANGE_SALES,
    payload: {
      client: 'default',
      request: {
        url: `/admin/sales-rep/${id}/`,
        method: 'patch',
        data,
      },
    },
  };
}

export function getManagerFullInfo(id) {
  return {
    type: types.GET_MANAGER_FULL_INFO,
    payload: {
      client: 'default',
      request: {
        url: `/admin/customer/${id}/full-info/`,
        method: 'get',
      },
    },
  };
}

export function getManagerReplacedFullInfo(id) {
  return {
    type: types.GET_MANAGER_REPLACED_FULL_INFO,
    payload: {
      client: 'default',
      request: {
        url: `/admin/customer/${id}/full-info/`,
        method: 'get',
      },
    },
  };
}

export function getSalesOrders(id, activePage = 1, search = '', status = '') {
  return {
    type: types.GET_SALES_ORDERS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/sales-rep/${id}/order/?page=${activePage}${search ? '&search=' + search : ''}${
          status ? '&status=' + status : ''
        }`,
        method: 'get',
      },
    },
  };
}

//REPLACE CUSTOMER INV-593

export function replaceCustomerOrders(id, data) {
  return {
    type: types.REPLACE_CUSTOMER,
    payload: {
      client: 'default',
      request: {
        url: `/admin/customer/${id}/merge-customers/`,
        method: 'post',
        data,
      },
    },
  };
}
