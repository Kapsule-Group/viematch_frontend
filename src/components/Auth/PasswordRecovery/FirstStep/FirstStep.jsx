import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import RenderField from "../../../HelperComponents/RenderField/RenderField";
import DefaultButton from '../../../Buttons/DefaultButton/DefaultButton';
import { Link } from 'react-router-dom';
import arrow from '../../../../assets/image/Path.svg';
import { postResetPassword } from '../../../../actions/authActions';
import { resetErrorUsers } from '../../../../actions/UserActions';

class FirstStep extends Component {

    state = {
      loading: false,
    };

    submitForm = (data) => {
        const { postResetPassword, history, resetErrorUsers } = this.props;
        this.setState({loading: true});
        postResetPassword(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {

                history.push(`/auth/password-recovery/second-step/`);
                resetErrorUsers()
            }else{
                this.setState({loading: false});
            }
        })

    };
    render(){
        const { handleSubmit, submitting, pristine, valid, step_fail, resetErrorUsers } = this.props;
        const { loading } = this.state;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <Link to={`/auth/sign-in`} onClick={resetErrorUsers} className="back_step">
                    <img src={arrow} alt="arrow"/>
                    sign in
                </Link>
                <h3 className="auth-block_head">Reset password</h3>
                <h3 className="auth-block_descriptions">Enter your email to continue</h3>
                <div className="block_field">
                    <span>Email<span className='back_error'>{!!step_fail && step_fail.email}</span></span>
                    <Field name="email" type="text" component={RenderField} placeholder="Type here…"/>
                </div>
                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        type="submit"
                        disabled={submitting || pristine || !valid}
                        loading={loading}
                        formAction
                    >
                        Next
                    </DefaultButton>
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

FirstStep = reduxForm({
    form: 'FirstStepForm',
    validate
})(FirstStep);

function  mapStateToProps(state, props) {
    return{
        step_fail: state.auth.error,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postResetPassword,
        resetErrorUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep);