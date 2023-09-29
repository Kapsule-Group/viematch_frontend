import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import ReCAPTCHAComp from "../ReCaptcha/ReCaptcha";
import { bindActionCreators } from "redux";
import RenderField from "../../HelperComponents/RenderField/RenderField";
import DefaultButton from "../../Buttons/DefaultButton/DefaultButton";
import { Link } from "react-router-dom";
import Logo from "../../../assets/image/new logo.svg";
import { postRegisterFirstStep } from "../../../actions/authActions";
import { resetErrorUsers } from "../../../actions/UserActions";
// import recaptcha from "react-google-recaptcha/src/recaptcha";
import Checkbox from "@material-ui/core/Checkbox";
import { getAgreements } from "../../../actions/authActions";
const SITE_KEY = "6Ldh6PgUAAAAAFbvNe0a2ln68QC8hqxL98qch88S"; //"6LfWmNQUAAAAAHjBqN29AftN2ntLZ5858Yi6M085";
const recaptchaRef = React.createRef();

class SignUp extends Component {
    state = {
        reCaptcha: false,
        loading: false,
        terms: false,
        policy: false
    };

    componentDidMount() {
        const { getAgreements } = this.props;
        getAgreements();
    }

    submitForm = data => {
        // const recaptchaValue = recaptchaRef.current.getValue();
        const { postRegisterFirstStep, history, resetErrorUsers } = this.props;
        const { terms, policy } = this.state;
        this.setState({ loading: true });

        data.recaptcha = this.state.recaptchaKey;
        data.accept_terms = terms;
        data.accept_policy = policy;
        postRegisterFirstStep(data).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 200) {
                localStorage.setItem("clinic_info", JSON.stringify(data));
                history.push(`/auth/sign-up/second-step`);
                resetErrorUsers();
            } else {
                this.setState({ loading: false, reCaptcha: false });
                recaptchaRef.current.reset();
            }
        });
    };

    onChange = key => {
        this.setState({
            reCaptcha: true,
            recaptchaKey: key
        });
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const { handleSubmit, submitting, pristine, valid, step_fail, resetErrorUsers, agreements } = this.props;
        const { reCaptcha, loading, btnLoad, terms, policy } = this.state;

        return (
            <form className="auth-form " onSubmit={handleSubmit(this.submitForm)}>
                <header className="auth-header">
                    <Link to="/main/catalog" className="auth_logo">
                        <img src={Logo} alt="logo" />
                    </Link>
                    <Link to={`/auth/sign-in`} className="sign-in-button" onClick={resetErrorUsers}>
                        SIGN IN
                    </Link>
                </header>
                <h3 className="auth-block_head">Sign up to VIEBEG</h3>
                <h3 className="auth-block_descriptions">Please, fill out the form about your business below</h3>
                <div className="block_field">
                    <span>Email</span>
                    <Field name="clinic_email" type="text" component={RenderField} placeholder="Type here…" />
                    <span className="back_error">{!!step_fail && step_fail.clinic_email}</span>
                </div>
                <div className="block_custom_field">
                    <div className="block_field">
                        <span>Hospital name</span>
                        <Field name="clinic_name" type="text" component={RenderField} placeholder="Type here…" />
                        <span className="back_error">{!!step_fail && step_fail.clinic_name}</span>
                    </div>
                    <div className="captcha_block fullscreen">
                        <ReCAPTCHAComp onChange={this.onChange} />
                        <span className="back_error">{!!step_fail && step_fail.recaptcha}</span>
                    </div>
                </div>
                <div className="checkbox-row" style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox name="terms" color="primary" checked={terms} onChange={this.handleChange} />
                    <span className="checkbox-txt">
                        I have read and hereby agree with the{" "}
                        <a href={agreements && agreements.terms_file} target="_blank">
                            Terms and Conditions
                        </a>
                    </span>
                </div>
                <div className="checkbox-row" style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox name="policy" color="primary" checked={policy} onChange={this.handleChange} />
                    <span className="checkbox-txt">
                        I have read and hereby agree with the{" "}
                        <a href={agreements && agreements.policy_file} target="_blank">
                            Privacy Policy
                        </a>
                    </span>
                </div>
                <div className="block_custom_field">
                    <div className="captcha_block smallscreen">
                        <ReCAPTCHAComp onChange={this.onChange} />
                        <span className="back_error">{!!step_fail && step_fail.recaptcha}</span>
                    </div>
                </div>

                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        disabled={reCaptcha ? submitting || pristine || !valid || !policy || !terms : true}
                        loading={loading}
                        formAction
                        type="submit"
                    >
                        Next
                    </DefaultButton>
                </div>
                <div className="info_auth">
                    <span>Already a VIEBEG member?</span>
                    <Link to={`/auth/sign-in`} onClick={resetErrorUsers}>
                        SIGN IN
                    </Link>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.company) {
        errors.company = "Required";
    } else if (values.company.length < 3) {
        errors.company = "Must be 3 characters or more";
    }
    if (!values.clinic_email) {
        errors.clinic_email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.clinic_email)) {
        errors.clinic_email = "Invalid email";
    }
    if (!values.password) {
        errors.password = "Required";
    } else if (values.password.length < 8) {
        errors.password = "Must be 8 characters or more";
    }
    if (!values.phone) {
        errors.phone = "Required";
    }
    if (!values.address) {
        errors.address = "Required";
    }
    return errors;
};

SignUp = reduxForm({
    form: "SignUp",
    validate
})(SignUp);

function mapStateToProps(state, props) {
    return {
        step_fail: state.auth.error,
        agreements: state.auth.agreements
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            postRegisterFirstStep,
            resetErrorUsers,
            getAgreements
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
