import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReCAPTCHA from "react-google-recaptcha";

class Login extends Component {
    constructor(props) {
        super(props);
        //this.SITE_KEY = window.location.hostname === "localhost" ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" : "6LfWmNQUAAAAAHjBqN29AftN2ntLZ5858Yi6M085"
        this.SITE_KEY = "6LfWmNQUAAAAAHjBqN29AftN2ntLZ5858Yi6M085";
    }

    render() {
        return (
            <ReCAPTCHA
                theme="light"
                ref={this.props.ownRef}
                sitekey={this.SITE_KEY}
                onChange={this.props.onChange}
            />
        );
    }
}
function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
