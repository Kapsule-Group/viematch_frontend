import React, { Component, Fragment } from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Head from '../../components/Head/Head';
import Panel from '../../components/Panel/Panel';
import Catalog from '../../components/Catalog/Catalog';
import Dashboard from '../../components/Dashboard/Dashboard';
import UserManagement from '../../components/UserManagement/UserManagement';
import StockManagement from '../../components/StockManagement/StockManagement';
import ShopCart from '../../components/ShoppingCart/Cart';
import Activity from '../../components/Activity/Activity';


class Container extends Component {
    render() {
        const { match, history } = this.props;
        const role = localStorage.role;
        if (!localStorage.token) return <Redirect to="/auth" />;
        return (
            <Fragment>
                <Head history={history} match={match} />
                <div className="page">
                    <Panel location={history.location}/>
                    <Switch>
                        <Route
                            path={`${match.url}/dashboard`}
                            render={() => role !== 'user' ? <Dashboard /> : <Redirect to="/main/stock-management"/>}
                        />
                        <Route
                            path={`${match.url}/activity`}
                            exact
                            render={() => role !== 'user' ? <Activity /> : <Redirect to="/main/stock-management"/>}
                        />
                        <Route
                            path={`${match.url}/catalog`}
                            exact
                            render={() => role !== 'user' ? <Catalog history={history} catalog={true} /> : <Redirect to="/main/stock-management"/>}
                        />
                        <Route
                            path={`${match.url}/catalog/category/:id`}
                            render={() => role !== 'user' ? <Catalog history={history} catalog={false}/> : <Redirect to="/main/stock-management" />}
                        />

                        <Route
                            path={`${match.url}/shoppingCart`}
                            render={() => role !== 'user' ? <ShopCart /> : <Redirect to="/main/stock-management"/>}
                        />

                        <Route
                            path={`${match.url}/user-management`}
                            exact
                            render={() => role === 'clinic' ? <UserManagement /> : <Redirect to="/main/stock-management"/>}
                        />
                        <Route path={`${match.url}/stock-management`} component={StockManagement} />
                        <Route render={()=>(<p>Not found</p>)} />
                    </Switch>
                </div>
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
    return bindActionCreators({
        // getUser,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
