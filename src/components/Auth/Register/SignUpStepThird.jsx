import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';
import { Link } from 'react-router-dom';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import arrow from '../../../assets/image/Path.svg';
import { sendMessage } from '../../../actions/authActions';
import { resetErrorUsers } from '../../../actions/UserActions';

class SignUpStepThird extends Component {

    state = {
        open: false
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
        const { sendMessage } = this.props;
        let description = {
            message: data.description ? data.description : ''
        };
        let clinic_id = localStorage.getItem('clinic_id');
        sendMessage(description, clinic_id).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {
            }
        })
    };

    render(){
        const { open } = this.state;
        const {handleSubmit, valid } = this.props;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <Link to={`/auth/sign-up/second-step`} className="back_step">
                    <img src={arrow} alt="arrow"/>
                    Step 2
                </Link>
                <h3 className="auth-block_head">Sign up to VIEBEG</h3>
                <h3 className="auth-block_descriptions">We are ready to go! You can give us more information if you want.</h3>
                <div className="block_field">
                    <span>Additional notes, 300 symbols<p>(optional)</p></span>
                    <Field
                        name="description"
                        className="textarea"
                        component="textarea"
                        placeholder="Type here..."
                    />
                </div>
                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        formAction
                        onClick={this.toggleDialog}
                        disabled={!valid}
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
                            Your details have been sent to our team and are currently under review. <br/>
                            You will soon receive a confirmation with log in details.
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
    if (values.description && !/^.{0,300}$/.test(values.description)) {
        errors.description = 'Maximum 300 symbols'
    }
    return errors
};

SignUpStepThird = reduxForm({
    form: 'SignUpStepThirdForm',
    validate
})(SignUpStepThird);

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendMessage,
        resetErrorUsers
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(SignUpStepThird);