import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RenderField from "../../HelperComponents/RenderField/RenderField";
import DefaultButton from "../../Buttons/DefaultButton/DefaultButton";
import { Link } from "react-router-dom";
import arrow from "../../../assets/image/Path.svg";
import { postRegisterSecondStep, getRegions } from "../../../actions/authActions";
import SelectComponent from "../../HelperComponents/SelectComponent/SelectComponent";
import { getOption } from "../../HelperComponents/functions";
import Logo from "../../../assets/image/new logo.svg";
class SignUpStepSecond extends Component {
    state = {
        username: null,
        loading: false,
        region: { value: null, label: null },
        regions: [],
        option: null
    };

    componentDidMount() {
        const { getRegions } = this.props;
        getRegions();
    }

    submitForm = data => {
        const { history } = this.props;
        const { option, country_option, region } = this.state;
        this.setState({ loading: true });
        let clinic_info = JSON.parse(localStorage.getItem("clinic_info"));
        clinic_info.username = data && data.full_name;
        clinic_info.phone = data && data.phone ? data.phone : "";
        clinic_info.district = data.district;
        clinic_info.region = region.value;
        localStorage.setItem("clinic_info", JSON.stringify(clinic_info));
        history.push("/auth/sign-up/third-step");
    };

    render() {
        const { handleSubmit, submitting, pristine, valid, regions, region } = this.props;
        const { option_list, option, loading, country_option } = this.state;
        return (
            <form className="auth-form" onSubmit={handleSubmit(this.submitForm)}>
                <header className="auth-header">
                    <Link to="/main/catalog" className="auth_logo">
                        <img src={Logo} alt="logo" />
                    </Link>
                </header>
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
                    <span>Region</span>
                    <div className="select_wrapper" style={{ height: "48px", width: "100%" }}>
                        <SelectComponent
                            value={region}
                            options={regions && regions}
                            change={e => {
                                this.setState({ region: e });
                            }}
                            isClearable="false"
                            isSearchable={false}
                            placeholder="Select region"
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
                            regions === null ||
                            (regions.value === "Rwanda" && option === null)
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
        hospital_credentials: state.auth.hospital_credentials,
        regions: state.auth.regions
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            postRegisterSecondStep,
            getRegions
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpStepSecond);
