import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//import logout from '../../assets/image/logout.svg';
import "./Head.scss";
import { Dropdown } from "react-bootstrap";
import on from "../../assets/image/profile_pic.jpg";
import { NavLink, Link } from "react-router-dom";
import logo_sidebar from "../../assets/image/new logo.svg";
import nonActive from "../../assets/image/profile_dropdown.svg";
import activeImg from "../../assets/image/profile_dropdown_active.svg";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { getUserInfo } from "../../actions/UserActions";
import SearchHead from "./SearchHead";
import shoppingCart from "../../assets/image/shopping-cart.svg";
import { getCartCount, getSearchCategories, liveSearchHeader } from "./../../actions/UserActions";

class Head extends Component {
    state = {
        active: false,
        interval: null
    };

    componentDidMount() {
        const { getUserInfo, getCartCount, getSearchCategories } = this.props;
        const token = localStorage.getItem("token");
        getUserInfo();
        getSearchCategories();
        if (token) {
            clearInterval(this.state.interval);
            let customInterval = setInterval(() => getCartCount(), 2000);
            this.setState({ interval: customInterval });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    handleOut = () => {
        const { history } = this.props;
        localStorage.clear();
        history.push("/auth/sign-in");
    };

    render() {
        const name = localStorage.username;
        const email = localStorage.email;
        const token = localStorage.token;
        const { history, categories, liveSearchHeader, searchResults } = this.props;

        //const email = localStorage.email;
        const { active } = this.state;
        const { cartCount } = this.props;

        return (
            <header className="header_wrapper">
                <Link to="/main/catalog" className="logo_head">
                    <img src={logo_sidebar} alt="logo_sidebar" />
                </Link>
                <SearchHead
                    categories={categories}
                    liveSearchHeader={liveSearchHeader}
                    searchResults={searchResults}
                    history={history}
                />

                {token ? (
                    <>
                        <Link to={"/main/shoppingCart"} className="cart-wrapper">
                            <img className="shopping-cart" src={shoppingCart} alt="" />
                            {cartCount && cartCount.count && cartCount.count > 0 ? (
                                <div className="cart-count">{cartCount.count > 99 ? "99+" : cartCount.count}</div>
                            ) : null}
                        </Link>

                        <div className="name-wrapper">
                            <div className="name">{name}</div>
                            <div className="email">{email}</div>
                        </div>
                        <div className="dropdown-wrapper">
                            <img
                                src={active ? activeImg : nonActive}
                                onClick={() => this.setState(({ active }) => ({ active: !active }))}
                            />
                            {active && (
                                <ClickAwayListener onClickAway={() => this.setState({ active: false })}>
                                    <div className="drop-menu">
                                        <Link to="/main/dashboard/">Analytics</Link>
                                        <Link to="/main/stock-management">Stock managment</Link>
                                        <Link to="/main/activity">Orders</Link>
                                        <Link to="/main/user-management">Users</Link>
                                        <div
                                            onClick={() => {
                                                localStorage.clear();
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 1);
                                            }}
                                        >
                                            Log out
                                        </div>
                                    </div>
                                </ClickAwayListener>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <a target={"_blank"} className="singin" href="/auth/sign-in">
                            Sign in
                        </a>
                        <a target={"_blank"} className="singup" href="/auth/sign-up">
                            Sign up
                        </a>
                    </>
                )}
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        cartCount: state.users.cartCount,
        categories: state.users.categories,
        searchResults: state.users.liveSearch
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getUserInfo, getCartCount, getSearchCategories, liveSearchHeader }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Head);
