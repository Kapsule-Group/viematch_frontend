import * as types from './constants.jsx';

export function getProducts(incomplete = 'false') {
  return {
    type: types.GET_PRODUCTS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/?is_incomplete=${incomplete}`,
        method: 'GET',
      },
    },
  };
}

export function needDot() {
  return {
    type: types.NEED_DOT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/?is_incomplete=true`,
        method: 'GET',
      },
    },
  };
}

// paginate
export function paginateProducts(selectedPageNumber, search = '', incomplete = 'false') {
  return {
    type: types.PAGINATE_PRODUCTS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/?is_incomplete=${incomplete}&search=${search}&page=${selectedPageNumber}`,
        //url: `/admin/product/?search=${search}&page=${selectedPageNumber}`,
        method: 'GET',
      },
    },
  };
}

export function searchProducts(selectedPageNumber, search = '', incomplete = 'false') {
  return {
    type: types.PAGINATE_PRODUCTS,
    payload: {
      client: 'default',
      request: {
        //url: `/admin/product/?is_incomplete=${incomplete}&search=${search}&page=${selectedPageNumber}`,
        url: `/admin/product/?search=${search}&page=${selectedPageNumber}`,
        method: 'GET',
      },
    },
  };
}

export function addProductNew(data) {
  return {
    type: types.GET_SUB_CAT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/`,
        method: 'POST',
        data,
      },
    },
  };
}

export function editProductNew(data, id) {
  return {
    type: types.GET_SUB_CAT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function editQtyProduct(data, id) {
  return {
    type: types.GET_SUB_CAT,
    payload: {
      client: 'default',
      request: {
        url: `/customer/inventory/quantity-update/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function editQtyProductMod(data, id) {
  return {
    type: types.GET_SUB_CAT,
    payload: {
      client: 'default',
      request: {
        url: `/manager/product/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function deleteProductNew(id) {
  const data = { deleted: true };
  return {
    type: types.GET_SUB_CAT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/`,
        method: 'PATCH',
        data,
      },
    },
  };
}

export function getManagerProducts(id) {
  return {
    type: types.GET_PRODUCTS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/${id}/product/`,
        method: 'GET',
      },
    },
  };
}

// paginate
export function paginateManagerProducts(id, selectedPageNumber, search = '') {
  return {
    type: types.PAGINATE_PRODUCTS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/regional-manager/${id}/product/?search=${search}&page=${selectedPageNumber}`,
        method: 'GET',
      },
    },
  };
}

export function getSingleProduct(id) {
  return {
    type: types.GET_SINGLE_PRODUCT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/`,
        method: 'GET',
      },
    },
  };
}

export function getBrands() {
  return {
    type: types.GET_BRANDS,
    payload: {
      client: 'default',
      request: {
        url: `/admin/brand-search/`,
        method: 'GET',
      },
    },
  };
}

export function addImage(id, data) {
  return {
    type: types.ADD_NEW_IMG,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/image/`,
        method: 'POST',
        data,
      },
    },
  };
}

export function deleteImage(id) {
  return {
    type: types.DELETE_NEW_IMG,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/image/${id}/`,
        method: 'delete',
      },
    },
  };
}

export function addBrand(data) {
  return {
    type: types.ADD_BRAND,
    payload: {
      client: 'default',
      request: {
        url: `/admin/brand/`,
        method: 'post',
        data,
      },
    },
  };
}

//REPLACE PRODUCT INV-556

export function replaceProductImOrders(id, data) {
  return {
    type: types.REPLACE_PRODUCT,
    payload: {
      client: 'default',
      request: {
        url: `/admin/product/${id}/replace/`,
        method: 'post',
        data,
      },
    },
  };
}
