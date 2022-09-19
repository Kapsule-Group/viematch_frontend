import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DemandsBlock from "./DemandsBlock";
import SupplyScheduleBlock from "./SupplyScheduleBlock";
import Loader from "../HelperComponents/ContentLoader/ContentLoader";
import "./Subscriptions.scss";


class Subscriptions extends Component {
    state = {
        tab: "0",
        loading: false,
    };

    changeTab = (tab) => {
        this.setState({ tab, inputValue: "" });
    };

    render() {
        const {tab, loading} = this.state;
        return (
            <div className="subscriptions_page content_block">
                <div className="title_page">Subscriptions</div>
                <div className="content_page">
                    <div className="tab_customers">
                        <button
                            className={tab === "0" ? "active" : ""}
                            onClick={() => this.changeTab("0")}
                        >
                            demands
                        </button>
                        <button
                            className={tab === "1" ? "active" : ""}
                            onClick={() => this.changeTab("1")}
                        >
                            supply schedule
                        </button>
                    </div>
                    {loading ? (
                        <Loader />
                    ) : (
                        <Fragment>
                            {tab === "0" && (
                                <DemandsBlock/>
                            )}
                            {tab === "1" && (
                                <SupplyScheduleBlock/>
                            )}
                        </Fragment>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Subscriptions);
