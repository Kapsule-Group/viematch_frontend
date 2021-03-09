import React, { Component } from "react";
import Chart from "highcharts-react-official";
import * as Highcharts from "highcharts";
import "./HorizontalChart.scss";

class HorizontalChart extends Component {
    render() {
        const { data } = this.props;
        const sum =
            data &&
            data.length > 0 &&
            data.map(el => el.total_price).reduce((accumulator, currentValue) => accumulator + currentValue);
        const percents = data && data.map(el => Math.round((el.total_price / sum) * 100));
        const options = {
            plotOtions: {
                bar: {
                    color: "#3796F6"
                }
            },
            title: {
                text: null
            },
            credits: {
                enabled: false
            },
            chart: {
                type: "bar",
                height: 196,
                marginRight: 35,
                spacingLeft: 35,
            },
            xAxis: {
                categories: data,
                labels: {
                    style: {
                        fontFamily: "MontSemiBold",
                        fontSize: "12px",
                        color: "#3796F6",
                    },
                    useHtml: true,
                    formatter: item => {
                        return `<span>${item.value.cat_name}<span/>`;
                    }
                }
            },
            legend: {
                enabled: false
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                visible: false
            },
            tooltip: {
                enabled: false
            },
            series: [
                {
                    data: percents,
                    color: "#3796F6",
                    borderRadius: 2,
                    pointWidth: 24,
                    dataLabels: {
                        enabled: true,
                        format: "{point.y}%",
                        style: {
                            fontFamily: "MontSemiBold",
                            fontSize: "14px",
                            color: "#204569"
                        },
                        inside: false,
                        crop: false,
                        overflow: "allow"
                    }
                }
            ]
        };
        return <Chart highcharts={Highcharts} options={options} />;
    }
}

export default HorizontalChart;
