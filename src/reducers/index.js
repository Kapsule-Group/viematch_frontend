import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';
import { reducer as formReducer } from 'redux-form';
import  reduceAuth from '../reducers/reduceAuth';
import reduceUsers from "./reduceUsers";
import reduceCatalog from "./reduceCatalog";
import  reduceDashboard from './reduceDashboard';
import  reduceActivity from './reduceActivity';
import reduceStock from "./reduceStock";


const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    form: formReducer,
    auth: reduceAuth,
    users: reduceUsers,
    catalog: reduceCatalog,
    dashboard: reduceDashboard,
    activity: reduceActivity,
    stock: reduceStock,
});

export default rootReducer;