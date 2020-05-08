import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../../HelperComponents/SelectComponent/SelectComponent';
import RenderField from "../../HelperComponents/RenderField/RenderField";
import {patchUser, getUsersList, resetErrorUsers} from "../../../actions/UserActions";


class EditDialog extends Component {

        state = {
            role: [
                {label:
                        <div className="status">
                            <div>Admin</div>
                        </div>
                    , value: "admin"},
                {label:
                        <div className="status">
                            <div>User</div>
                        </div>
                    ,value: "user"},
            ],
            noErrors: false
        };


    handleChange = name => event => {
        // const status = { status: event.value }
        this.setState({ [name]: event });
    };

    submitForm = (data) => {
        const { patchUser, getUsersList, toggler, initialValues } = this.props;
        const { status } = this.state;
        let obj = { ...data, role: status.value };
        patchUser(initialValues.id, obj).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                getUsersList();
                toggler()
            }
        })
    };

    defaultStatus = () => {
        this.setState({status: null, noErrors: true});
        this.props.resetErrorUsers();
    };

    render(){
        const { role, status } = this.state;
        const { toggler, state, handleSubmit, fail_err, initialValues, reset } = this.props;

        return (
            <DialogComponent
                open={state}
                onClose={() => {toggler(); this.defaultStatus()}}
            >
                    <div className="edit_dialog_user">
                        <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="title">
                            <span>Edit user</span>
                        </div>
                        <div className="block_edit_field">
                            <span className='span'>Name</span>
                            <Field
                                name="username"
                                type="text"
                                component={RenderField}
                                placeholder="Type here…"
                                className='input'
                            />
                        </div>

                        <div className="block_edit_field_select">
                            <div>
                                <span>Email</span>
                                <Field
                                    name="email"
                                    type="text"
                                    component={RenderField}
                                    placeholder="Type here…"
                                    className='input'
                                />
                                <span className='back_error add'>{!!fail_err && fail_err.email}</span>

                            </div>
                            <div>
                                <span>Role</span>
                                <FormControl className="select_wrapper">
                                    <SelectComponent
                                        value={status}
                                        options={role}
                                        // loading={!isArray(projects_list)}
                                        change={this.handleChange('status', )}
                                        isClearable="false"
                                        isSearchable = {false}
                                        onKeyDown={(e) => (e.keyCode === 13 ? e.preventDefault() : false)}
                                    />
                                </FormControl>
                                <span className='back_error role'>{!!fail_err&& fail_err.role}</span>
                            </div>


                        </div>

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={(e) => {e.preventDefault(); toggler(); reset('EditDialog'); this.defaultStatus()}}>Cancel</button>
                            <button className="blue_btn" disabled={!status}>save</button>
                        </div>
                        </form>
                    </div>

            </DialogComponent>


        );
    }
}


export const validate = values => {
    const errors = {};
    const regExp = new RegExp(/^([A-Za-z '.-]+){1}$/g);

    if (!values.username) {
        errors.username = 'Required'
    } else if (!regExp.test(values.username)) {
        errors.username = 'Invalid name'
    }
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email)) {
        errors.email = 'Invalid email'
    }

    return errors
};

EditDialog = reduxForm({
    form: 'EditDialog',
    validate,
    enableReinitialize: true
})(EditDialog);

function mapStateToProps(state, props) {
    return{
        fail_err: state.users.error,
        // initialValues: {
        //     email: (props.userData && props.userData.email) || ''
        // }
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        patchUser,
        getUsersList,
        resetErrorUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditDialog);
