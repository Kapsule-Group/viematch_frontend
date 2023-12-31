import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DefaultButton from "../../../Buttons/DefaultButton/DefaultButton";
import password from "../../../../assets/image/password.svg";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/image/new logo.svg";
class FourthStep extends Component {
    render() {
        return (
            <div className="block_custom_auth_page auth-form">
                <header className="auth-header">
                    <Link to="/main/catalog" className="auth_logo">
                        <img src={Logo} alt="logo" />
                    </Link>
                </header>
                <h3 className="auth-block_head">Password change</h3>
                <h3 className="auth-block_descriptions">
                    Your new password have been set successfully. <br />
                    Now you can sign in.
                </h3>
                <div className="block_key">
                    <img src={password} alt="password" />
                </div>
                <div className="auth_btn_wrapper">
                    <DefaultButton variant="contained" type="link" to="/">
                        Sign in
                    </DefaultButton>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(FourthStep);
