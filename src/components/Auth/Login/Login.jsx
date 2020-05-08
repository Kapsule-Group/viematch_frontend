import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import { bindActionCreators } from 'redux';
import RenderField from "../../HelperComponents/RenderField/RenderField";
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';
import { Link } from 'react-router-dom';
import { postLogin } from '../../../actions/authActions';
import { resetErrorUsers } from '../../../actions/UserActions';



const SITE_KEY = "6LfWmNQUAAAAAHjBqN29AftN2ntLZ5858Yi6M085";

const recaptchaRef = React.createRef();

class Login extends Component {

    state = {
        reCaptcha: false,
        loading: false,
    };

    submitForm = (data) => {
        const { postLogin, history, resetErrorUsers } = this.props;
        // const recaptchaValue = recaptchaRef.current.getValue();
        this.setState({loading: true});
        data.site = "user";
        data.recaptcha = this.state.recaptchaKey;
        postLogin(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                localStorage.token = res.payload.data.token;
                localStorage.email = res.payload.data.email;
                localStorage.username = res.payload.data.username;
                localStorage.role = res.payload.data.role;
                resetErrorUsers();
                history.push(`/main/dashboard/`)
            } else {
                this.setState({ loading: false, reCaptcha: false });
                recaptchaRef.current.reset();
            }
        })
    };

    onChange= (key) =>{
        this.setState({
            reCaptcha: true,
            recaptchaKey: key
        })
    };

    render(){
        const {handleSubmit, submitting, pristine, valid, error_login, resetErrorUsers } = this.props;
        const { reCaptcha, loading } = this.state;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <h3 className="auth-block_head">Sign in to VIEBEG</h3>
                <h3 className="auth-block_descriptions">Provide your credentials below</h3>
                <div className="block_field">
                    <span>Email</span>
                    <Field name="email"
                           type="text"
                           component={RenderField}
                           placeholder="Type here…"
                    />
                    <span className='back_error'>{!!error_login && error_login.email}</span>
                </div>
                <div className="block_custom_field">
                    <div className="block_field">
                        <div className="password_reset">
                            <span>Password</span>
                            <Link to={`/auth/password-recovery/first-step`}>Forgot password?</Link>
                        </div>
                        <Field name="password"
                               type="password"
                               component={RenderField}
                               placeholder="Type here…"
                               onChange={(e) => (error_login ? resetErrorUsers() : e)}
                        />
                        <span className='back_error'>{!!error_login && error_login.password}</span>
                    </div>
                    <div className="captcha_block">
                        <ReCAPTCHA
                            theme="light"
                            ref={recaptchaRef}
                            sitekey={SITE_KEY}
                            onChange={this.onChange}
                        />
                        <span className='back_error'>{!!error_login && error_login.recaptcha}</span>
                    </div>
                </div>
                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        disabled={reCaptcha ? submitting || pristine || !valid : true}
                        loading={loading}
                        formAction
                        type="submit"
                    >
                        Sign in
                    </DefaultButton>
                </div>
                <div className="info_auth">
                    <span>Don’t have a VIEBEG account yet?</span>
                    <Link to={`/auth/sign-up`}>
                        SIGN UP
                    </Link>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.company) {
        errors.company = 'Required'
    } else if (values.company.length < 3) {
        errors.company = 'Must be 3 characters or more'
    }
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email)) {
        errors.email = 'Invalid email'
    }
    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length < 8) {
        errors.password = 'Must be 8 characters or more'
    }
    if (!values.phone) {
        errors.phone = 'Required'
    }
    if (!values.address) {
        errors.address = 'Required'
    }
    return errors
};

Login = reduxForm({
    form: 'LoginForm',
    validate
})(Login);

function  mapStateToProps(state, props) {
    return{
        error_login: state.auth.error,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postLogin,
        resetErrorUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);