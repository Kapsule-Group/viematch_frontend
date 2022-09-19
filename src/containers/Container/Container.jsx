import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Head from '../../components/Head/Head';
import Panel from '../../components/Panel/Panel';
import Dashboard from '../../components/Dashboard/Dashboard';
import Customers from '../../components/Customers/Customers';
import Catalog from '../../components/Catalog/Catalog';
import Subscriptions from '../../components/Subscriptions/Subscriptions';
import SubscriptionsInner from '../../components/Subscriptions/SubscriptionsInner/SubscriptionsInner';
import CustomerStatementsInner from '../../components/CustomerStatements/CustomerStatementsInner/CustomerStatementsInner';
import CustomerStatements from '../../components/CustomerStatements/CustomerStatements';
// import Requests from '../../components/Requests/Requests';
import Invoice from '../../components/Invoice/Invoice';
import CustomersInner from '../../components/Customers/CustomersInner/CustomersInner';
// import RequestsComplete from '../../components/Requests/RequestsComplete/RequestsComplete';
import Products from './../../components/Products/Products';
import RegionalManagers from './../../components/RegionalManagers/RegionalManagers';
import AddRegion from './../../components/RegionalManagers/AddRegion';
import OrdersInnerAdd from './../../components/Orders/OrdersInner/OrdersInnerAdd';
import ProformaInnerAdd from './../../components/Orders/OrdersInner/ProformaInnerAdd';
import OrdersInnerEdit from './../../components/Orders/OrdersInner/OrdersInnerEdit';
import Orders from './../../components/Orders/Orders';
import InnerManager from '../../components/RegionalManagers/InnerManager';
import ProductInnerAdd from '../../components/Products/ProductInner/ProductInnerAdd';
import ProductInnerReplace from '../../components/Products/ProductInner/ProductInnerReplace';
import ProductInnerEdit from '../../components/Products/ProductInner/ProductInnerEdit';
import InnerSales from '../../components/RegionalManagers/InnerSales';
import SalesRequests from '../../components/SalesRequests/SalesRequests';
import SalesRequestInner from '../../components/SalesRequests/SalesRequestInner';
import Payments from '../../components/Payments/Payments';
import OrdersSalesInnerEdit from './../../components/Orders/OrdersInner/OrdersSalesInnerEdit';
import CustomerInnerReplace from '../../components/Customers/CustomerReplace/CustomerInnerReplace';

class Container extends Component {
  render() {
    const {
      match,
      history,
      user: { role },
    } = this.props;

    const {
      location: { pathname },
    } = history;

    if (!localStorage.token) return <Redirect to="/login" />;

    if (role && role === 'sales' && pathname === '/main/dashboard') {
      return <Redirect to="/main/sales-requests" />;
    }

    if (role && role === 'credit' && pathname === '/main/customers') {
      return <Redirect to="/main/customer-statements" />;
    }

    return (
      <Fragment>
        <Head history={history} match={match} />
        <div className="page">
          {/* {role && role !== "sales" && ( */}
          {role && <Panel location={history.location} />}
          <Switch>
            <Route path={`${match.url}/dashboard`} component={Dashboard} />
            <Route path={`${match.url}/customers`} exact component={Customers} />
            <Route path={`${match.url}/regional-managers`} exact component={RegionalManagers} />
            <Route path={`${match.url}/regional-managers/add-region`} exact component={AddRegion} />
            <Route
              path={`${match.url}/regional-managers/edit-redion/:id`}
              exact
              component={AddRegion}
            />
            <Route path={`${match.url}/regional-managers/:id`} exact component={InnerManager} />
            <Route path={`${match.url}/inner-sales/:id`} exact component={InnerSales} />
            <Route path={`${match.url}/catalog`} exact component={Catalog} />
            <Route path={`${match.url}/payments`} exact component={Payments} />
            <Route path={`${match.url}/orders`} exact component={Orders} />
            <Route
              path={`${match.url}/orders-proforma-inner-add`}
              exact
              component={ProformaInnerAdd}
            />
            <Route
              path={`${match.url}/orders-proforma-inner-add/:id`}
              exact
              component={OrdersInnerEdit}
            />
            <Route path={`${match.url}/orders-inner-add`} exact component={OrdersInnerAdd} />
            <Route
              path={`${match.url}/orders-inner-edit/:id`}
              exact
              component={role !== 'sales' ? OrdersInnerEdit : OrdersSalesInnerEdit}
            />
            <Route path={`${match.url}/product-inner-add`} exact component={ProductInnerAdd} />
            <Route
              path={`${match.url}/product-inner-replace`}
              exact
              component={ProductInnerReplace}
            />
            <Route
              path={`${match.url}/customers-inner-replace`}
              exact
              component={CustomerInnerReplace}
            />
            <Route
              path={`${match.url}/product-inner-edit/:id`}
              exact
              component={ProductInnerEdit}
            />
            <Route path={`${match.url}/products`} exact component={Products} />
            <Route path={`${match.url}/invoice`} exact component={Invoice} />
            {/*<Route path={`${match.url}/requests`} exact component={Requests} />*/}
            {/*<Route path={`${match.url}/requests/requests-complete`} exact component={RequestsComplete} />*/}
            <Route path={`${match.url}/customers/inner/:id`} component={CustomersInner} />
            <Route path={`${match.url}/catalog/category/:id`} component={Catalog} />
            <Route path={`${match.url}/sales-requests`} component={SalesRequests} />
            <Route path={`${match.url}/sales-request/:id`} component={SalesRequestInner} />
            <Route path={`${match.url}/subscriptions`} component={Subscriptions} exact />
            <Route path={`${match.url}/subscriptions/:id`} component={SubscriptionsInner} />
            <Route path={`${match.url}/customer-statements`} exact component={CustomerStatements} />
            <Route
              path={`${match.url}/customer-statements/:id`}
              component={CustomerStatementsInner}
            />
            <Route render={() => <p>Not found</p>} />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.data,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // getUser,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
