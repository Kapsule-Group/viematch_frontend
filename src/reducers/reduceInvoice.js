import * as types from "../actions/constants";

const INITIAL_STATE = {
  invoice: [],
  invoice_options: [],
  invoice_product_options: [],
  unnecessary_products: [],
  replaced_products: [],
  activityOrder: {},

  loading: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_INVOICE_SUCCESS:
      return { ...state, invoice: action.payload.data };
    case types.GET_INVOICE_OPTIONS_SUCCESS:
      return { ...state, invoice_options: action.payload.data };
    case types.GET_INVOICE_PRODUCT_OPTIONS_SUCCESS:
      return { ...state, invoice_product_options: action.payload.data };
    case types.GET_ACTIVITY_ORDER_SUCCESS:
      return { ...state, activityOrder: action.payload.data };

    case types.GET_REPLACED:
    case types.GET_UNNECESSARY:
      return { ...state, loading: true };

    case types.GET_REPLACED_FAIL:
    case types.GET_UNNECESSARY_FAIL:
      return { ...state, loading: false };

    case types.GET_UNNECESSARY_SUCCESS:
      return {
        ...state,
        loading: false,
        unnecessary_products: action.payload.data,
      };
    case types.GET_REPLACED_SUCCESS:
      return {
        ...state,
        loading: false,
        replaced_products: action.payload.data,
      };

    default:
      return state;
  }
}
