import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';
import { Link } from 'react-router-dom';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import arrow from '../../../assets/image/Path.svg';
import { /* sendMessage, */ postRegisterSecondStep } from '../../../actions/authActions';
import { resetErrorUsers } from '../../../actions/UserActions';
import RenderField from "../../HelperComponents/RenderField/RenderField";

class SignUpStepThird extends Component {

    state = {
        open: false,
        loading: false,
    };

    toggleDialog = () => {
        const { history } = this.props;

        this.setState(({open}) => ({
            open: !open
        }));

        if(this.state.open) history.push(`/auth/sign-in`);
    };

    resetError = () =>{
        const {resetErrorUsers} = this.props;
        resetErrorUsers()
    };

    submitForm = (data) => {
        this.setState({loading: true})
        const { history, postRegisterSecondStep } = this.props;
        let clinic_info = JSON.parse(localStorage.getItem("clinic_info"));
        clinic_info.password = data.password;
        postRegisterSecondStep(clinic_info).then(res => {
            if (res.payload && res.payload.status && res.payload.status === 201) {
                localStorage.removeItem("clinic_info")
                this.setState({loading: false})
            }
        });
        /* sendMessage(description, clinic_id).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {
                this.setState({loading: false})
            }
        }) */
    };

    render(){
        const { open, loading } = this.state;
        const {handleSubmit, valid } = this.props;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <Link to={`/auth/sign-up/second-step`} className="back_step">
                    <img src={arrow} alt="arrow"/>
                    Step 2
                </Link>
                <h3 className="auth-block_head">Sign up to VIEBEG</h3>
                {/* <h3 className="auth-block_descriptions">We are ready to go! You can give us more information if you want.</h3> */}
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
                        formAction
                        onClick={this.toggleDialog}
                        disabled={!valid}
                        loading={loading}
                    >
                        Sign up
                    </DefaultButton>
                </div>

                <DialogComponent
                    open={open}
                    onClose={() => this.toggleDialog('')}
                >
                    <div className="auth_dialog_wrapper">
                        <div className="title">Thank you for your registration</div>
                        <div className="descriptions">
                            {/* Your details have been sent to our team and are currently under review. <br/>
                            You will soon receive a confirmation with log in details. */}
                        </div>
                        <DefaultButton
                            variant="outlined"
                            type="link"
                            classes="blue_btn"
                            to={`/auth/sign-in`}
                            onClick={this.resetError}
                        >
                            ok
                        </DefaultButton>
                    </div>
                </DialogComponent>
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

SignUpStepThird = reduxForm({
    form: 'SignUpStepThirdForm',
    validate
})(SignUpStepThird);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ///sendMessage,
        postRegisterSecondStep,
        resetErrorUsers
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(SignUpStepThird);