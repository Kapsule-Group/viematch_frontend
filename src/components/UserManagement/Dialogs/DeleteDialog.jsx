import React, {Component} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import DialogComponent from "../../HelperComponents/DialogComponent/DialogComponent";
import { deleteUser, getUsersList } from "../../../actions/UserActions";




class DeleteDialog extends Component {
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

    submitForm = (data) => {
        const { deleteUser, username, toggler, getUsersList } = this.props;
        deleteUser(username.id, data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 204) {
                getUsersList();
                toggler()
            }
        })
    };

    render(){
        const { toggler, state, handleSubmit, username, reset } = this.props;
        return (
            <DialogComponent
                open={state}
                onClose={toggler}
            >

                    <div className="edit_dialog_user">
                        <form onSubmit={handleSubmit(this.submitForm)}>
                        <div className="title">
                            <span>Delete user</span>
                        </div>
                            <div className="descriptions">
                                <span>You are about to delete <span className='username' style={{fontFamily: 'MontSemiBold'}}>{!!username && username.username}</span> from the system. <br/>Are you sure?</span>
                            </div>



                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={(e) => {e.preventDefault(); toggler(); reset('DeleteDialog')}}>Cancel</button>
                            <button className="blue_btn">delete</button>
                        </div>
                        </form>
                    </div>

            </DialogComponent>
        );
    }
}

DeleteDialog = reduxForm({
    form: 'DeleteDialog',
    enableReinitialize: true
})(DeleteDialog);

function mapStateToProps(state) {
    return{

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteUser,
        getUsersList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialog);
