import React, {Component, useState} from "react";
import Table from "../../../../Components/Table";
import {Button, Card, Form} from "react-bootstrap";
import ReactEcharts from "echarts-for-react";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AddTeamTable from "../../../team/AddTeamTable";

export default function WeekChart ({ selectedRow, weekChartBefore, weekChartNow, weekMax, dayList}){
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <div className="col-xl-4 p-2">
            <Card style={{height: "400px"}}>
                <div className="row pr-3 justify-content-between">
                    <h4 className="ml-4 mt-2 pt-2">Week</h4>
                    <h4 className="m-2 pt-2">{selectedRow.sid + ' ' + selectedRow.AHOST} </h4>
                    <div>
                        <Button variant="info" className="btn-icon m-0 btn-sm text-capitalize" onClick={()=> setShow(true)}>
                      <span className="ul-btn__icon">
                         <i className="i-Full-Screen-2"></i>
                      </span>
                        </Button>
                    </div>

                </div>
                <div className="p-2">
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
                                data: dayList,
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
                                max: weekMax,
                                interval: weekMax/5,
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
                                data: weekChartBefore,
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
                                    data: weekChartNow,
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
                </div>
                <div className="row justify-content-center">
                    <h4>Last 7 days</h4>
                </div>
            </Card>
            <Modal show={show} onHide={handleClose} size={'lg'} centered={true} >
                <Modal.Header closeButton>
                    <Modal.Title><div className="row pr-3 justify-content-between">
                        <h4 className="ml-4 mt-2 pt-2">Week</h4>
                        <h4 className="m-2 pt-2">{selectedRow.sid + ' ' + selectedRow.AHOST} </h4>
                    </div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ReactEcharts
                        style={{height: "600px"}}
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
                                data: dayList,
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
                                max: weekMax,
                                interval: weekMax/5,
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
                                data: weekChartBefore,
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
                                    data: weekChartNow,
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
                </Modal.Body>
            </Modal>
        </div>
    );
}
