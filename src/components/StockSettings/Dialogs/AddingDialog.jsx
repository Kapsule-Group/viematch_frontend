import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import FormControl from '@material-ui/core/FormControl';
import SelectComponent from '../../HelperComponents/SelectComponent/SelectComponent';
import RenderField from "../../HelperComponents/RenderField/RenderField";
import { postAddUser, getUsersList, resetErrorUsers } from "../../../actions/UserActions";
import { validate } from "./EditDialog";


class AddingDialog extends Component {
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
    };


    handleChange = name => event => {
        // const status = { status: event.value }
        this.setState({ [name]: event });
    };

    defaultStatus = () => {
      this.setState({status: null})
    };


    submitForm = (data, e) => {
            const { postAddUser, toggler, getUsersList, reset } = this.props;
            const { status } = this.state;
            let obj = { ...data, role: status.value };
            postAddUser(obj).then(res => {
                if(res.payload && res.payload.status && res.payload.status === 201) {
                    reset('AddingDialog');
                    this.setState({status: null});
                    getUsersList();
                    toggler()
                }
            })
    };

    render(){
        const { role, status } = this.state;
        const { toggler, state, handleSubmit, submitting, pristine, valid, adding_error, reset } = this.props;
        return (
            <DialogComponent
                open={state}
                onClose={() => {toggler(); this.defaultStatus()}}
            >

                    <div className="edit_dialog_user">
                        <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="title">
                            <span>Add user</span>
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
                                <span className='back_error add'>{adding_error && adding_error.email}</span>
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
                                <span className='back_error role'>{!!adding_error && adding_error.role}</span>
                            </div>


                        </div>

                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={(e) => {e.preventDefault(); toggler(); reset('AddingDialog'); this.defaultStatus()}}>Cancel</button>
                            <button disabled={submitting || pristine || !valid || !status} className="blue_btn">add</button>
                        </div>
                        </form>
                    </div>

            </DialogComponent>
        );
    }
}

AddingDialog = reduxForm({
    form: 'AddingDialog',
    validate
})(AddingDialog);

function mapStateToProps(state) {
    return{
        adding_error: state.users.error,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postAddUser,
        getUsersList,
        resetErrorUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AddingDialog);
