import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createBrowserHistory } from "history";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import { multiClientMiddleware } from "redux-axios-middleware";

import api from "./actions/api";
import routes from "./routes/routes";
import rootReducer from "./reducers";

const axiosMiddlewareOptions = {
    interceptors: {
        request: [
            (action, config) => {
                if (localStorage.token || localStorage.token_res) {
                    let token = localStorage.token ? localStorage.token : localStorage.token_res;
                    config.headers["Authorization"] = "Token " + token;
                }
                return config;
            }
        ],
        response: [
            {
                success: ({ dispatch }, response) => {
                    return response;
                },
                error: ({ dispatch }, error) => {
                    if (error.response.status === 401) {
                        localStorage.removeItem("token");
                        // window.location.reload();
                    }
                    return Promise.reject(error);
                }
            }
        ]
    }
};

const history = createBrowserHistory();
const appRouterMiddleware = routerMiddleware(history);
const createStoreWithMiddleware = applyMiddleware(
    multiClientMiddleware(api, axiosMiddlewareOptions),
    appRouterMiddleware
)(createStore);
const store = createStoreWithMiddleware(
    rootReducer(history),
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history} children={routes} />
    </Provider>,
    document.getElementById("wrapper")
);
