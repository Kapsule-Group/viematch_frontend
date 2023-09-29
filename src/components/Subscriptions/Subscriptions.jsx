import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import Pagination from "../HelperComponents/Pagination/Pagination";

import SelectComponent from "../HelperComponents/SelectComponent/SelectComponent";
import { getOption } from "../HelperComponents/functions";
import "./Subscriptions.scss";
import DownloadImg from "../../assets/image/download_tax.svg";
import ConfirmImg from "../../assets/image/confirm.svg";
import DownloadDoc from "../../assets/image/download_doc.svg";
import { Link } from "react-router-dom";
import DialogComponent from "../HelperComponents/DialogComponent/DialogComponent";
import { getSubs, cancelSub } from "./../../actions/activityActions";

class Subscriptions extends Component {
    state = {
        stock: "in",
        activePage: 1,
        loading: true,
        searchValue: "",
        dialogOpened: false,
        chosenId: null,
        chosenName: "",
        subscriptionsLog: [
            {
                date: "1/12/2021  12:42",
                number: "123698",
                name:
                    "test 1 attaattaatt aattaattaatt aattaattaattaatt aattaattaattaattaat taattaattaatt aattaattaa ttaatta attaattaatta attaatta",
                name_link: "/product-details/1695",
                amount: "1",
                price: "$11.90",
                period: "Week",
                status: "Requested",
                id: "1"
            },
            {
                date: "1/12/2021  12:42",
                number: "123698",
                name: "test 1",
                name_link: "/product-details/1695",
                amount: "1",
                price: "$11.90",
                period: "Month",
                status: "Active",
                id: "2"
            },
            {
                date: "1/12/2021  12:42",
                number: "123698",
                name: "test 1",
                name_link: "/product-details/1695",
                amount: "1",
                price: "$11.90",
                period: "Year",
                status: "Canceled",
                id: "3"
            }
        ],
        option: { label: getOption("All statuses"), value: null },
        option_list: [
            { label: getOption("All statuses"), value: null },
            { label: getOption("Requested"), value: "requested" },
            { label: getOption("Active"), value: "active" },
            { label: getOption("Canceled"), value: "canceled" }
        ]
    };

    componentDidMount() {
        const { getSubs } = this.props;
        getSubs();
    }

    doRequest = () => {};

    changePage = page => {
        const { getSubs } = this.props;
        const { option, searchValue } = this.state;
        this.setState({ activePage: page.selected + 1 });
        getSubs(page.selected + 1, searchValue, option && option.value);
    };

    render() {
        const { option, searchValue, option_list, activePage, dialogOpened, chosenId, chosenName } = this.state;
        const { activityLog, subscriptions, getSubs, cancelSub } = this.props;
        const { results, count } = subscriptions;

        return (
            <div className="subscriptions_page content_block" style={{ backgroundColor: "#EBF4FE" }}>
                <div className="title_page">Subscriptions</div>
                <div className="subscriptions_block">
                    <div className="option">
                        <div className="block_search">
                            <div className="input-group">
                                <div className="search_info">
                                    <input
                                        type="text"
                                        className="search_info reset"
                                        placeholder="Search by product…"
                                        onChange={e => {
                                            const {
                                                target: { value }
                                            } = e;
                                            this.setState({
                                                searchValue: value,
                                                activePage: 1
                                            });
                                            getSubs(1, value, option && option.value);
                                        }}
                                        value={searchValue}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="select_wrapper">
                            <SelectComponent
                                value={option}
                                options={option_list}
                                change={e => {
                                    this.setState({ option: e, activePage: 1 });
                                    getSubs(1, searchValue, e.value);
                                }}
                                isClearable="false"
                                isSearchable={false}
                                placeholder="Select search option"
                            />
                        </div>
                    </div>
                    <div className="in_stock_table">
                        <div className="table_container transactions_columns">
                            <div className="table_header">
                                <div className="table_row">
                                    <div className="row">
                                        <div className="row_item">Date/time</div>
                                        <div className="row_item">#</div>
                                        <div className="row_item">Product</div>
                                        <div className="row_item">Amount</div>
                                        <div className="row_item">Price</div>
                                        <div className="row_item">Period</div>
                                        <div className="row_item">Status</div>
                                        <div className="row_item">Actions</div>
                                    </div>
                                </div>
                            </div>
                            <div className="table_body">
                                {results && results.length > 0 ? (
                                    results &&
                                    results.map(({ date, price_per_unit, status, period, quantity, id, product }) => (
                                        <div className="table_row" key={id}>
                                            <div className="row">
                                                <div className="row_item">
                                                    {moment(date).format("DD/MM/YYYY  HH:mm")}
                                                </div>
                                                <div className="row_item">{id}</div>
                                                <div className="row_item link">
                                                    <Link to={`/main/product-details/${product && product.id}`}>
                                                        <span>{product && product.name}</span>
                                                    </Link>
                                                </div>
                                                <div className="row_item">{quantity}</div>
                                                <div className="row_item">
                                                    {new Intl.NumberFormat("en-US", {
                                                        minimumFractionDigits: 2
                                                    }).format(Number(price_per_unit).toFixed(2))}
                                                </div>
                                                <div className="row_item">{period}</div>
                                                <div className="row_item status">
                                                    <div
                                                        className={
                                                            status === "requested"
                                                                ? "requested"
                                                                : status === "active"
                                                                ? "active"
                                                                : "canceled"
                                                        }
                                                    >
                                                        {status}
                                                    </div>
                                                </div>

                                                <div className="row_item btn_info">
                                                    {status === "canceled" ? (
                                                        <span>-</span>
                                                    ) : (
                                                        <button
                                                            onClick={() =>
                                                                this.setState({
                                                                    dialogOpened: true,
                                                                    chosenId: id,
                                                                    chosenName: product && product.name
                                                                })
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="table_row">
                                        <div className="row">no items</div>
                                    </div>
                                )}
                                {count > 10 && (
                                    <Pagination
                                        active={activePage - 1}
                                        pageCount={Math.ceil(count / 10)}
                                        onChange={this.changePage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogComponent
                    open={dialogOpened}
                    onClose={() => this.setState({ dialogOpened: false, chosenId: null, chosenName: "" })}
                    paper_classes=""
                >
                    <div className="dialog_subscription">
                        <div className="title">Cancel subscription</div>
                        <div className="descriptions">
                            You are about to cancel the subscription to the <span>{chosenName}</span> Are you sure?
                        </div>
                        <div className="btn_wrapper">
                            <button
                                className="cancel_btn"
                                onClick={() => this.setState({ dialogOpened: false, chosenId: null, chosenName: "" })}
                            >
                                cancel
                            </button>
                            <button
                                className="blue_btn"
                                onClick={() =>
                                    cancelSub(chosenId).then(res => {
                                        if (res.payload && res.payload.status && res.payload.status === 200) {
                                            getSubs(activePage, searchValue, option && option.value);
                                            this.setState({ dialogOpened: false, chosenId: null, chosenName: "" });
                                        }
                                    })
                                }
                            >
                                CONFIRM
                            </button>
                        </div>
                    </div>
                </DialogComponent>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        subscriptions: state.activity.subscriptions
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ getSubs, cancelSub }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
