import * as types from './constants.jsx';


export function getSingleProd() {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/SingleProduct`,
                method: "GET",
            }
        }
    };
}

export function getProdDescription(prodId) {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/singelProd/?id=${prodId}`,
                method: "GET",
            }
        }
    };
}

export function storeSearch(search, category) {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/storeSearch/?search=${search}&category=${category}`,
                method: "GET",
            }
        }
    };
}



export function listCategories() {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/allcategories/`,
                method: "GET",
            }
        }
    };
}

export function listBrands() {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/listingBrands/`,
                method: "GET",
            }
        }
    };
}


export function listBrandsCategory(type, value) {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/filterbrandCategory/?filter=${type}&type=${value}`,
                method: "GET",
            }
        }
    };
}


export function getFeaturedProd() {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/featured`,
                method: "GET",
            }
        }
    };
}

export function getSlideProd() {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/slidings`,
                method: "GET",
            }
        }
    };
}

export function getTrendsProd() {
    return {
        type: types.GET_CAT,
        payload: {
            client: 'default',
            request: {
                url: `/trends`,
                method: "GET",
            }
        }
    };
}

export function resetErrorUsers() {
    return { type: types.RESET_USER_ERROR };
}




export const addToCart = (items, product) => (dispatch) => {
  const cartItems = items.slice();
  let productAlreadyInCart = false;

  cartItems.forEach((cp) => {
    if (cp.id === product.id) {
      cp.count += 1;
      productAlreadyInCart = true;
    }
  });

  if (!productAlreadyInCart) {
    cartItems.push({ ...product, count: 1 });
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  dispatch({ type: types.ADD_TO_CART, payload: { cartItems } });
};

export const removeFromCart = (items, product) => (dispatch) => {
  const cartItems = items.slice().filter((a) => a.id !== product.id);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  dispatch({ type: types.REMOVE_FROM_CART, payload: { cartItems } });
};
