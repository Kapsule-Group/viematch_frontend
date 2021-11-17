import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";
import Logo from "../../assets/image/footer_logo.svg";
import { withRouter } from "react-router-dom";

const Footer = ({
    history: {
        location: { pathname }
    }
}) => {
    const token = localStorage.token;
    return (
        <footer>
            <div className="upper-wrapper">
                <img src={Logo} alt="footer-logo" />
                <div>
                    {token ? (
                        <>
                            <Link to="/main/dashboard/" className={pathname === "/main/dashboard/" ? "active" : ""}>
                                Analytics
                            </Link>
                            <Link
                                to="/main/stock-management"
                                className={pathname === "/main/stock-management" ? "active" : ""}
                            >
                                Stock management
                            </Link>
                            <Link to="/main/activity" className={pathname === "/main/activity" ? "active" : ""}>
                                Orders
                            </Link>
                            <Link
                                to="/main/user-management"
                                className={pathname === "/main/user-management" ? "active" : ""}
                            >
                                Users
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className="singin" to="/auth/sign-in">
                                Sign in
                            </Link>
                            <Link className="singup" to="/auth/sign-up">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className="down-wrapper">© 2021 Viebeg. All rights reserved.</div>
        </footer>
    );
};

export default withRouter(Footer);
