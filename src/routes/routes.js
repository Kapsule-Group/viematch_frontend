import React from "react";
import App from "../containers/App";
import { Route, Switch, Redirect } from "react-router-dom";
import Container from "../containers/Container/Container";
import AuthContainer from "../containers/AuthContainer/AuthContainer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default (
    <App>
        <Switch>
            <Route
                path="/"
                exact
                render={() =>
                    !!localStorage.token ? (
                        <Redirect to="/main/dashboard" />
                    ) : (
                        <Redirect to="/login" />
                    )
                }
            />
            <Route path="/login" component={AuthContainer} />
            <Route path="/main" component={Container} />
            <Route render={() => <p>Not found</p>} />
        </Switch>
        <ToastContainer />
    </App>
);
