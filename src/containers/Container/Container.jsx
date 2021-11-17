import React, { Component, Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Head from "../../components/Head/Head";
import Panel from "../../components/Panel/Panel";
import Catalog from "../../components/Catalog/Catalog";
import Dashboard from "../../components/Dashboard/Dashboard";
import UserManagement from "../../components/UserManagement/UserManagement";
import StockManagement from "../../components/StockManagement/StockManagement";
import ShopCart from "../../components/ShoppingCart/Cart";
import Activity from "../../components/Activity/Activity";
import Footer from "../../components/Footer/Footer";
import Category from "../../components/Category/Category";
import SearchResults from "../../components/SearchResults/SearchResults";
import ProductDetails from "../../components/ProductDetails/ProductDetails";

class Container extends Component {
    render() {
        const { match, history } = this.props;
        const role = localStorage.role;
        // if (!localStorage.token) return <Redirect to="/auth" />;
        return (
            <Fragment>
                <Head history={history} match={match} />
                <div className="page">
                    {/* <Panel location={history.location} /> */}
                    <Switch>
                        <Route
                            path={`${match.url}/dashboard`}
                            // render={() => role !== 'user' ? <Dashboard /> : <Redirect to="/main/stock-management"/>}
                            component={Dashboard}
                        />
                        <Route path={`${match.url}/activity`} exact component={Activity} />
                        <Route
                            path={`${match.url}/catalog`}
                            exact
                            render={() => <Catalog history={history} catalog={true} />}
                        />
                        <Route path={`${match.url}/search-results`} exact component={SearchResults} />
                        <Route path={`${match.url}/product-details/:id`} exact component={ProductDetails} />

                        {/* <Route
                            path={`${match.url}/catalog/category/:id`}
                            render={() =>
                                role !== "user" ? (
                                    <Catalog history={history} catalog={false} />
                                ) : (
                                    <Redirect to="/main/stock-management" />
                                )
                            }
                        /> */}
                        <Route path={`${match.url}/catalog/category/:id`} render={props => <Category {...props} />} />

                        <Route path={`${match.url}/shoppingCart`} component={ShopCart} />

                        <Route path={`${match.url}/user-management`} exact component={UserManagement} />
                        <Route path={`${match.url}/stock-management`} component={StockManagement} />
                        <Route render={() => <p>Not found</p>} />
                    </Switch>
                </div>
                <Footer />
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        // user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            // getUser,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
