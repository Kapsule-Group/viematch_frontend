import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import RenderField from "../../HelperComponents/RenderField/RenderField";
import DefaultButton from '../../Buttons/DefaultButton/DefaultButton';
import { Link } from 'react-router-dom';
import arrow from '../../../assets/image/Path.svg';
import { postRegisterSecondStep } from "../../../actions/authActions";
class SignUpStepSecond extends Component {

    state = {
      username: null,
    };

    submitForm = (data) => {
        const { history, hospital_credentials, postRegisterSecondStep } = this.props;
        let clinic_info = JSON.parse(localStorage.getItem("clinic_info"));
        clinic_info.email = (data && data.email ? data.email : '');
        clinic_info.username = (data && data.full_name);
        clinic_info.phone = ( data && data.phone ? data.phone : '');
        postRegisterSecondStep(clinic_info).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 201) {
                localStorage.setItem('clinic_id', res.payload.data.id);
                history.push('/auth/sign-up/third-step');
            }
        });
    };



    render(){
        const {handleSubmit, submitting, pristine, valid,  } = this.props;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <Link to={`/auth/sign-up`} className="back_step">
                    <img src={arrow} alt="arrow"/>
                    Step 1
                </Link>
                <h3 className="auth-block_head">Sign up to VIEBEG</h3>
                <h3 className="auth-block_descriptions">Provide information about your business owner or director</h3>
                <div className="block_field">
                    <span>Full name</span>
                    <Field name="full_name" type="text" component={RenderField} placeholder="Type here…"/>
                </div>
                <div className="block_custom_field">
                    <div className="block_field">
                        <span>Email <p>(optional)</p></span>
                        <Field name="email" type="text" component={RenderField} placeholder="Type here…"/>
                    </div>
                    <div className="block_field custom_field_phone">
                        <span>Phone number <p>(optional)</p></span>
                        <Field name="phone" type="number" component={RenderField} placeholder="Type here…"/>
                    </div>
                </div>
                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        type="submit"
                        disabled={submitting || pristine || !valid}
                        // loading={loading}
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
    const regExp = new RegExp(/^([A-Za-z '.-]+){1}$/g);
    if (!values.full_name) {
        errors.full_name = 'Required'
    } else if (!regExp.test(values.full_name)) {
        errors.full_name = 'Invalid name'
    }
    if (values.phone && values.phone.length < 6 ) {
        errors.phone = 'Must be from 6 characters to 16'
    }else if(values.phone && values.phone.length > 16 ){
        errors.phone = 'Must be from 6 characters to 16'
    }
    return errors
};

SignUpStepSecond = reduxForm({
    form: 'SignUpStepSecondForm',
    validate
})(SignUpStepSecond);

function  mapStateToProps(state, props) {
    return{
        hospital_credentials: state.auth.hospital_credentials,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postRegisterSecondStep,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStepSecond);