import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import RenderField from "../../../HelperComponents/RenderField/RenderField";
import DefaultButton from '../../../Buttons/DefaultButton/DefaultButton';
import { postPasswordApprove } from '../../../../actions/authActions';


class ThirdStep extends Component {

    state = {
        loading: false,
    };

    submitForm = (data) => {
        const { postPasswordApprove, location:{search}, history } = this.props;
        this.setState({loading: true});
        let params = new URLSearchParams(search.substring(1));
        let obj = {
            security_token: params.get('security_token'),
            password: data.password,
            password_check: data.password_check
        };
        postPasswordApprove(obj).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({loading: false});
                history.push(`/auth/password-recovery/fourth-step/`)
            }
        })
    };

    render(){
        const {handleSubmit, submitting, pristine, valid, security_token } = this.props;
        const { loading } = this.state;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <h3 className="auth-block_head">Password change</h3>
                <h3 className="auth-block_descriptions">Enter and confirm your new password</h3>
                <div className="block_field">
                    <span>New password</span>
                    <Field name="password" type="password" component={RenderField} placeholder="Type here…"/>
                </div>
                <div className="block_field">
                    <span>Confirm password</span>
                    <Field name="password_check" type="password" component={RenderField} placeholder="Type here…"/>
                </div>
                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        disabled={submitting || pristine || !valid}
                        loading={loading}
                        formAction
                        type="submit"
                    >
                        Next
                    </DefaultButton>
                </div>
                <span className='back_error third'>{!!security_token && security_token.security_token}</span>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length < 8) {
        errors.password = 'Must be 8 characters or more'
    }
    if (!values.password_check) {
        errors.password_check = 'Required'
    } else if (values.password_check !== values.password) {
        errors.password_check = 'This password does not match the password below'
    }
    return errors
};

ThirdStep = reduxForm({
    form: 'ThirdStepForm',
    validate
})(ThirdStep);

function  mapStateToProps(state, props) {
    return{
        security_token: state.auth.error,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postPasswordApprove
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ThirdStep);