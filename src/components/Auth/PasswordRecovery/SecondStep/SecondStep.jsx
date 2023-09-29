import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import arrow from "../../../../assets/image/Path.svg";
import email from "../../../../assets/image/email.svg";
import Logo from "../../../../assets/image/new logo.svg";

class SecondStep extends Component {
    render() {
        return (
            <>
                <div className="block_custom_auth_page auth-form">
                    <header className="auth-header steps">
                        <Link to="/main/catalog" className="auth_logo">
                            <img src={Logo} alt="logo" />
                        </Link>
                    </header>
                    <Link to={`/auth/sign-in`} className="back_step">
                        <img src={arrow} alt="arrow" />
                        sign in
                    </Link>
                    <h3 className="auth-block_head">Reset password</h3>
                    <h3 className="auth-block_descriptions">
                        We have sent you an email with a link to reset your password
                    </h3>
                    <div className="block_key">
                        <img src={email} alt="email" />
                    </div>
                </div>
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(SecondStep);
