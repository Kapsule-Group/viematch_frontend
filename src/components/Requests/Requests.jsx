import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Pagination from '../HelperComponents/Pagination/Pagination';
import MultiSelectComponent from "../HelperComponents/MultiSelectComponent/MultiSelectComponent";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import Loader from '../HelperComponents/ContentLoader/ContentLoader';

import {
    getAllActiveUsers,
    getUncompletedRequests,
    putRequestToCompleted,
    putRequestsToCompleted
} from '../../actions/requestsActions';

import './Requests.scss';
import moment from "moment";

class Requests extends Component {

    state = {
        loading: true,
        activePage: 1,
        openCompleteDialog: false,
        chosen_users: [],
        users_list: [],
        searchValue: '',
        checkedItems: []
    };

    componentDidMount() {
        this.doRequest();
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    doRequest = (page = 1) => {
        const { getUncompletedRequests, getAllActiveUsers } = this.props;
        const { chosen_users } = this.state;

        getAllActiveUsers().then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                const users_list = [];
                res.payload.data.forEach(el => users_list.push(`п${el.username}`));
                let customers = [];
                chosen_users.forEach(el => customers.push(el.slice(1)));
                customers.join(',');
                getUncompletedRequests(page, customers).then(res => {
                    if (res.payload && res.payload.status && res.payload.status === 200) {
                        this.setState({
                            users_list,
                            loading: false,
                            activePage: page
                        });
                    }
                });
            }
        })
    };

    changePage = (page) => {
        this.doRequest(page.selected + 1);
    };

    changeStatus = id => {
        const { putRequestToCompleted } = this.props;
        putRequestToCompleted(id).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState(({checkedItems}) => ({
                    checkedItems: checkedItems.filter(el => el !== id)
                }));
                this.doRequest()
            }
        });
    };

    handleSelectChange = e => {
        const chosen_users = e.target.value.filter(el => el !== undefined);
        this.setState({ chosen_users, checkedItems: [] });
        if (e.target.value.indexOf('undefined') === -1) {
            this.timeout = setTimeout(() => {
                this.doRequest();
            }, 0);
        }
    };

    handleSearch = e => {
        this.setState({ searchValue: e.target.value });
    };

    resetChosenUsers = () => {
        this.setState({ chosen_users: [] });
        this.timeout = setTimeout(()=> {
            this.doRequest();
        }, 0);
    };

    handleCheckbox = (e, id) => {
        e.persist();
        const { checkedItems } = this.state;
        let items = [...checkedItems];
        if (e.target.checked) {
            items.push(id);
            this.timeout = setTimeout(()=> {
                this.setState({ checkedItems: items });
            }, 0);
        } else {
            items = items.filter(el => el !== id);
            this.timeout = setTimeout(()=> {
                this.setState({ checkedItems: items });
            }, 0);
        }
    };

    toggleAllCheckboxes = (e) => {
        const { allIds } = this.props;
        if (e.target.checked) {
            this.setState({ checkedItems: allIds });
        } else {
            this.setState({ checkedItems: [] });
        }
    };

    toggleCompleteDialog = (id = null) => {
        this.setState(({openCompleteDialog}) => ({
            openCompleteDialog: !openCompleteDialog,
        }));
    };

    completeRequests = () => {
        const { putRequestsToCompleted } = this.props;
        const { checkedItems } = this.state;
        const data = { "list_ids": [...checkedItems] };
        putRequestsToCompleted(data).then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                this.setState({ checkedItems: [], openCompleteDialog: false });
                this.doRequest()
            }
        });
    };

    render(){
        const { uncompleted_requests, allIds } = this.props;
        const {
            activePage,
            openCompleteDialog,
            chosen_users,
            loading,
            users_list,
            searchValue,
            checkedItems
        } = this.state;
        const users = users_list.filter(el => el.toString().indexOf(searchValue.toString()) !== -1);

        return (
            <div className="requests_page content_block">
                <div className="title_page">Requests</div>
                <div className="content_page">
                    {loading ?
                        <Loader/>
                        :
                        <div className="requests_table">
                            <div className="panel_table">
                                <MultiSelectComponent
                                    item={chosen_users}
                                    items={users}
                                    handleChange={this.handleSelectChange}
                                    maxItems={1}
                                    placeholder={"All customers"}
                                    handleSearch={this.handleSearch}
                                    searchValue={searchValue}
                                    resetChosenUsers={this.resetChosenUsers}
                                />
                                <Link to="/main/requests/requests-complete">view all completed requests</Link>
                            </div>
                            <div className="table_container transactions_columns">
                                <div className="table_header">
                                    <div className="table_row">
                                        <div className="row_item">
                                            {uncompleted_requests.results.length > 0 &&
                                            <div className="check_field_wrapper">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={checkedItems.length === allIds.length}
                                                            onChange={this.toggleAllCheckboxes}
                                                            classes={{
                                                                root: 'custom_check'
                                                            }}
                                                        />
                                                    }
                                                    label=""
                                                />
                                            </div>
                                            }
                                            Customer
                                        </div>
                                        <div className="row_item">Product name</div>
                                        <div className="row_item">Qty</div>
                                        <div className="row_item">Date/time</div>
                                        <div className="row_item">Actions</div>
                                    </div>
                                </div>
                                <div className="table_body">
                                    {uncompleted_requests.results.length > 0 ?
                                        uncompleted_requests.results.map(el => (
                                            <div className="table_row" key={el.id}>
                                                <div className="row_item">
                                                    <div className="check_field_wrapper">
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    checked={checkedItems.includes(el.id)}
                                                                    onChange={(e) => this.handleCheckbox(e, el.id)}
                                                                    classes={{
                                                                        root: 'custom_check'
                                                                    }}
                                                                />
                                                            }
                                                            label=""
                                                        />
                                                    </div>
                                                    {el.customer_name}
                                                </div>
                                                <div className="row_item">{el.product_name}</div>
                                                <div className="row_item">{el.quantity}</div>
                                                <div className="row_item">{moment(el.date_created).format('DD/MM/YYYY HH:mm')}</div>
                                                <div className="row_item">
                                                    <span
                                                        className="green_text"
                                                        onClick={() => this.changeStatus(el.id)}
                                                    >
                                                        complete
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <h3>The list is empty</h3>
                                    }
                                </div>
                            </div>
                            {uncompleted_requests.count > 10 &&
                            <div className="pagination_info_wrapper">
                                <div className="pagination_block">
                                    <Pagination
                                        active={activePage - 1}
                                        pageCount={uncompleted_requests.total_pages}
                                        onChange={this.changePage}
                                    />

                                </div>
                                <div className="info">
                                    {uncompleted_requests.count > 0 &&
                                    `Displaying
                                                page ${activePage} of ${uncompleted_requests.total_pages},
                                                items ${activePage * 10 - 9} to ${activePage * 10 > uncompleted_requests.count ?
                                        uncompleted_requests.count : activePage * 10} of ${uncompleted_requests.count}`
                                    }
                                </div>
                            </div>
                            }
                        </div>
                    }
                </div>
                {checkedItems.length > 0 &&
                <div className="complete_block">
                    <div>
                        <div onClick={this.toggleAllCheckboxes}></div>
                        <p>{checkedItems.length}</p>
                        <span>items selected</span>
                    </div>
                    <button className="green_text" onClick={this.toggleCompleteDialog}>complete</button>
                </div>
                }
                <DialogComponent
                    open={openCompleteDialog}
                    onClose={this.toggleCompleteDialog}
                >
                    <div className="delete_dialog">
                        <div className="title">
                            <span>Complete requests</span>
                        </div>
                        <div className="descriptions">
                            <span>You are about to complete {checkedItems.length} selected requests.<br/>Are you sure?</span>
                        </div>
                        <div className="btn_wrapper">
                            <button className="cancel_btn" onClick={this.toggleCompleteDialog}>Cancel</button>
                            <button className="green_btn" onClick={this.completeRequests}>Complete</button>
                        </div>
                    </div>
                </DialogComponent>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uncompleted_requests: state.requests.uncompleted_requests,
        allIds: state.requests.allIds
    }
};

const mapDispatchToProps = {
    getAllActiveUsers,
    getUncompletedRequests,
    putRequestToCompleted,
    putRequestsToCompleted
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
