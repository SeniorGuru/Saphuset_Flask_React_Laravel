import {
    Container,
    Row,
    Col, Form, Badge, FormControl, Card, Button,

} from "react-bootstrap";
import './style.css'
import React, {Suspense, useEffect, useState} from "react";
import ReactEcharts from "echarts-for-react";
import RightSetting from "./rightsetting";
import Table from "../../../Components/Table";
import BottomTable from "./bottomtable";
import Axios from "axios";
import DayChart from "./daychart";
import WeekChart from "./weekchart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ErrorTable from "./errortable";
import Modal from "react-bootstrap/Modal";

const defaultValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export default function Dumps({keys, index, setTabsBadge}) {

    const [startDate, setStartDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [groups, setGroups] = useState([]);
    const [snapList, setSnapList] = useState([])
    const [dayChartBefore, setDayChartBefore] = useState(defaultValue)
    const [dayChartNow, setDayChartNow] = useState(defaultValue)
    const [weekChartBefore, setWeekChartBefore] = useState(defaultValue)
    const [weekChartNow, setWeekChartNow] = useState(defaultValue)
    const [rows, setRows] = useState(0)
    const [dayMax, setDayMax] = useState(5)
    const [weekMax, setWeekMax] = useState(5)
    const [dayList, setDayList] = useState(defaultValue)
    const [groupId, setGroupId] = useState(0)
    const [statusId, setStatusId] = useState(0)
    const [periodId, setPeriodId] = useState(0)
    const [rangeSelect, setRangeSelect] = useState(false)
    const [statusDefault, setStatusDefault] = useState([0, 5, 7, 10])
    const [minDate, setMinDate] = useState('01/01/2021')
    const [maxDate, setMaxDate] = useState('01/02/2021')
    const [timeFlag, setTimeFlag] = useState(true)
    const [timeValue, setTimeValue] = useState(10)
    const [selectedRow, setSelectedRow] = useState(0)
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const ClearFilter = () => {
        setPeriodId(0)
        setGroupId(0)
        setStatusId(0)
        setRangeSelect(false)
        setToDate('')
        setStartDate('')
    }

    const GoClick = () => {
        if(startDate > toDate) setToDate(startDate)
        setPeriodId(0)
        setRangeSelect(true)
    }

    const handlePeriod = (event) => {
        setPeriodId(event.target.value)
        setRangeSelect(false)
    }

    const handelStatus = (event) => {
        setStatusId(event.target.value)
    }

    const handelGroupId = (event) => {
        setGroupId(event.target.value)
    }

    const [width, setWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth)
            if(window.innerWidth < 1200 && keys === 'Dumps'){
                setShow(true)
            } else {
                setShow(false)
            }
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [keys])
    const indents = [];
    for (let i = 0; i < 31; i++) {
        indents.push(<option key={i + 1} value={i + 1}>{i + 1} Days</option>);
    }

    const setChartValue = async (id) => {

        let ind = snapList.findIndex(list => list.id == id)
        setSelectedRow(snapList[ind])
        let response = await Axios.get("/api/q/rest?api=SystemMonitor@dumps@getCharts?id=" + id);
        let beforeMax = Math.max(...response.data.response.message.chart_list.before.map(item => item))
        let nowMax = Math.max(...response.data.response.message.chart_list.now.map(item => item))
        let max = beforeMax > nowMax ? beforeMax : nowMax
        setDayChartBefore(response.data.response.message.chart_list.before)
        setDayChartNow(response.data.response.message.chart_list.now)
        setDayMax((parseInt(max / 5) + 1) * 5)

        beforeMax = Math.max(...response.data.response.message.chart_list.weekbefore.map(item => item))
        nowMax = Math.max(...response.data.response.message.chart_list.weekNow.map(item => item))
        max = beforeMax > nowMax ? beforeMax : nowMax
        setWeekChartBefore(response.data.response.message.chart_list.weekbefore)
        setWeekChartNow(response.data.response.message.chart_list.weekNow)
        setWeekMax((parseInt(max / 5) + 1) * 5)
        setDayList(response.data.response.message.chart_list.weekdays)
    }

    const setConfig = async (checkFlag, timeVal, greenVal, yellowVal, redVal) => {
        setTimeFlag(checkFlag)
        setTimeValue(timeVal)
        try {
            const data = {
                greenVal: greenVal,
                yellowVal: yellowVal,
                redVal: redVal
            };
            await Axios.post("/api/q/rest?api=SystemMonitor@dumps@setConfiguration", {data});
            let temp_value = [0, 0, 0, 0]
            temp_value[1] = greenVal
            temp_value[2] = yellowVal
            temp_value[3] = redVal
            setStatusDefault(temp_value)
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }


    const setApproved = async (approves) => {
        try {
            const data = {
                approves: approves,
            };
            await Axios.post("/api/q/rest?api=SystemMonitor@dumps@setApproved", {data});
            getGroups();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }

    const getGroups = async () => {
        let response = await Axios.get("/api/q/rest?api=SystemMonitor@dumps@getDumps");

        let temp_value = [0, 0, 0, 0]
        let t_type = ['SUCCESS', 'WARNING', 'ERROR']
        t_type.map((val, index) => {
            let inx = response.data.response.message.conf_list.findIndex(list => list.status_type == val)
            temp_value[index + 1] = response.data.response.message.conf_list[inx].count
        })
        setStatusDefault(temp_value)

        setGroups([...response.data.response.message.group_list])
        setSnapList([...response.data.response.message.snap_list])
        setTabsBadge(index, response.data.response.message.today_number)

        let tmp = response.data.response.message.snap_list[0].DATUM
        let mindate1 = new Date(tmp.slice(6,10), tmp.slice(3,5), tmp.slice(0,2))
        let maxdate1 = new Date(tmp.slice(6,10), tmp.slice(3,5), tmp.slice(0,2))
        let mindate, maxdate;
        response.data.response.message.snap_list.map(val => {
            let ttmp = val.DATUM
            let tttmp = new Date(ttmp.slice(6,10), ttmp.slice(3,5), ttmp.slice(0,2))
            if (tttmp < mindate1) {
                mindate1 = tttmp
                mindate = ttmp
            }
            if (tttmp > maxdate1) {
                maxdate1 = tttmp
                maxdate = ttmp
            }
        })
        const min = mindate['3'] + mindate['4'] + '/' + mindate['0'] + mindate['1'] + '/' + mindate['6'] + mindate['7'] + mindate['8'] + mindate['9']
        const max = maxdate['3'] + maxdate['4'] + '/' + maxdate['0'] + maxdate['1'] + '/' + maxdate['6'] + maxdate['7'] + maxdate['8'] + maxdate['9']
        console.log(min, max)

        setMinDate(min)
        setMaxDate(max)
        setRows(rows + 1)
    }
    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if (snapList.length > 0) {
            console.log('hello')
            setChartValue(snapList[0].id)
        }
    }, [snapList])

    useEffect(() => {
        let interval = null;
        if (timeFlag) {
            interval = setInterval(() => {
                if (snapList.length > 0) {
                    let temp = [...snapList];
                    temp.push(temp.shift(1));
                    setSnapList(temp);
                    // setChartValue(temp[0].id);
                }
            }, timeValue * 1000);
        } else if (!timeFlag && timeValue !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timeFlag, timeValue, snapList]);

    let s_date = ''
    let t_date = ''
    if (rangeSelect) {
        s_date = startDate.getFullYear() + '.' + (startDate.getMonth() + 1 > 9 ? startDate.getMonth() + 1 : '0' + (startDate.getMonth() + 1)) + '.' + (startDate.getDate() > 9 ? startDate.getDate() : '0' + startDate.getDate())
        t_date = toDate.getFullYear() + '.' + (toDate.getMonth() + 1 > 9 ? toDate.getMonth() + 1 : '0' + (toDate.getMonth() + 1)) + '.' + (toDate.getDate() > 9 ? toDate.getDate() : '0' + toDate.getDate())
    }
    let snap_filter = (groupId === 0 && statusId === 0 && periodId === 0 && !rangeSelect) ? snapList :
        snapList.filter(list => (groupId === 0 ? true : (list.group_id.split(',').findIndex(list => list == groupId)) >= 0 ? true : false)
            && (statusId === 0 ? true : (list.totalDays > statusDefault[statusId - 1] && list.totalDays <= statusDefault[statusId]))
            && (!rangeSelect ? (periodId === 0 ? true : (list.period < periodId)) : (list.DATUM >= s_date && list.DATUM <= t_date))
        )
    return (
        <Suspense>
            <div className="p-16">
                <div className="row dump-menu p-16">
                    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">
                        <select className="form-control" onChange={handelGroupId} value={groupId}>
                            <option key="0" value="0" disabled={true}>Select Group</option>
                            {
                                groups.map(list => <option key={list.group_id}
                                                           value={list.group_id}>{list.group_name}</option>)
                            }
                        </select>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">
                        <select className="form-control" onChange={handelStatus} value={statusId}>
                            <option key="0" value="0" disabled={true}>Select Status</option>
                            <option key="1" value="1">Green</option>
                            <option key="2" value="2">Yellow</option>
                            <option key="3" value="3">Red</option>
                        </select>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">
                        <select className="form-control" value={periodId} onChange={handlePeriod}>
                            <option key="0" value="0" disabled={true}>Select Period</option>
                            {
                                indents
                            }
                        </select>
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">
                        <DatePicker
                            selected={startDate}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            onChange={date => setStartDate(date)}
                            minDate={new Date(minDate)}
                            maxDate={new Date(maxDate)}
                            placeholderText="From Date"
                        />
                    </Form.Group>
                    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">
                        <DatePicker
                            selected={toDate}
                            className="form-control"
                            dateFormat="dd/MM/yyyy"
                            onChange={date => setToDate(date)}
                            minDate={startDate}
                            maxDate={new Date(maxDate)}
                            placeholderText="To Date"
                        />
                    </Form.Group>
                    <div className="col-md-2 d-flex justify-content-between">
                        <button className="btn btn-primary btn-sm mb-3 ml-3" style={{fontSize: "16px"}}
                                onClick={GoClick} disabled={startDate === '' || toDate === ''}>
                            Go
                        </button>
                        <button className="btn btn-primary btn-sm mb-3 ml-3" style={{fontSize: "16px"}}
                                onClick={ClearFilter}>
                            Clear
                        </button>
                    </div>
                </div>
                <div className="row">
                    <DayChart selectedRow={selectedRow} dayChartBefore={dayChartBefore} dayChartNow={dayChartNow} dayMax={dayMax}/>
                    {width > 1200 &&
                    <WeekChart selectedRow={selectedRow} weekChartBefore={weekChartBefore} weekChartNow={weekChartNow} weekMax={weekMax}
                               dayList={dayList}/>}
                   <ErrorTable snapList={snapList} statusDefault={statusDefault}/>
                </div>
                <BottomTable snapList={snap_filter} setChartValue={setChartValue} statusDefault={statusDefault} setApproved={setApproved}/>
            </div>
            <RightSetting timeFlag={timeFlag} timeValue={timeValue} statusDefault={statusDefault} setConfig={setConfig}/>

            <Modal show={show} onHide={handleClose} size={'sm'} centered={true} >
                <Modal.Header closeButton>
                    <Modal.Title>Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You can see only week chart on full screen
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Suspense>
    );
}
