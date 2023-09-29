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
                data
            }
        }
    };
}

export function getCat() {
    return {
        type: types.GET_CAT,
        payload: {
            client: "default",
            request: {
                url: `/categories/`,
                method: "GET"
            }
        }
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
                data
            }
        }
    };
}

export function deleteCat(id) {
    return {
        type: types.DELETE_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/${id}`,
                method: "DELETE"
            }
        }
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
                method: "GET"
            }
        }
    };
}

export function getCurrentCat(id) {
    return {
        type: types.GET_CURRENT_CAT,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/${id}/`,
                method: "GET"
            }
        }
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
                data
            }
        }
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
                data
            }
        }
    };
}

export function deleteProd(id) {
    return {
        type: types.DELETE_PRODUCT,
        payload: {
            client: "default",
            request: {
                url: `/product/${id}`,
                method: "DELETE"
            }
        }
    };
}
// paginate
export function paginate(selectedPageNumber, id) {
    return {
        type: types.PAGINATE,
        payload: {
            client: "default",
            request: {
                url: `/${id ? "subcategories/" + id : "categories/"}?page=${selectedPageNumber}`,
                method: "GET"
            }
        }
    };
}
// add to stock
export function getProdsForStocks(id) {
    return {
        type: types.GET_PRODS_FOR_STOCKS,
        payload: {
            client: "default",
            request: {
                url: `/subcategory/products/`,
                method: "GET"
            }
        }
    };
}

export function checkStocks(id) {
    return {
        type: types.CHECK_STOCKS,
        payload: {
            client: "default",
            request: {
                url: `/product/${id}/`,
                method: "GET"
            }
        }
    };
}

export function createInventory(data) {
    return {
        type: types.CREATE_INVENTORY,
        payload: {
            client: "default",
            request: {
                url: `/inventory/`,
                method: "POST",
                data
            }
        }
    };
}

export function createInventoryNew(data) {
    return {
        type: types.CUSTOMER_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/customer_stock/`,
                method: "POST",
                data
            }
        }
    };
}

export function patchInventory(id, data) {
    return {
        type: types.PATCH_INVENTORY,
        payload: {
            client: "default",
            request: {
                url: `/inventory/${id}/`,
                method: "PATCH",
                data
            }
        }
    };
}

export function getSearchList(id) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory/?id__in=${id}`,
                method: "GET"
            }
        }
    };
}

export function getSearchListAll(id) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory-all/?id__in=${id}`,
                method: "GET"
            }
        }
    };
}

export function searchStock(marker, prod) {
    return {
        type: types.SEARCH_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory-search/?stock=${marker}${prod && prod.length !== 0 ? `&search=${prod}` : ""}`,
                method: "GET"
            }
        }
    };
}

export function searchAllStock(marker, prod = null, all = null, brand = null, cat = null, subCat = null) {
    return {
        type: types.SEARCH_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory-search-all/?stock=${marker}${prod && prod.length !== 0 ? `&search_prod=${prod}` : ""}${
                    all && all.length !== 0 ? `&search_all=${all}` : ""
                }${brand && brand.length !== 0 ? `&search_brand=${brand}` : ""}${
                    cat && cat.length !== 0 ? `&search_cat=${cat}` : ""
                }${subCat && subCat.length !== 0 ? `&search_sub_cat=${subCat}` : ""}`,
                method: "GET"
            }
        }
    };
}

export function specialSearch(type, query) {
    return {
        type: types.SEARCH_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/${type}/?search=${query}`,
                method: "GET"
            }
        }
    };
}

export function getStock(marker, page, quantity) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventory/?${quantity ? "ordering=" + quantity + "&" : ""}${
                    page ? "page=" + page + "&" : ""
                }stock=${marker}`,
                method: "GET"
            }
        }
    };
}

export function searchProducts(type, value) {
    return {
        type: types.GET_STOCK,
        payload: {
            client: "default",
            request: {
                url: `/inventorySearching/?type=${type}&value=${value}`,
                method: "GET"
            }
        }
    };
}

export function searchNewCategories(search) {
    return {
        type: types.GET_CAT,
        payload: {
            client: "default",
            request: {
                url: `/categories/?search=${search}`,
                method: "GET"
            }
        }
    };
}
export function searchNewProducts(search) {
    return {
        type: "SEARCH_NEW_PRODUCTS",
        payload: {
            client: "default",
            request: {
                url: `/products/?search=${search}`,
                method: "GET"
            }
        }
    };
}

export function searchNewSubCategories(search) {
    return {
        type: "SEARCH_NEW_SUBCATEGORIES",
        payload: {
            client: "default",
            request: {
                url: `/subcategories/?search=${search}`,
                method: "GET"
            }
        }
    };
}

export function getMainCatalog() {
    return {
        type: types.GET_MAIN_CATALOG,
        payload: {
            client: "default",
            request: {
                url: `/catalog-root/`,
                method: "GET"
            }
        }
    };
}

export function getPromotionals() {
    return {
        type: types.GET_PROMOTIONALS,
        payload: {
            client: "default",
            request: {
                url: `/promotion-tile/`,
                method: "GET"
            }
        }
    };
}

export function getSearchResultsCategories(id = "") {
    return {
        type: types.GET_SEARCH_RESULTS_CATEGORIES,
        payload: {
            client: "default",
            request: {
                url: `/category-tree/${id ? "?id=" + id : ""}`,
                method: "GET"
            }
        }
    };
}

export function getSearchResults(search = "", id = "", page, brands = "") {
    return {
        type: types.GET_SEARCH_RESULTS,
        payload: {
            client: "default",
            request: {
                url: `/catalog-search/?search=${search}${id ? "&category_id=" + id : ""}${
                    brands ? "&brands=" + brands : ""
                }${page ? "&page=" + page : ""}`,
                method: "GET"
            }
        }
    };
}

export function getCategoryResults(id = "", page = 1, brands = "") {
    return {
        type: types.GET_CATEGORY_RESULTS,
        payload: {
            client: "default",
            request: {
                url: `/catalog/${id}/${page ? "?page=" + page : ""}${brands ? "&brands=" + brands : ""}`,
                method: "GET"
            }
        }
    };
}

export function getBrands(search = "", id = "") {
    return {
        type: types.GET_BRANDS,
        payload: {
            client: "default",
            request: {
                url: `/brand-filter/?search=${search}${id ? "&category_id=" + id : ""}`,
                method: "GET"
            }
        }
    };
}

export function getBrandsCategory(id = "") {
    return {
        type: types.GET_BRANDS,
        payload: {
            client: "default",
            request: {
                url: `/brand-filter/${id ? "?category_id=" + id : ""}`,
                method: "GET"
            }
        }
    };
}

export function getProductDetails(id) {
    return {
        type: types.GET_PRODUCT_DETAILS,
        payload: {
            client: "default",
            request: {
                url: `/catalog/product/${id}/`,
                method: "GET"
            }
        }
    };
}

export function getRecommendedProducts(id) {
    return {
        type: types.GET_RECOMMENDED,
        payload: {
            client: "default",
            request: {
                url: `/catalog/product/${id}/recommended/`,
                method: "GET"
            }
        }
    };
}
