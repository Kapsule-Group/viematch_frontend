import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { reducer as formReducer } from "redux-form";

import AuthReducer from "./reduceAuth";
import CustomersReducer from "./reduceCustomers";
import RequestsReducer from "./reduceRequests";
import DashboardReducer from "./reduceDashboard";
import InvoicesReducer from "./reduceInvoice";
import ManagersReducer from "./reduceManagers";
import OrdersReducer from "./reduceOrders";
import ProductReducer from "./reduceProducts";
import SubscriptionReducer from "./reduceSubscriptions";
import PaymentsReducer from "./reducePayments";

const rootReducer = (history) =>
    combineReducers({
        router: connectRouter(history),
        form: formReducer,
        auth: AuthReducer,
        customers: CustomersReducer,
        requests: RequestsReducer,
        dashboard: DashboardReducer,
        invoices: InvoicesReducer,
        managers: ManagersReducer,
        orders: OrdersReducer,
        products: ProductReducer,
        subscriptions: SubscriptionReducer,
        payments: PaymentsReducer,
    });

export default rootReducer;
