import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import ReCAPTCHAComp from '../ReCaptcha/ReCaptcha';
import { bindActionCreators } from 'redux';
import RenderField from '../../HelperComponents/RenderField/RenderField';
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';

import { postLogin } from '../../../actions/authActions';
const recaptchaRef = React.createRef();

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      emailError: false,
      passError: false,
      errorText: '',
      reCAPTCHA: false,
    };
    this.SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    // this.SITE_KEY = window.location.hostname === "localhost" ? "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" : "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
  }

  componentDidMount() {
    const { history } = this.props;
    if (localStorage.token) {
      history.push('/main');
    }
  }

  submitForm = (data) => {
    //const recaptchaValue = recaptchaRef.current.getValue();
    // this.props.onSubmit(recaptchaValue);
    const { postLogin, history } = this.props;

    this.setState({ loading: true });
    data.site = 'admin';
    data.recaptcha = this.state.recaptchaKey;
    postLogin(data).then((res) => {
      if (res.payload && res.payload.status && res.payload.status === 200) {
        this.setState({
          loading: false,
          emailError: false,
          passError: false,
          errorText: '',
        });
        localStorage.token = res.payload.data.token;

        history.push('/main/dashboard');
      } else {
        this.setState({ reCAPTCHA: false, recaptchaKey: null });
        recaptchaRef.current.reset();
        if (res.error.response.data.email) {
          this.setState({
            loading: false,
            emailError: true,
            passError: false,
            errorText: res.error.response.data.email,
          });
        } else if (res.error.response.data.password) {
          this.setState({
            loading: false,
            passError: true,
            emailError: false,
            errorText: res.error.response.data.password,
          });
        }
      }
    });
  };

  onChange = (key) => {
    this.setState({
      reCAPTCHA: true,
      recaptchaKey: key,
    });
  };

  render() {
    const { handleSubmit, submitting, pristine, valid } = this.props;
    const { reCAPTCHA, loading, emailError, passError, errorText } = this.state;
    return (
      <form onSubmit={handleSubmit(this.submitForm)}>
        <h2 className="auth-block_head">Sign in to VIEBEG</h2>
        <h2 className="auth-block_descriptions">Provide your credentials below</h2>
        <div className="block_field">
          <div className="block_field">
            <span>Email</span>
            <span className={emailError ? 'visible' : ''}>{errorText}</span>
          </div>
          <Field name="email" type="text" component={RenderField} placeholder="Type here…" />
        </div>
        <div className="block_custom_field">
          <div className="block_field">
            <div className="block_field">
              <span>Password</span>
              <span className={passError ? 'visible' : ''}>{errorText}</span>
            </div>
            <Field
              name="password"
              type="password"
              component={RenderField}
              placeholder="Type here…"
            />
          </div>
          <div className="captcha_block">
            <ReCAPTCHAComp onChange={this.onChange} ownRef={recaptchaRef} />
          </div>
        </div>
        <div className="auth_btn_wrapper">
          <DefaultButton
            variant="contained"
            disabled={!reCAPTCHA || submitting || pristine || !valid}
            loading={loading}
            formAction
            //type="link"
            //to="/main"
            //onClick={this.submitLogin}
          >
            Sign in
          </DefaultButton>
        </div>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.company) {
    errors.company = 'Required';
  } else if (values.company.length < 3) {
    errors.company = 'Must be 3 characters or more';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,7}$/i.test(values.email)) {
    errors.email = 'Invalid email';
  }
  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 8) {
    errors.password = 'Must be 8 characters or more';
  }
  if (!values.phone) {
    errors.phone = 'Required';
  }
  if (!values.address) {
    errors.address = 'Required';
  }
  return errors;
};

Login = reduxForm({
  form: 'LoginForm',
  validate,
})(Login);

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      postLogin,
    },
    dispatch,
  );
}

export default connect(null, mapDispatchToProps)(Login);
