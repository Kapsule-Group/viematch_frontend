//////////////////////////////auth actions//////////////////////////////

export const REGISTER_FIRST_STEP           = 'REGISTER_FIRST_STEP';
export const REGISTER_FIRST_STEP_FAIL      = 'REGISTER_FIRST_STEP_FAIL';
export const REGISTER_FIRST_STEP_SUCCESS      = 'REGISTER_FIRST_STEP_SUCCESS';

export const REGISTER_SECOND_STEP           = 'REGISTER_SECOND_STEP';

export const LOGIN           = 'LOGIN';
export const LOGIN_FAIL      = 'LOGIN_FAIL';

export const RESET_PASSWORD = 'RESET_PASSWORD';
export const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL';

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';

export const SEND_MESSAGE = 'SEND_MESSAGE';

////////////////////////////user actions//////////////////////////////////
export const GET_USERS_LIST     = 'GET_USERS_LIST';
export const GET_USERS_LIST_SUCCESS = 'GET_USERS_LIST_SUCCESS';

export const PATCH_USER         = 'PATCH_USER';
export const PATCH_USER_FAIL         = 'PATCH_USER_FAIL';

export const POST_ADD_USER         = 'POST_ADD_USER';
export const POST_ADD_USER_FAIL         = 'POST_ADD_USER_FAIL';

export const DELETE_USER         = 'DELETE_USER';

export const RESET_USER_ERROR         = 'RESET_USER_ERROR';

////////////////////////////stock actions//////////////////////////////////

export const GET_STOCK              = 'GET_STOCK';
export const GET_STOCK_SUCCESS      = 'GET_STOCK_SUCCESS';

export const SEARCH_STOCK              = 'SEARCH_STOCK';
export const SEARCH_STOCK_SUCCESS      = 'SEARCH_STOCK_SUCCESS';

export const PATCH_QUANTITY         = 'PATCH_QUANTITY';
export const PATCH_QUANTITY_FAIL    = 'PATCH_QUANTITY_FAIL';

export const POST_REQUEST           = 'POST_REQUEST';
export const POST_REQUEST_FAIL      = 'POST_REQUEST_FAIL';

///////////////////////////////////////////////////////////////////////////

export const GET_CLINIC_LOG = 'GET_CLINIC_LOG';
export const GET_CLINIC_LOG_SUCCESS = 'GET_CLINIC_LOG_SUCCESS';

export const GET_CLINIC_DASH_BOARD = 'GET_CLINIC_DASH_BOARD';
export const GET_CLINIC_DASH_BOARD_SUCCESS = 'GET_CLINIC_DASH_BOARD_SUCCESS';


export const GET_ACTIVITY = 'GET_ACTIVITY';
export const GET_ACTIVITY_SUCCESS = 'GET_ACTIVITY_SUCCESS';

//////////////////////////////categories actions//////////////////////////////

export const PAGINATE = 'PAGINATE';
export const PAGINATE_FAIL = 'PAGINATE_FAIL';

export const GET_CAT = 'GET_CAT';
export const GET_CAT_FAIL = 'GET_CAT_FAIL';

export const GET_CURRENT_CAT = 'GET_CURRENT_CAT';
export const GET_CURRENT_CAT_FAIL = 'GET_CURRENT_CAT_FAIL';

export const POST_CAT = 'POST_CAT';
export const POST_CAT_FAIL = 'POST_CAT_FAIL';

export const PUT_CAT = 'PUT_CAT';
export const PUT_CAT_FAIL = 'PUT_CAT_FAIL';

export const DELETE_CAT = 'DELETE_CAT';
export const DELETE_CAT_FAIL = 'DELETE_CAT_FAIL';

export const GET_SUB_CAT = 'GET_SUB_CAT';
export const GET_SUB_CAT_FAIL = 'GET_SUB_CAT_FAIL';

export const POST_SUB_CAT = 'POST_SUB_CAT';
export const POST_SUB_CAT_FAIL = 'POST_SUB_CAT_FAIL';

export const DELETE_SUB_CAT = 'DELETE_SUB_CAT';
export const DELETE_SUB_CAT_FAIL = 'DELETE_SUB_CAT_FAIL';

export const GET_PRODUCT = 'GET_PRODUCT';
export const GET_PRODUCT_FAIL = 'GET_PRODUCT_FAIL';

export const PUT_PRODUCT = 'PUT_PRODUCT';
export const PUT_PRODUCT_FAIL = 'PUT_PRODUCT_FAIL';

export const POST_PRODUCT = 'POST_PRODUCT';
export const POST_PRODUCT_FAIL = 'POST_PRODUCT_FAIL';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const DELETE_PRODUCT_FAIL = 'DELETE_PRODUCT_FAIL';

export const CHECK_STOCKS = 'CHECK_STOCKS';
export const CHECK_STOCKS_FAIL = 'CHECK_STOCKS_FAIL';

export const GET_PRODS_FOR_STOCKS = 'GET_PRODS_FOR_STOCKS';
export const GET_PRODS_FOR_STOCKS_FAIL = 'GET_PRODS_FOR_STOCKS_FAIL';

export const CREATE_INVENTORY = 'CREATE_INVENTORY';
export const CREATE_INVENTORY_FAIL = 'CREATE_INVENTORY_FAIL';

export const PATCH_INVENTORY = 'PATCH_INVENTORY';
export const PATCH_INVENTORY_FAIL = 'PATCH_INVENTORY_FAIL';