import * as types from '../actions/constants';
import { toast } from 'react-toastify';

const INITIAL_STATE = {
  list: [],
  loading: false,
  orders: {},
  regions: [],
  regionsList: [],
  unnecessaryOrders: [],
  replacedOrders: [],
  innerRegion: {
    name: '',
    prefix: '',
    currency: '',
    vat: 0,
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    address5: '',
    address6: '',
    address7: '',
    address8: '',
    bank_info1: '',
    bank_info2: '',
    bank_info3: '',
    bank_info4: '',
    image: null,
    logo: null,
    header: '',
    footer1: '',
    footer2: '',
    phone_number: '',
    delivery_info1: '',
    delivery_info2: '',
    delivery_info3: '',
  },
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_MANAGERS_SUCCESS:
      return { ...state, list: action.payload.data };
    case types.GET_CREDIT_MANAGERS_SUCCESS:
      return { ...state, list: action.payload.data };
    case types.GET_SALES_SUCCESS:
      return { ...state, loading: false, list: action.payload.data };
    case types.GET_REGIONS_SUCCESS:
      return {
        ...state,
        regions: action.payload.data,
        regionsList: action.payload.data.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      };

    case types.GET_SALES_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload.data };
    case types.GET_REGION_SUCCESS:
      return { ...state, innerRegion: action.payload.data };
    case types.CHANGE_REGION_SUCCESS:
      toast('Region data was successfully updated');
      return { ...state, loading: false, innerRegion: action.payload.data };

    case types.HANDLE_CLEAR_REGION_SUCCESS:
      return {
        ...state,
        innerRegion: {
          name: '',
          prefix: '',
          currency: '',
          vat: 0,
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          address5: '',
          address6: '',
          address7: '',
          address8: '',
          bank_info1: '',
          bank_info2: '',
          phone_number: '',
          bank_info3: '',
          bank_info4: '',
          image: null,
          logo: null,
          header: '',
          footer1: '',
          footer2: '',
          delivery_info1: '',
          delivery_info2: '',
          delivery_info3: '',
        },
      };

    case types.HANDLE_CLEAR_SIGNATURE_SUCCESS:
      return {
        ...state,
        innerRegion: {
          ...state.innerRegion,
          image: null,
        },
      };
    case types.HANDLE_CLEAR_LOGO_SUCCESS:
      return {
        ...state,
        innerRegion: {
          ...state.innerRegion,
          logo: null,
        },
      };

    case types.HANDLE_CHANGE_REGION_SUCCESS:
      const { nameField, value } = action.payload.data;
      state.innerRegion = { ...state.innerRegion, [nameField]: value };
      return { ...state };

    case types.CREATE_MANAGER:
    case types.CREATE_SALES:
    case types.CREATE_CREDIT_MANAGER:
    case types.GET_MANAGER_FULL_INFO:
    case types.REPLACE_PRODUCT:
    case types.GET_MANAGER_REPLACED_FULL_INFO:
      return { ...state, loading: true };

    case types.GET_MANAGER_FULL_INFO_SUCCESS:
      return { ...state, loading: false, unnecessaryOrders: action.payload.data.orders };

    case types.GET_MANAGER_REPLACED_FULL_INFO_SUCCESS:
      return { ...state, loading: false, replacedOrders: action.payload.data.orders };

    case types.CREATE_MANAGER_SUCCESS:
    case types.CREATE_MANAGER_FAIL:
    case types.CREATE_SALES_SUCCESS:
    case types.CREATE_SALES_FAIL:
    case types.CREATE_CREDIT_MANAGER_SUCCESS:
    case types.CREATE_CREDIT_MANAGER_FAIL:
    case types.GET_MANAGER_FULL_INFO_FAIL:
    case types.GET_MANAGER_REPLACED_FULL_INFO_FAIL:
    case types.REPLACE_PRODUCT_FAIL:
    case types.REPLACE_PRODUCT_SUCCESS:
      return { ...state, loading: false };

    default:
      return state;
  }
}
