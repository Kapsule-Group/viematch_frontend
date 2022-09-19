import * as types from '../actions/constants';

const INITIAL_STATE = {
  loading: false,
  list: [],
  active_list: [],
  disabled_list: [],
  order: {},
  sales: null,
  payments: [],
  countUnread: null,
  loading_balance: false,
  balance: null,
  maximumBalance: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_ORDERS_SUCCESS:
      return { ...state, loading: false, list: action.payload.data };
    case types.GET_ACTIVE_ORDERS_SUCCESS:
      return { ...state, active_list: action.payload.data };
    case types.GET_DISABLED_ORDERS_SUCCESS:
      return { ...state, loading: false, disabled_list: action.payload.data };

    case types.POST_ESTIMATE_BALANCE:
      return {
        ...state,
        loading_balance: true,
        balance: null,
        maximumBalance: false,
      };

    case types.POST_ESTIMATE_BALANCE_SUCCESS:
      return {
        ...state,
        loading_balance: false,
        balance: action.payload.data,
        maximumBalance: false,
      };

    case types.CREATE_PROFORMA:
    case types.CREATE_ORDER:
    case types.CHANGE_ORDER:
    case types.PAYMENT_CREATE:
    case types.PARTIAL_CHANGE_ORDER:
    case types.REFUND_CREATE:
    case types.MARK_PAID:
    case types.CHANGE_CUSTOMER:
    case types.DISABLE_INVOICE:
    case types.GET_DISABLED_ORDERS:
      return { ...state, loading: true };

    case types.CREATE_PROFORMA_SUCCESS:
    case types.CREATE_PROFORMA_FAIL:
    case types.CREATE_ORDER_SUCCESS:
    case types.CREATE_ORDER_FAIL:
    case types.CHANGE_ORDER_SUCCESS:
    case types.CHANGE_ORDER_FAIL:
    case types.PAYMENT_CREATE_SUCCESS:
    case types.PAYMENT_CREATE_FAIL:
    case types.PARTIAL_CHANGE_ORDER_SUCCESS:
    case types.PARTIAL_CHANGE_ORDER_FAIL:
    case types.REFUND_CREATE_SUCCESS:
    case types.REFUND_CREATE_FAIL:
    case types.MARK_PAID_SUCCESS:
    case types.MARK_PAID_FAIL:
    case types.SWITCH_TO_INVOICE_FAIL:
    case types.DISABLE_INVOICE_FAIL:

    case types.CHANGE_CUSTOMER_FAIL:
    case types.GET_DISABLED_ORDERS_FAIL:
      return { ...state, loading: false };

    case types.DISABLE_INVOICE_SUCCESS:
    case types.CHANGE_CUSTOMER_SUCCESS:
      return { ...state, loading: false, order: action.payload.data };

    case types.POST_ESTIMATE_BALANCE_FAIL:
      return { ...state, loading_balance: false, maximumBalance: true };

    case types.SWITCH_TO_INVOICE: {
      return { ...state, order: {}, loading: true };
    }
    case types.SWITCH_TO_INVOICE_SUCCESS: {
      return { ...state, order: action.payload.data, loading: false };
    }
    case types.GET_SINGLE_ORDER:
    case types.APPROVE_PROFORMA:
    case types.GET_ORDERS: {
      return { ...state, order: {}, loading: true, balance: null };
    }
    case types.GET_SINGLE_ORDER_SUCCESS:
    case types.APPROVE_PROFORMA_SUCCESS:
      return { ...state, order: action.payload.data, loading: false };
    case types.GET_SALES_LIST_SUCCESS:
      return { ...state, sales: action.payload.data };
    case types.GET_PAYMENTS_LIST_SUCCESS:
      return { ...state, payments: action.payload.data };
    case types.CHANGE_TIN:
      this.state.order.user.tin = action.payload.data;
      return { ...state };

    case types.GET_UNREAD_ORDERS_SUCCESS:
      return { ...state, countUnread: action.payload.data };

    default:
      return state;
  }
}
