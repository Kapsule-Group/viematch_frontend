import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import {
    getStockManagement,
    getPurchasesByCategory,
    getStockLevel,
    getMonthlyGraphic,
    getMonthlyDonut
} from "../../actions/dashboardActions";
import "./Dashboard.scss";
import { bindActionCreators } from "redux";
import StockManagementGraphic from "./../HelperComponents/StockManagementGraphic/StockManagementGraphic";
import HorizontalChart from "./../HelperComponents/HorizontalChart/HorizontalChart";
import { push } from "connected-react-router";
import VerticalChart from "./../HelperComponents/VerticalChart/VerticalChart";
import SplineChart from "./../HelperComponents/SplineChart/SplineChart";
import PieChart from "./../HelperComponents/PieChart/PieChart";

class Dashboard extends Component {
    state = {
        activeStock: 0,
        activeMonthly: 0,
        loading: true
    };

    componentDidMount() {
        const {
            getStockManagement,
            getPurchasesByCategory,
            getStockLevel,
            getMonthlyGraphic,
            getMonthlyDonut
        } = this.props;
        Promise.all([
            getStockManagement(),
            getPurchasesByCategory(),
            getStockLevel("month"),
            getMonthlyGraphic("purchase"),
            getMonthlyDonut("purchase")
        ]).then(res => this.setState({ loading: false }));
    }

    render() {
        const {
            stockManagement,
            purchasesByCategory,
            getStockLevel,
            push,
            stockLevel,
            getMonthlyGraphic,
            getMonthlyDonut,
            monthlyGraphicData,
            monthlyDonutData,
            history
        } = this.props;
        const token = localStorage.getItem("token");
        if (!token) history.push("/main/catalog");
        const { activeStock, activeMonthly, loading } = this.state;
        if (loading) return null;
        return (
            <div className="dashboard_page content_block" style={{ backgroundColor: "rgb(235, 244, 254)" }}>
                <div className="title_page">Analytics</div>
                <div className="graphics">
                    <div className="first-row">
                        <div>
                            <StockManagementGraphic data={stockManagement} push={push} />
                        </div>
                        <div>
                            <div className="category-header">
                                {purchasesByCategory.resp_type === "category"
                                    ? "Purchases by Category"
                                    : "Purchases by Subcategory"}
                            </div>
                            {purchasesByCategory && purchasesByCategory.data && purchasesByCategory.data.length > 0 ? (
                                <HorizontalChart data={purchasesByCategory && purchasesByCategory.data} push={push} />
                            ) : (
                                <div className="chart-no-results">We do not have data for this chart.</div>
                            )}
                        </div>
                        <div>
                            <div className="stock-level">
                                <p>Stock Level</p>
                                <div>
                                    <span
                                        className={activeStock === 0 ? "mm active" : "mm"}
                                        onClick={() => {
                                            this.setState({ activeStock: 0 });
                                            activeStock !== 0 && getStockLevel("month");
                                        }}
                                    >
                                        mm
                                    </span>
                                    <span
                                        className={activeStock === 1 ? "yy active" : "yy"}
                                        onClick={() => {
                                            this.setState({ activeStock: 1 });
                                            activeStock !== 1 && getStockLevel("year");
                                        }}
                                    >
                                        yy
                                    </span>
                                </div>
                            </div>
                            {stockLevel.length > 0 ? (
                                <VerticalChart data={stockLevel && stockLevel} />
                            ) : (
                                <div className="chart-no-results">We do not have data for this chart.</div>
                            )}
                        </div>
                    </div>
                    <div className="second-row">
                        <div className="second-row-header">
                            <span
                                className={activeMonthly === 0 ? "active-header" : ""}
                                onClick={() => {
                                    this.setState({ activeMonthly: 0 });
                                    activeMonthly !== 0 && getMonthlyGraphic("purchase");
                                    activeMonthly !== 0 && getMonthlyDonut("purchase");
                                }}
                            >
                                Monthly Purchases
                            </span>
                            <span
                                className={activeMonthly === 1 ? "active-header" : ""}
                                onClick={() => {
                                    this.setState({ activeMonthly: 1 });
                                    activeMonthly !== 1 && getMonthlyGraphic("consumption");
                                    activeMonthly !== 1 && getMonthlyDonut("consumption");
                                }}
                            >
                                Monthly Consumption
                            </span>
                        </div>
                        <div className="second-row-content">
                            <div>
                                <SplineChart data={monthlyGraphicData} />
                            </div>
                            <div>
                                <PieChart data={monthlyDonutData && monthlyDonutData.data} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        stockManagement: state.dashboard.stockManagement,
        purchasesByCategory: state.dashboard.purchasesByCategory,
        stockLevel: state.dashboard.stockLevel,
        monthlyGraphicData: state.dashboard.monthlyGraphicData,
        monthlyDonutData: state.dashboard.monthlyDonutData
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            getStockManagement,
            getPurchasesByCategory,
            getStockLevel,
            getMonthlyGraphic,
            getMonthlyDonut,
            push
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
