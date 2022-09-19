import React from 'react';
import AreaChart from "highcharts-react-official";
import * as Highcharts from 'highcharts';

const LineChart = ({ data }) => {
    let datesArray = [];
    let valuesArray = [];
    data.forEach(el => {
        datesArray.push(new Date(el.date).toLocaleString('en-US', { month: 'long', year: 'numeric' }).toLowerCase());
        valuesArray.push(el.count);
    });
    const options = {
        title: {
            text: null
        },
        tooltip: {
            headerFormat: '',
            formatter: function() {
                return '<span style="color:#8FA2B4; opacity: 0.5; font-weight: 300; letter-spacing: -0.42px; font-size: 10px;">'+ this.x + '</span><br/>' +
                    '<span style="color:#204569; font-size: 18px; font-weight: 600; letter-spacing: -0.42px;">' + this.y + '</span>' +
                    '<span style="color:#FFFFFF;">n</span>' +
                    '<span style="color:#2CC197; font-size: 12px; font-weight: 300">' + (data.find(el => el.count === this.y).percent === null ? '0%' : data.find(el => el.count === this.y).percent) + '</span>';
            },
            borderWidth: 0,
            backgroundColor: '#FFFFFF',
            padding: 14,
            style:{
                fontFamily: 'MontBook,sans-serif'
            }
        },
        plotOptions: {
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            },
            series: {
                fillColor: "rgb(248, 149, 71, 0)",
                lineColor: "#F89547",
                lineShadow: true,
                lineWidth: 4,
                shadow: {
                    color: "#F3EFEB",
                    width: 20,
                    opacity: 1
                },
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            fillColor: "#F89547"
                        }
                    }
                }
            }
        },
        credits: {
            enabled: false
        },
        chart: {
            type: "areaspline",
            height: 330
        },
        navigation: {
            menuItemStyle: {
                fontWeight: 'normal',
                fontFamily: 'MontLight,sans-serif',
                fontSize: 14,
                fontColor: "#1A1A1A"
            }
        },
        xAxis: {
            categories: datesArray,
            // showLastLabel: false,
            gridLineWidth: 1,
            gridLineColor: 'rgb(6, 69, 32, 0.05)',
            tickColor: "#8FA2B4",
            lineColor: "#8FA2B4",
            tickWidth: 1,
            tickLength: 5,
            labels: {
                style: {
                    color: "rgb(32, 69, 105, 0.5)"
                },
                formatter: function() {
                    return this.value.toString().substring(0, 3);
                },
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineColor: 'rgb(6, 69, 32, 0.05)',
            tickAmount: 7,
            lineWidth: 1,
            lineColor: "#8FA2B4",
            tickColor: "#8FA2B4",
            tickWidth: 1,
            tickLength: 5,
            labels: {
                style: {
                    color: "rgb(32, 69, 105, 0.5)"
                }
            }
        },
        series: [{
            showInLegend: false,
            data: valuesArray,
            dataLabels: {
                style:{
                    fontWeight: 'normal',
                    fontFamily: 'MontLight,sans-serif',
                    fontSize: 14,
                    fontColor: "#1A1A1A"
                }
            }
        }]
    };
    return (
        <AreaChart
            highcharts={Highcharts}
            options={options}
        />
    )
};

export default LineChart;