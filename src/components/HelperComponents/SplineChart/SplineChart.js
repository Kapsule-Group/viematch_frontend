import React, { Component } from "react";
import Chart from "highcharts-react-official";
import moment from "moment";
import * as Highcharts from "highcharts/highstock";
import "./SplineChart.scss";
import { connect } from 'react-redux';

class SplineChart extends Component {
    render() {
        const { data, userInfo } = this.props;
        const options = {
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            chart: {
                marginTop: 30,
                type: "spline",
                height: 196,
                // width: "100%"
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
                min: 0,
                max: 12,
                scrollbar: {
                    enabled: true,
                    barBackgroundColor: "#CFE6FF",
                    barBorderRadius: 2,
                    trackBackgroundColor: "#EDF5FE",
                    trackBorderRadius: 2,
                    height: 2 / 2,
                    rifleColor: "#EDF5FE",
                    margin: 30
                },
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
                title: {
                    align: "high",
                    rotation: 0,
                    y: -15,
                    offset: -25,
                    text: `amount, ${userInfo.currency}`,
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
                    marker: {
                        enabled: false
                    },
                    data: data && data.map(el => el.total_price),
                    dataLabels: {
                        style: {
                            fontFamily: "MontSemiBold",
                            fontSize: "12px",
                            fontColor: "#3796F6"
                        }
                    },
                    color: "#F89547",
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
                    },
                    shadow: {
                        color: "#FFF7F1",
                        width: 10,
                        opacity: 1
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

export default connect(mapStateToProps)(SplineChart);
