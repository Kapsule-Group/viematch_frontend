import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import { bindActionCreators } from 'redux';
import RenderField from "../../HelperComponents/RenderField/RenderField";
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';
import { Link } from 'react-router-dom';
import { postRegisterFirstStep } from '../../../actions/authActions';
import { resetErrorUsers } from '../../../actions/UserActions';
// import recaptcha from "react-google-recaptcha/src/recaptcha";




const SITE_KEY = "6LfWmNQUAAAAAHjBqN29AftN2ntLZ5858Yi6M085";
const recaptchaRef = React.createRef();

class SignUp extends Component {

    state = {
        reCaptcha: false,
        loading: false,
    };

    componentDidMount() {
            const {resetErrorUsers} = this.props;
            // resetErrorUsers()
    }

    submitForm = (data) => {
        // const recaptchaValue = recaptchaRef.current.getValue();
        const { postRegisterFirstStep, history, resetErrorUsers } = this.props;
        this.setState({loading: true});

        data.recaptcha = this.state.recaptchaKey;

        postRegisterFirstStep(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                localStorage.setItem( 'clinic_info', JSON.stringify(data));
                history.push(`/auth/sign-up/second-step`);
                resetErrorUsers()
            }else{
                this.setState({loading: false,  reCaptcha: false});
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
        const {handleSubmit, submitting, pristine, valid, step_fail, resetErrorUsers } = this.props;
        const { reCaptcha, loading } = this.state;
        console.log(step_fail)
        return (

            <form onSubmit={handleSubmit(this.submitForm)}>
                <h3 className="auth-block_head">Sign up to VIEMATCH</h3>
                <h3 className="auth-block_descriptions">Please, fill out the form about your business below</h3>
                <div className="block_field">
                    <span>Email</span>
                    <Field name="clinic_email" type="text" component={RenderField} placeholder="Type here…"/>
                    <span className='back_error'>{!!step_fail && step_fail.clinic_email}</span>
                </div>
                <div className="block_custom_field">
                    <div className="block_field">
                        <span>Hospital name</span>
                        <Field name="clinic_name" type="text" component={RenderField} placeholder="Type here…"/>
                        <span className='back_error'>{!!step_fail && step_fail.clinic_name}</span>
                    </div>
                   <div className="captcha_block">
                       <ReCAPTCHA
                           theme="light"
                           ref={recaptchaRef}
                           sitekey={SITE_KEY}
                           onChange={this.onChange}
                       />
                       <span className='back_error'>{!!step_fail && step_fail.recaptcha}</span>
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
                        Next
                    </DefaultButton>
                </div>
                <div className="info_auth">
                    <span>Already a VIEMATCH member?</span>
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
        errors.company = 'Required'
    } else if (values.company.length < 3) {
        errors.company = 'Must be 3 characters or more'
    }
    if (!values.clinic_email) {
        errors.clinic_email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.clinic_email)) {
        errors.clinic_email = 'Invalid email'
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

SignUp = reduxForm({
    form: 'SignUp',
    validate
})(SignUp);

function  mapStateToProps(state, props) {
    return{
        step_fail: state.auth.error,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRegisterFirstStep,
        resetErrorUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);