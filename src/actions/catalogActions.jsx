import * as types from "./constants.jsx";
// categories
export function addCat(data) {
    return {
        type: types.POST_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/`,
                method: "POST",
                data,
            },
        },
    };
}

export function getCat() {
    return {
        type: types.GET_CAT,
        payload: {
            client: "default",
            request: {
                url: `/categories/`,
                method: "GET",
            },
        },
    };
}

export function getCategories() {
    return {
        type: types.GET_CATEGORIES,
        payload: {
            client: "default",
            request: {
                url: `/admin/subcategory-search/`,
                method: "GET",
            },
        },
    };
}

export function editCat(id, data) {
    return {
        type: types.PUT_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/${id}/`,
                method: "PUT",
                data,
            },
        },
    };
}

export function deleteCat(id) {
    return {
        type: types.DELETE_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/${id}`,
                method: "DELETE",
            },
        },
    };
}
// subcategories
export function getSubcat(id) {
    return {
        type: types.GET_SUB_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategories/${id}/`,
                method: "GET",
            },
        },
    };
}

export function getCurrentCat(id) {
    return {
        type: types.GET_CURRENT_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/${id}/`,
                method: "GET",
            },
        },
    };
}
// products
export function addProduct(data) {
    return {
        type: types.GET_SUB_CAT,
        payload: {
            client: "default",
            request: {
                url: `/product/`,
                method: "POST",
                data,
            },
        },
    };
}

export function editProd(id, data) {
    return {
        type: types.PUT_PRODUCT,
        payload: {
            client: "default",
            request: {
                url: `/product/${id}/`,
                method: "PUT",
                data,
            },
        },
    };
}

export function deleteProd(id) {
    return {
        type: types.DELETE_PRODUCT,
        payload: {
            client: "default",
            request: {
                url: `/product/${id}`,
                method: "DELETE",
            },
        },
    };
}
// paginate
export function paginate(selectedPageNumber, id, search = "") {
    return {
        type: types.PAGINATE,
        payload: {
            client: "default",
            request: {
                url: `/${
                    id ? "subcategories/" + id + "/" : "categories/"
                }?search=${search}&page=${selectedPageNumber}`,
                method: "GET",
            },
        },
    };
}
