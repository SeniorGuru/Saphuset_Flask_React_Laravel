import React, {Component, useState} from "react";
import Table from "../../../../Components/Table";
import {Card} from "react-bootstrap";
import ReactEcharts from "echarts-for-react";

export default function DayChart ({ selectedRow, dayChartNow, dayChartBefore, dayMax}){

    return (
        <div className="col-xl-4 col-lg-6 col-md-12 p-2">
            <Card style={{height: "400px"}} className="p-2">
                <div className="row m-2 justify-content-between">
                    <h4>Today</h4>
                    <h4>{selectedRow.sid + ' ' + selectedRow.AHOST} </h4>
                </div>
                <ReactEcharts
                    style={{height: "300px"}}
                    option={{
                        tooltip: {
                            trigger: 'axis',

                            axisPointer: {
                                animation: true
                            }
                        },
                        grid: {
                            left: '4%',
                            top: '4%',
                            right: '3%',
                            bottom: '10%'
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            data: [
                                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                                '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
                            ],
                            axisLabel: {
                                formatter: '{value}',
                                color: '#666',
                                fontSize: 12,
                                fontStyle: 'normal',
                                fontWeight: 400,

                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc',
                                    width: 1
                                }
                            },
                            axisTick: {
                                lineStyle: {
                                    color: '#ccc',
                                    width: 1
                                }
                            },
                            splitLine: {
                                show: false,
                                lineStyle: {
                                    color: '#ccc',
                                    width: 1
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            min: 0,
                            max: dayMax,
                            interval: dayMax/5,
                            axisLabel: {
                                formatter: '{value}',
                                color: '#666',
                                fontSize: 12,
                                fontStyle: 'normal',
                                fontWeight: 400,

                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#ccc',
                                    width: 1
                                }
                            },
                            axisTick: {
                                lineStyle: {
                                    color: '#ccc',
                                    width: 1
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#ddd',
                                    width: 1,
                                    opacity: 0.5
                                }
                            }
                        },
                        series: [{
                            name: 'Average',
                            type: 'line',
                            smooth: true,
                            data: dayChartBefore,
                            symbolSize: 8,
                            showSymbol: false,
                            lineStyle: {
                                color: 'rgb(255, 87, 33)',
                                opacity: 1,
                                width: 1.5,
                            },
                            itemStyle: {
                                show: false,
                                color: '#ff5721',
                                borderColor: '#ff5721',
                                borderWidth: 1.5
                            },
                            areaStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgba(255, 87, 33, 1)'
                                        }, {
                                            offset: 0.3,
                                            color: 'rgba(255, 87, 33, 0.7)'
                                        }, {
                                            offset: 1,
                                            color: 'rgba(255, 87, 33, 0)'
                                        }]
                                    }
                                }
                            }
                        },
                            {
                                name: 'Today',
                                type: 'line',
                                smooth: true,
                                data: dayChartNow,
                                symbolSize: 8,
                                showSymbol: false,
                                lineStyle: {
                                    color: 'rgb(95, 107, 194)',
                                    opacity: 1,
                                    width: 1.5,
                                },
                                itemStyle: {
                                    color: '#5f6cc1',
                                    borderColor: '#5f6cc1',
                                    borderWidth: 1.5
                                },
                                areaStyle: {
                                    normal: {
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0,
                                                color: 'rgba(95, 107, 194, 1)'
                                            }, {
                                                offset: 0.5,
                                                color: 'rgba(95, 107, 194, 0.7)'
                                            }, {
                                                offset: 1,
                                                color: 'rgba(95, 107, 194, 0)'
                                            }]
                                        }
                                    }
                                }
                            },
                        ],
                    }}
                />
                <div className="row m-2 justify-content-center">
                    <h4>0-24 Hours</h4>
                </div>
            </Card>
        </div>
    );
}
