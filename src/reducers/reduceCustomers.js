import * as types from '../actions/constants';

const INITIAL_STATE = {
  certain_customer: {},
  error_customers: {},
  info: {},
  subs: {},
  regionsBalance: {},
  loading: false,
  searchLoading: false,
  statements: null,
  statements_success: false,
  statements_header: {},
  statements_header_success: false,
  pdfData: null,
  searchList: [],
  total_pages: '',
  count: '',
  first_paid_orders: [],
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CUSTOMERS_FAIL:
      return { ...state, error_customers: action.error.response.data };

    case types.GET_CERTAIN_CUSTOMER_SUCCESS:
      return { ...state, certain_customer: action.payload.data };

    case types.GET_USER_INNER_SUCCESS:
      return { ...state, info: action.payload.data };

    case types.GET_REGIONS_BALANCE:
    case types.GET_CUSTOMER_PDF:
      return { ...state, loading: true };

    
    case types.GET_CUSTOMER_STATEMENTS:
      return { ...state, loading: true, statements: null };

      
    case types.GET_CUSTOMER_STATEMENTS_HEADER:
      return { ...state, loading: true, statements_header: null, statements_header_success: false };
    case types.GET_REGIONS_BALANCE_SUCCESS:
      return { ...state, regionsBalance: action.payload.data, loading: false };

    case types.GET_FIRSTPAID_ORDERS:
      return { ...state, loading: true };
    case types.GET_FIRSTPAID_ORDERS_SUCCESS:
      return { ...state, loading: false ,  first_paid_orders: action.payload.data};
    case types.GET_FIRSTPAID_ORDERS_FAIL:
      return { ...state, loading: false};

    case types.GET_BALANCE_INFO:
      return { ...state, searchLoading: true };
    case types.GET_BALANCE_INFO_SUCCESS:
      return {
        ...state,
        searchLoading: false,
        searchList: action.payload.data.results,
        total_pages: action.payload.data.total_pages,
        count: action.payload.data.count,
      };

    case types.GET_REGIONS_BALANCE_FAIL:
      return { ...state, loading: false };
    case types.GET_USER_SUBS_SUCCESS:
      return { ...state, subs: action.payload.data };
    case types.CUSTOMER_UPDATE_SUCCESS:
      return { ...state, info: action.payload.data };
    case types.GET_CUSTOMER_STATEMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        statements: action.payload.data,
        statements_success: true,
      };
    case types.GET_CUSTOMER_STATEMENTS_FAIL:
      return { ...state, loading: false, statements_success: false };
    case types.GET_CUSTOMER_STATEMENTS_HEADER_SUCCESS:
      return {
        ...state,
        loading: false,
        statements_header: action.payload.data,
        statements_header_success: true,
      };
    case types.GET_CUSTOMER_STATEMENTS_HEADER_SUCCESS:
      return {
        ...state,
        loading: false,
        statements_header_success: false,
      };

    case types.CLEAR_CUSTOMER_SUCCESS:
      return {
        ...state,
        info: {
          email: '',
          customer_name: '',
          director: '',
          director_email: '',
          phone: '',
          region: null,
          province: null,
          district: null,
          sales_rep: null,
          tin: null,
        },
      };
    case types.GET_CUSTOMER_PDF_SUCCESS:
      return { ...state, loading: false, pdfData: action.payload.data };
    case types.CUSTOMER_UPDATE_PARTIAL:
      return { ...state, info: action.payload.data };
    default:
      return state;
  }
}
