import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import Pagination from '../../HelperComponents/Pagination/Pagination';
import MultiSelectComponent from "../../HelperComponents/MultiSelectComponent/MultiSelectComponent";
import Loader from '../../HelperComponents/ContentLoader/ContentLoader';

import { getCompletedRequests, getAllActiveUsers } from '../../../actions/requestsActions';

import Path from '../../../assets/image/Path.svg';

import './RequestsComplete.scss';

class Requests extends Component {

    state = {
        loading: true,
        activePage: 1,
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
        const { getCompletedRequests, getAllActiveUsers } = this.props;
        const { chosen_users } = this.state;

        getAllActiveUsers().then(res => {
            if(res.payload && res.payload.status && res.payload.status === 200) {
                const users_list = [];
                res.payload.data.forEach(el => users_list.push(`п${el.username}`));
                let customers = [];
                chosen_users.forEach(el => customers.push(el.slice(1)));
                customers.join(',');
                getCompletedRequests(page, customers).then(res => {
                    if(res.payload && res.payload.status && res.payload.status === 200) {
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


    handleSelectChange = e => {
        let chosen_users = e.target.value.filter(el => el !== undefined);
        this.setState({ chosen_users });
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

    render(){
        const { completed_requests } = this.props;
        const {
            activePage,
            chosen_users,
            loading,
            users_list,
            searchValue
        } = this.state;
        const users = users_list.filter(el => el.toString().indexOf(searchValue.toString()) !== -1);

        return (
            <div className="requests_complete_page content_block">
                <div className="custom_title_wrapper">
                    <div className="link_req"><Link to="/main/requests"><img src={Path} alt="Path"/>Requests</Link></div>
                    <div className="title_page">Completed requests</div>
                </div>
                <div className="content_page">
                    {loading ?
                        <Loader />
                        :
                        <div className="requests_complete_table">
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
                            </div>
                            <div className="table_container transactions_columns">
                                <div className="table_header">
                                    <div className="table_row">
                                        <div className="row_item">Customer</div>
                                        <div className="row_item">Product name</div>
                                        <div className="row_item">Qty</div>
                                        <div className="row_item">Date/time</div>
                                    </div>
                                </div>
                                <div className="table_body">
                                    {completed_requests.results.length > 0 ?
                                        completed_requests.results.map(el => (
                                            <div className="table_row" key={el.id}>
                                                <div className="row_item">{el.customer_name}</div>
                                                <div className="row_item">{el.product_name}</div>
                                                <div className="row_item">{el.quantity}</div>
                                                <div className="row_item">{moment(el.date_created).format('DD/MM/YYYY HH:mm')}</div>
                                            </div>
                                        ))
                                        :
                                        <h3>The list is empty</h3>

                                    }
                                </div>
                            </div>
                            {completed_requests.count > 10 &&
                            <div className="pagination_info_wrapper">

                                <div className="pagination_block">
                                    <Pagination
                                        active={activePage - 1}
                                        pageCount={completed_requests.total_pages}
                                        onChange={this.changePage}
                                    />
                                </div>
                                <div className="info">
                                    {completed_requests.count > 0
                                        ?
                                        `Displaying
                                                page ${activePage} of ${completed_requests.total_pages},
                                                items ${activePage * 5 - 4} to ${activePage * 5 > completed_requests.count ?
                                            completed_requests.count : activePage * 5} of ${completed_requests.count}`
                                        :
                                        `items ${completed_requests.count}`
                                    }
                                </div>
                            </div>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        completed_requests: state.requests.completed_requests
    }
};

const mapDispatchToProps = {
    getCompletedRequests,
    getAllActiveUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Requests);
