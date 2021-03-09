import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import "./PieChart.scss";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const CustomPieChart = ({ data, userInfo }) => {
    const total =
        data &&
        data.length > 0 &&
        data.map(el => el.total_price).reduce((accumulator, currentValue) => accumulator + currentValue);

    const ParamData = ({ item }) => (
        <span className="companies_list__item_price">
            {formatPrice(item)} {userInfo.currency}
        </span>
    );
    const formatPrice = price => {
        return new Intl.NumberFormat("de-DE").format(price);
    };
    return (
        <div className="monthly_overview__chart">
            <div className="pie_chart">
                <PieChart
                    data={
                        data &&
                        (data.length > 0
                            ? data.map((el, idx) => ({
                                  title: el.cat_name,
                                  value: el.total_price,
                                  color:
                                      idx === 0
                                          ? "#3796F6"
                                          : idx === 1
                                          ? "rgb(55, 150, 246, .7)"
                                          : idx === 2
                                          ? "#A6CEF7"
                                          : "#CFE6FF"
                              }))
                            : [{ title: "", value: 100, color: "#CFE6FF" }])
                    }
                    lineWidth={24}
                />
                <div className="pie_chart_inner">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h3 className="pie_chart__title">
                            {total &&
                                (total > 1000 && total < 1000000
                                    ? `${(total / 1000).toFixed(1)}K`
                                    : total > 1000000
                                    ? `${(total / 1000000).toFixed(2)}M`
                                    : `${total.toFixed(1)}`)}
                        </h3>
                        {total < 1000 &&
                            total > 0 &&
                            (userInfo.currency === "USD" ? (
                                <span style={{ fontSize: "32px", fontFamily: "MontSemiBold", color: "#204569" }}>
                                    $
                                </span>
                            ) : (
                                <span className="currency-rotate">{userInfo.currency}</span>
                            ))}
                    </div>
                    {total > 0 && <p className="pie_chart__info">In Total</p>}
                    {!total && <div className="no-value">N/A</div>}
                </div>
            </div>
            <ul className="companies_list">
                {data &&
                    data.map((el, idx) => (
                        <li className="companies_list__item">
                            <div
                                className="companies_list__part"
                                style={{
                                    background:
                                        idx === 0
                                            ? "#3796F6"
                                            : idx === 1
                                            ? "rgb(55, 150, 246, .7)"
                                            : idx === 2
                                            ? "#A6CEF7"
                                            : "#CFE6FF"
                                }}
                            />
                            <div className="companies_list__item__content">
                                {el.cat_id ? (
                                    <Link
                                        to={`/main/catalog/category/${el.cat_id}`}
                                        className="companies_list__item_name"
                                    >
                                        {el.cat_name}
                                    </Link>
                                ) : (
                                    <div className="companies_list__item_name">{el.cat_name}</div>
                                )}

                                <ParamData item={el.total_price} />
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        userInfo: state.users.userInfo
    };
}

export default connect(mapStateToProps)(CustomPieChart);
