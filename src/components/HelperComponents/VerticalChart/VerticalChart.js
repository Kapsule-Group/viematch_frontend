import React, { Component } from "react";
import Chart from "highcharts-react-official";
import * as Highcharts from "highcharts";
import "./VerticalChart.scss";
import moment from "moment";
import { connect } from "react-redux";

class VerticalChart extends Component {
    render() {
        const { data, userInfo } = this.props;
        const options = {
            plotOtions: {
                column: {
                    color: "#2CC197"
                }
            },
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            chart: {
                marginTop: 30,
                type: "column",
                height: 196
            },
            xAxis: {
                categories: data && data.map(el => moment(el.date_val).format("DD MMM")),
                labels: {
                    style: {
                        fontFamily: "MontRegular",
                        fontSize: "8px",
                        color: "#3796F6",
                        opacity: ".5",
                        color: "#204569"
                    }
                },
                crosshair: true,
                gridLineWidth: 1,
                showLastLabel: true,
                lineWidth: 1,
                lineColor: "#8FA2B4"
            },
            legend: {
                enabled: false
            },
            yAxis: {
                min: 0,
                gridLineWidth: 1,
                labels: {
                    style: {
                        fontFamily: "MontRegular",
                        fontSize: "8px",
                        color: "#3796F6",
                        opacity: ".5",
                        color: "#204569"
                    }
                },
                // visible: false,
                title: {
                    align: "high",
                    rotation: 0,
                    y: -15,
                    offset: -20,
                    text: `value, ${userInfo.currency}`,
                    style: {
                        fontFamily: "MontLight",
                        color: "#204569",
                        opacity: ".5",
                        fontSize: "10px"
                    }
                },
                lineWidth: 1,
                lineColor: "#8FA2B4",
                minorGridLineWidth: 0,
                minorTickInterval: "auto",
                minorTickWidth: 1,
                minorTickLength: 5
            },
            tooltip: {
                enabled: false
            },
            series: [
                {
                    data: data && data.map(el => el.total_price),
                    dataLabels: {
                        style: {
                            fontFamily: "MontSemiBold",
                            fontSize: "12px",
                            fontColor: "#3796F6"
                        }
                    },
                    color: "#2CC197",
                    borderRadius: 2,
                    pointWidth: 24,
                    dataLabels: {
                        enabled: false,
                        format: "{point.y}%",
                        style: {
                            fontFamily: "MontSemiBold",
                            fontSize: "14px",
                            color: "#204569"
                        },
                        inside: false,
                        align: "right"
                    }
                }
            ]
        };
        return <Chart highcharts={Highcharts} options={options} />;
    }
}

function mapStateToProps(state) {
    return {
        userInfo: state.users.userInfo
    };
}

export default connect(mapStateToProps)(VerticalChart);
