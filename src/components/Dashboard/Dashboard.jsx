import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import LineChart from "../HelperComponents/LineChart/LineChart";

import {
    getStatistics,
    getDashboardRequests,
    getRevenueForChart,
} from "../../actions/dashboardActions";
import { putRequestToCompleted } from "../../actions/requestsActions";

import arrow_forward from "../../assets/image/arrow_forward.svg";
import "./Dashboard.scss";

class Dashboard extends Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        const { getStatistics, getRevenueForChart, history } = this.props;
        getStatistics().then((res) => {
            if (
                res.payload &&
                res.payload.status &&
                res.payload.status === 200
            ) {
                getRevenueForChart().then((res) => {
                    if (
                        res.payload &&
                        res.payload.status &&
                        res.payload.status === 200
                    ) {
                        this.doRequest();
                    }
                });
            } else {
                history.push("/main/customers");
            }
        });
    }

    doRequest = () => {
        const { getDashboardRequests } = this.props;
        getDashboardRequests().then((res) => {
            if (
                res.payload &&
                res.payload.status &&
                res.payload.status === 200
            ) {
                this.setState({ loading: false });
            }
        });
    };

    changeStatus = (id) => {
        const { putRequestToCompleted } = this.props;
        putRequestToCompleted(id).then((res) => {
            if (
                res.payload &&
                res.payload.status &&
                res.payload.status === 200
            ) {
                this.doRequest();
            }
        });
    };

    render() {
        const { statistics, requests, revenue } = this.props;
        const { loading } = this.state;

        if (loading) return null;
        return (
            <div className="dashboard_page content_block">
                <div className="title_page">Dashboard</div>
                <div className="content_page">
                    <div className="box_dashboard">
                        <div className="chart_block">
                            <div className="chart_label">customers</div>
                            <div className="y_axis_label">amount</div>
                            <LineChart data={revenue} />
                        </div>
                        <div className="info_content_blocks">
                            <div>
                                <Link to="/main/catalog" className="">
                                    products
                                    <img
                                        className="arrow"
                                        src={arrow_forward}
                                        alt="arrow_forward"
                                    />
                                </Link>
                                <div className="info">
                                    <p>{statistics.products.total_count}</p>
                                    <span>
                                        {statistics.products.percent_products}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <Link to="/main/customers" className="">
                                    customers
                                    <img
                                        className="arrow"
                                        src={arrow_forward}
                                        alt="arrow_forward"
                                    />
                                </Link>
                                <div className="info">
                                    <p>{statistics.users.total_count}</p>
                                    <span>
                                        {statistics.users.percent_users}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<div className="dashboard_table">*/}
                    {/*    <div className="panel_table">*/}
                    {/*        <div>recent requests</div>*/}
                    {/*        <Link to="/main/requests">view all</Link>*/}
                    {/*    </div>*/}
                    {/*    <div className="table_container transactions_columns">*/}
                    {/*        <div className="table_header">*/}
                    {/*            <div className="table_row">*/}
                    {/*                <div className="row_item">Customer</div>*/}
                    {/*                <div className="row_item">Product name</div>*/}
                    {/*                <div className="row_item">Qty</div>*/}
                    {/*                <div className="row_item">Date/time</div>*/}
                    {/*                <div className="row_item">Actions</div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        <div className="table_body">*/}
                    {/*            {requests.length > 0 ?*/}
                    {/*                requests.map(el => (*/}
                    {/*                    <div className="table_row" key={el.id}>*/}
                    {/*                        <div className="row_item">{el.customer_name}</div>*/}
                    {/*                        <div className="row_item">{el.product_name}</div>*/}
                    {/*                        <div className="row_item">{el.quantity}</div>*/}
                    {/*                        <div className="row_item">{moment(el.date_created).format('DD/MM/YYYY HH:mm')}</div>*/}
                    {/*                        <div className="row_item ">*/}
                    {/*                            <div className="row_item">*/}
                    {/*                                <span*/}
                    {/*                                    className="green_text"*/}
                    {/*                                    onClick={() => this.changeStatus(el.id)}*/}
                    {/*                                >*/}
                    {/*                                    complete*/}
                    {/*                                </span>*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                ))*/}
                    {/*                :*/}
                    {/*                <h3>The list is empty</h3>*/}
                    {/*            }*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        statistics: state.dashboard.statistics,
        requests: state.dashboard.requests,
        revenue: state.dashboard.revenue,
    };
};

const mapDispatchToProps = {
    getStatistics,
    getDashboardRequests,
    putRequestToCompleted,
    getRevenueForChart,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
