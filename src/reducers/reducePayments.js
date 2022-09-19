import * as types from "../actions/constants";

const INITIAL_STATE = {
  list: {},
  invoices: [],
  loading: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_PAYMENTS_SUCCESS:
      return { ...state, list: action.payload.data };
    case types.INVOICE_LIVE_SEARCH_SUCCESS:
      return { ...state, invoices: action.payload.data };

    case types.ADD_PAYMENT:
      return { ...state, loading: true };

    case types.ADD_PAYMENT_FAIL:
    case types.ADD_PAYMENT_SUCCESS:
      return { ...state, loading: false };

    default:
      return state;
  }
}
