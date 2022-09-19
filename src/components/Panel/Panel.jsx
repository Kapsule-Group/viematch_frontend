import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link, withRouter } from "react-router-dom";
import logo_sidebar from "../../assets/image/new logo.svg";
import catalog from "../../assets/image/catalog.svg";
import customers from "../../assets/image/customers.svg";
import dashboard from "../../assets/image/dashboard.svg";
import requests from "../../assets/image/requests.svg";
import products from "../../assets/image/products.svg";
import user_management from "../../assets/image/user_management.svg";
import subscriptions from "../../assets/image/subscriptions_inactive.svg";
import orders from "../../assets/image/orders.svg";
import customer_statements from "../../assets/image/customer_statements.svg";
import customer_statements_active from "../../assets/image/customer_statements_active.svg";
import warning from "../../assets/image/warning.svg";
import "./Panel.scss";
import paymentImg from "../../assets/image/payments_inactive.svg";
import { bindActionCreators } from "redux";
import { getUnreadOrders } from "../../actions/ordersActions";

class Panel extends Component {
  state = {
    reloading: false,
    delay: 5000,
    pollingCount: 0,
  };

  componentDidMount() {
    const { getUnreadOrders } = this.props;
    this.interval = setInterval(this.tick, this.state.delay);
    getUnreadOrders();
  }

  componentDidUpdate(prevProps, prevState) {
    prevProps.location !== this.props.location &&
      this.setState({ reloading: true });
    if (prevState.delay !== this.state.delay) {
      clearInterval(this.interval);
      this.interval = setInterval(this.tick, this.state.delay);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    const { getUnreadOrders } = this.props;
    getUnreadOrders();
  };

  render() {
    const {
      data: { role },
      unread,
    } = this.props;
    return (
      <div className="panel_wrapper">
        <div className="panel">
          <Link to="/main/dashboard" className="logo_panel">
            <img src={logo_sidebar} alt="logo_sidebar" />
          </Link>

          <div className="block_link">
            {role === "super_admin" && (
              <>
                <NavLink to="/main/dashboard" activeClassName="is-active">
                  <img src={dashboard} alt="activity" />
                </NavLink>
                <NavLink
                  to="/main/regional-managers"
                  activeClassName="is-active"
                >
                  <img src={user_management} alt="activity" />
                </NavLink>
              </>
            )}

            {role !== "credit" && (
              <NavLink
                to="/main/customers"
                className={role === "sales" && "order-2"}
                activeClassName="is-active"
              >
                <img src={customers} alt="activity" />
              </NavLink>
            )}

            {role !== "credit" && (
              <NavLink
                to="/main/products"
                className={role === "sales" && "order-3"}
                activeClassName="is-active"
              >
                <img src={products} alt="activity" />
              </NavLink>
            )}

            {role === "super_admin" && (
              <NavLink to="/main/catalog" activeClassName="is-active">
                <img src={catalog} alt="activity" />
              </NavLink>
            )}

            {/*<NavLink to="/main/invoice" activeClassName="is-active">*/}
            {/*    <img src={requests} alt="activity" />*/}
            {/*</NavLink>*/}

            {role !== "credit" && (
              <NavLink
                to="/main/orders"
                className={
                  role === "sales" ? "order-1 count-messages" : "count-messages"
                }
                activeClassName="is-active"
              >
                <img src={orders} alt="orders" />
                {unread && unread.exist && unread.exist && (
                  <div className="unread-messages">
                    <span className="unread-messages--count">
                      {unread && unread.count && unread.count}
                    </span>
                  </div>
                )}
              </NavLink>
            )}

            {role !== "sales" && (
              <NavLink
                to="/main/customer-statements"
                className="count-messages customer-statements"
                activeClassName="is-active"
              >
                <img
                  className="inactive"
                  src={customer_statements}
                  alt="customer_statements"
                />
                <img
                  className="active"
                  src={customer_statements_active}
                  alt="customer_statements_active"
                />
                {/* <div className="unread-messages">
                  <span className="unread-messages--warning">
                    <img src={warning} alt="warning" />
                  </span>
                </div> */}
              </NavLink>
            )}

            {role !== "sales" && (
              <NavLink to="/main/payments" activeClassName="is-active">
                <img src={paymentImg} alt="payments" />
              </NavLink>
            )}
            {role !== "sales" && role !== "credit" && (
              <NavLink to="/main/subscriptions" activeClassName="is-active">
                <img src={subscriptions} alt="subscriptions" />
              </NavLink>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.auth.data,
    unread: state.orders.countUnread,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getUnreadOrders }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Panel));
