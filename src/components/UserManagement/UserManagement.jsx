import React, { Fragment, Component} from 'react';
import {connect} from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import EditDialog from "./Dialogs/EditDialog";
import AddingDialog from "./Dialogs/AddingDialog";
import DeleteDialog from "./Dialogs/DeleteDialog";
import { getUsersList, resetErrorUsers } from "../../actions/UserActions";

import './UserManagement.scss';


class UserManagement extends Component {
    state = {
        openDeleteDialog: false,
        openEditDialog: false,
        openAddDialog: false,
        loading: true,
    };

    componentDidMount() {
        this.doRequest();
    }

    doRequest = () => {
        const { getUsersList } = this.props;
        getUsersList().then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({
                    loading: false,
                })
        }})
    };
     ucFirst = (str) => {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    };

    toggleDeleteDialog = (data) => {
        this.setState(({openDeleteDialog}) => ({
            openDeleteDialog: !openDeleteDialog,
            userData: data,
        }));
    };

    toggleAddDialog = (id = null) => {
        this.setState(({openAddDialog}) => ({
            openAddDialog: !openAddDialog,
        }));
        const {resetErrorUsers} = this.props;
        resetErrorUsers()
    };

    toggleEditDialog = (data) => {
        this.setState(({openEditDialog}) => ({
            openEditDialog: !openEditDialog,
            userData: data,
        }));
    };

    render(){
        const { openDeleteDialog, openEditDialog, openAddDialog, loading, userData } = this.state;
        const { users_list } = this.props;
        if (loading) return null;
        return (
            <div className="user_management_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">User management</div>
                <div className="content_page">
                        <div className="user_management_table">
                        <div className="table_panel">
                            <button onClick={this.toggleAddDialog}>+ add user</button>
                        </div>

                        <div className="table_container transactions_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <div className="row_item">Name</div>
                                    <div className="row_item">Email</div>
                                    <div className="row_item">Role</div>
                                    <div className="row_item">Actions</div>
                                </div>
                            </div>
                            <div className="table_body">
                                { users_list.count  ? <Fragment>
                                {users_list.results.map( (user, key) => (
                                    <div className="table_row" key={key} >
                                        <div className="row_item">{user.username}</div>
                                        <div className="row_item">{user.email}</div>
                                        <div className="row_item">{this.ucFirst(user.role)}</div>
                                        <div className="row_item ">
                                            <button className="blue_text" onClick={() => this.toggleEditDialog(user)}>Edit</button>
                                            <button className="red_text" onClick={() => this.toggleDeleteDialog(user)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                </Fragment> : <div className='table_row cap'>This list is empty</div>}
                            </div>
                        </div>

                        </div>
                </div>

                <EditDialog initialValues={userData} toggler={this.toggleEditDialog} state={openEditDialog}/>
                <AddingDialog toggler={this.toggleAddDialog} state={openAddDialog}/>
                <DeleteDialog username={userData} toggler={this.toggleDeleteDialog} state={openDeleteDialog}/>

            </div>
        );
    }
}

UserManagement = reduxForm({
    form: 'UserManagement',

})(UserManagement);

function mapStateToProps(state) {
    return{
        users_list: state.users.users_list,
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUsersList,
        resetErrorUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
