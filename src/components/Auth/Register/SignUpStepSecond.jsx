import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RenderField from "../../HelperComponents/RenderField/RenderField";
import DefaultButton from "../../Buttons/DefaultButton/DefaultButton";
import { Link } from "react-router-dom";
import arrow from "../../../assets/image/Path.svg";
import { postRegisterSecondStep } from "../../../actions/authActions";
import SelectComponent from "../../HelperComponents/SelectComponent/SelectComponent";
import { getOption } from "../../HelperComponents/functions";

class SignUpStepSecond extends Component {
    state = {
        username: null,
        loading: false,
        option: null,
        option_list: [
            { label: getOption("Kigali City"), value: "Kigali City" },
            { label: getOption("Northern Province"), value: "Northern Province" },
            { label: getOption("Eastern Province"), value: "Eastern Province" },
            { label: getOption("Southern Province"), value: "Southern Province" },
            { label: getOption("Western Province"), value: "Western Province" }
        ],
        country_option: null,
        country_option_list: [
            { label: getOption("DR Congo"), value: "DR Congo" },
            { label: getOption("Rwanda"), value: "Rwanda" },
            { label: getOption("Burundi"), value: "Burundi" }
        ]
    };

    submitForm = data => {
        const { history } = this.props;
        const { option, country_option } = this.state;
        this.setState({ loading: true });
        let clinic_info = JSON.parse(localStorage.getItem("clinic_info"));
        //clinic_info.email = (data && data.email ? data.email : '');
        clinic_info.username = data && data.full_name;
        clinic_info.phone = data && data.phone ? data.phone : "";
        clinic_info.district = data.district;
        clinic_info.province = country_option.value === "Rwanda" ? option.value : data.province;
        clinic_info.country = country_option.value;
        localStorage.setItem("clinic_info", JSON.stringify(clinic_info));
        history.push("/auth/sign-up/third-step");
    };

    render() {
        const { handleSubmit, submitting, pristine, valid } = this.props;
        const { option_list, option, loading, country_option, country_option_list } = this.state;
        return (
            <form onSubmit={handleSubmit(this.submitForm)}>
                <Link to={`/auth/sign-up`} className="back_step">
                    <img src={arrow} alt="arrow" />
                    Step 1
                </Link>
                <h3 className="auth-block_head">Sign up to VIEBEG</h3>
                {/* <h3 className="auth-block_descriptions">Provide information about your business owner or director</h3> */}
                <div className="block_field">
                    <span>Full name</span>
                    <Field name="full_name" type="text" component={RenderField} placeholder="Type here…" />
                </div>
                <div className="block_field">
                    <span>
                        Phone number <p style={{ marginBottom: "0", lineHeight: "12px" }}>(optional)</p>
                    </span>
                    <Field name="phone" type="number" component={RenderField} placeholder="Type here…" />
                </div>
                <div className="block_field" style={{ marginBottom: "31px" }}>
                    <span>Country</span>
                    <div className="select_wrapper" style={{ height: "48px", width: "100%" }}>
                        <SelectComponent
                            value={country_option}
                            options={country_option_list}
                            change={e => {
                                this.setState({ country_option: e });
                            }}
                            isClearable="false"
                            isSearchable={false}
                            placeholder="Select country"
                        />
                    </div>
                </div>
                {country_option && (
                    <div className="block_custom_field">
                        <div className="block_field">
                            <span>District</span>
                            <Field name="district" type="text" component={RenderField} placeholder="Type here…" />
                        </div>
                        <div className="block_field custom_field_phone">
                            <span>Province</span>
                            {country_option.value === "Rwanda" ? (
                                <div className="select_wrapper" style={{ height: "48px", width: "100%" }}>
                                    <SelectComponent
                                        value={option}
                                        options={option_list}
                                        change={e => {
                                            this.setState({ option: e });
                                        }}
                                        isClearable="false"
                                        isSearchable={false}
                                        placeholder="Select province"
                                    />
                                </div>
                            ) : (
                                <Field name="province" type="text" component={RenderField} placeholder="Type here…" />
                            )}
                        </div>
                    </div>
                )}

                <div className="auth_btn_wrapper">
                    <DefaultButton
                        variant="contained"
                        type="submit"
                        disabled={
                            submitting ||
                            pristine ||
                            !valid ||
                            country_option === null ||
                            (country_option.value === "Rwanda" && option === null)
                        }
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
    const regExp = new RegExp(/^([A-Za-z '.-]+){1}$/g);
    if (!values.full_name) {
        errors.full_name = "Required";
    } else if (!regExp.test(values.full_name)) {
        errors.full_name = "Invalid name";
    }
    if (!values.district) {
        errors.district = "Required";
    }
    if (!values.province) {
        errors.province = "Required";
    }
    if (values.phone && values.phone.length < 6) {
        errors.phone = "Must be from 6 characters to 16";
    } else if (values.phone && values.phone.length > 16) {
        errors.phone = "Must be from 6 characters to 16";
    }
    return errors;
};

SignUpStepSecond = reduxForm({
    form: "SignUpStepSecondForm",
    validate
})(SignUpStepSecond);

function mapStateToProps(state, props) {
    return {
        hospital_credentials: state.auth.hospital_credentials
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            postRegisterSecondStep
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStepSecond);
