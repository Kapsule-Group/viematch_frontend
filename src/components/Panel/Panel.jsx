import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import logo_sidebar from "../../assets/image/new logo.svg";
import catalog from "../../assets/image/catalog.svg";
import products from "../../assets/image/products.svg";
import dashboard from "../../assets/image/dashboard.svg";
import user_management from "../../assets/image/user_management.svg";
import activity from "../../assets/image/activity.svg";
import cart from "../../assets/image/shopping-cart.png";
import { getUserInfo } from "../../actions/UserActions";
import "./Panel.scss";
import { getCartCount } from "./../../actions/UserActions";

class Panel extends Component {
    state = {
        reloading: false,
        interval: null
    };
    componentDidMount() {
        const { getUserInfo, getCartCount } = this.props;
        getUserInfo();
        clearInterval(this.state.interval);
        let customInterval = setInterval(() => getCartCount(), 2000);
        this.setState({ interval: customInterval });
    }

    componentDidUpdate(prevProps) {
        prevProps.location !== this.props.location && this.setState({ reloading: true });
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    render() {
        const role = localStorage.role;
        const { cartCount } = this.props;
        return (
            <div className="panel_wrapper">
                <div className="panel">
                    <Link to="/main/dashboard" className="logo_panel">
                        <img src={logo_sidebar} alt="logo_sidebar" />
                    </Link>
                    <div className="block_link">
                        {role !== "user" && (
                            <NavLink to="/main/dashboard">
                                <img src={dashboard} alt="dashboard" />
                            </NavLink>
                        )}
                        {role !== "user" && (
                            <NavLink to="/main/catalog">
                                <img src={catalog} alt="catalog" />
                            </NavLink>
                        )}
                        {role !== "user" && (
                            <NavLink className="fix_link" to="/main/shoppingCart">
                                <img src={cart} alt="catalog" />
                                {cartCount && cartCount.count && cartCount.count > 0 ? (
                                    <div className="cart-count">{cartCount.count > 99 ? "99+" : cartCount.count}</div>
                                ) : null}
                            </NavLink>
                        )}
                        <NavLink to="/main/stock-management">
                            <img src={products} alt="products" />
                        </NavLink>
                        {role === "clinic" && (
                            <NavLink to="/main/user-management">
                                <img src={user_management} alt="user_management" />
                            </NavLink>
                        )}
                        {role !== "user" && (
                            <NavLink to="/main/activity">
                                <img src={activity} alt="activity" />
                            </NavLink>
                        )}
                        {/*role !== 'user' && <NavLink to="/store" target="_blank"><img src={activity} alt="activity"/></NavLink>*/}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { cartCount: state.users.cartCount };
}

const mapDispatchToProps = {
    getUserInfo,
    getCartCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Panel);
