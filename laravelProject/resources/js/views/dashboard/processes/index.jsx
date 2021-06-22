import {
    Container,
    Row,
    Col, Form, Badge, FormControl, Card, Button,

} from "react-bootstrap";
import './style.css'
import React, {Suspense, useEffect, useState} from "react";
import ReactEcharts from "echarts-for-react";
import RightSetting from "./rightsetting";
import Axios from "axios";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import DialogChart from "./dialogchart";
import BatchChart from "./batchchart";
import SpoolChart from "./spoolchart";
import UpdChart from "./updchart";
import Upd2Chart from "./upd2chart";
import ProcessBottomTable from "./bottomtable";

const defaultValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export default function Processes({index, setTabsBadge}) {
    const [startDate, setStartDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [groups, setGroups] = useState([]);
    const [sysList, setSysList] = useState([]);
    const [rows, setRows] = useState(0)
    const [groupId, setGroupId] = useState(0)
    const [statusId, setStatusId] = useState(0)
    const [periodId, setPeriodId] = useState(0)
    const [rangeSelect, setRangeSelect] = useState(false)
    const [statusDefault, setStatusDefault] = useState([0, 5, 7, 10])
    const [minDate, setMinDate] = useState('01/01/2021')
    const [maxDate, setMaxDate] = useState('01/02/2021')
    const [stateList, setStateList] = useState([])

    //charts
    const [dialogAvg, setDialogAvg] = useState(defaultValue)
    const [dialogNow, setDialogNow] = useState(defaultValue)
    const [dialogMax, setDialogMax] = useState(10)
    const [batchAvg, setBatchAvg] = useState(defaultValue)
    const [batchNow, setBatchNow] = useState(defaultValue)
    const [batchMax, setBatchMax] = useState(10)
    const [spoolAvg, setSpoolAvg] = useState(defaultValue)
    const [spoolNow, setSpoolNow] = useState(defaultValue)
    const [spoolMax, setSpoolMax] = useState(10)
    const [updAvg, setUpdAvg] = useState(defaultValue)
    const [updNow, setUpdNow] = useState(defaultValue)
    const [updMax, setUpdMax] = useState(10)
    const [upd2Avg, setUpd2Avg] = useState(defaultValue)
    const [upd2Now, setUpd2Now] = useState(defaultValue)
    const [upd2Max, setUpd2Max] = useState(10)

    const ClearFilter = () => {
        setPeriodId(0)
        setGroupId(0)
        setStatusId(0)
        setRangeSelect(false)
        setToDate('')
        setStartDate('')
    }

    const GoClick = () => {
        if (startDate > toDate) setToDate(startDate)
        setPeriodId(0)
        setRangeSelect(true)
        setRows(rows + 1)
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
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    const indents = [];
    for (let i = 0; i < 31; i++) {
        indents.push(<option key={i + 1} value={i + 1}>{i + 1} Days</option>);
    }

    const setChartValue = async (sys, server) => {
        console.log('responses', periodId)
        let sdate = startDate != '' ? new Date(startDate): ''
        let tdate = toDate != '' ? new Date(toDate): ''
        console.log('responses', sdate)
        console.log('responses', tdate)
        const data = {
            sysname: sys,
            servername: server,
            periodId: periodId,
            startDate: startDate != '' ? sdate.getFullYear() + '-' + ( sdate.getMonth() + 1) + '-' + sdate.getDate() : '',
            toDate: toDate != '' ?tdate.getFullYear() + '-' + (tdate.getMonth() + 1) + '-' + tdate.getDate(): ''
        };
        let response = await Axios.post("/api/q/rest?api=SystemMonitor@process@getCharts", {data});
        console.log('responses', response)
        setDialogNow([...response.data.response.message.chart_list.DIA])
        setBatchNow([...response.data.response.message.chart_list.BGD])
        setSpoolNow([...response.data.response.message.chart_list.SPO])
        setUpdNow([...response.data.response.message.chart_list.UPD])
        setUpd2Now([...response.data.response.message.chart_list.UP2])

        let diaMax = Math.max(...response.data.response.message.chart_list.DIA.map(item => item))
        let diaAvg = response.data.response.message.chart_list.DIAAvg
        let tempavg = []
        for(let i = 0; i < 24; i++)
            tempavg.push(diaAvg)
        setDialogAvg([...tempavg])
        setDialogMax((parseInt((diaMax > diaAvg ? diaMax : diaAvg)/ 5 )  + 1) * 5)

        let bgdMax = Math.max(...response.data.response.message.chart_list.BGD.map(item => item))
        let bgdAvg = response.data.response.message.chart_list.BGDAvg
        tempavg = []
        for(let i = 0; i < 24; i++)
            tempavg.push(bgdAvg)
        setBatchAvg([...tempavg])
        setBatchMax((parseInt((bgdMax > bgdAvg ? bgdMax : bgdAvg)/ 5 )  + 1) * 5)

        let spoMax = Math.max(...response.data.response.message.chart_list.SPO.map(item => item))
        let spoAvg = response.data.response.message.chart_list.SPOAvg
        tempavg = []
        for(let i = 0; i < 24; i++)
            tempavg.push(spoAvg)
        setSpoolAvg([...tempavg])
        setSpoolMax((parseInt((spoMax > spoAvg ? spoMax : spoAvg)/ 5 )  + 1) * 5)

        let updMax = Math.max(...response.data.response.message.chart_list.UPD.map(item => item))
        let updAvg = response.data.response.message.chart_list.UPDAvg
        tempavg = []
        for(let i = 0; i < 24; i++)
            tempavg.push(updAvg)
        setUpdAvg([...tempavg])
        setUpdMax((parseInt((updMax > updAvg ? updMax : updAvg)/ 5 )  + 1) * 5)

        let upd2Max = Math.max(...response.data.response.message.chart_list.UP2.map(item => item))
        let upd2Avg = response.data.response.message.chart_list.UP2Avg
        tempavg = []
        for(let i = 0; i < 24; i++)
            tempavg.push(upd2Avg)
        setUpd2Avg([...tempavg])
        setUpd2Max((parseInt((upd2Max > upd2Avg ? upd2Max : upd2Avg)/ 5 )  + 1) * 5)
        // let beforeMax = Math.max(...response.data.response.message.chart_list.before.map(item => item))
        // let nowMax = Math.max(...response.data.response.message.chart_list.now.map(item => item))
        // let max = beforeMax > nowMax ? beforeMax : nowMax
        // setDayChartBefore(response.data.response.message.chart_list.before)
        // setDayChartNow(response.data.response.message.chart_list.now)
        // setDayMax((parseInt(max / 5) + 1) * 5)
        //
        // beforeMax = Math.max(...response.data.response.message.chart_list.weekbefore.map(item => item))
        // nowMax = Math.max(...response.data.response.message.chart_list.weekNow.map(item => item))
        // max = beforeMax > nowMax ? beforeMax : nowMax
        // setWeekChartBefore(response.data.response.message.chart_list.weekbefore)
        // setWeekChartNow(response.data.response.message.chart_list.weekNow)
        // setWeekMax((parseInt(max / 5) + 1) * 5)
        // setDayList(response.data.response.message.chart_list.weekdays)
    }

    const setConfig = async (greenVal, yellowVal, redVal) => {
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


    const getProcesses = async () => {

        console.log(periodId, rangeSelect)
        if(periodId == 0 && !rangeSelect) {
            let response = await Axios.get("/api/q/rest?api=SystemMonitor@process@getProcesses");

            let temp_value = [0, 0, 0, 0]
            let t_type = ['SUCCESS', 'WARNING', 'ERROR']
            t_type.map((val, index) => {
                let inx = response.data.response.message.conf_list.findIndex(list => list.status_type == val)
                temp_value[index + 1] = response.data.response.message.conf_list[inx].count
            })
            setStatusDefault(temp_value)
            setStateList(response.data.response.message.state_list)
            console.log('response', response.data.response.message)
            setGroups([...response.data.response.message.group_list])
            setSysList([...response.data.response.message.sys_list])
            // setTabsBadge(index, response.data.response.message.today_number)
            setMinDate(response.data.response.message.mindate)
            setMaxDate(response.data.response.message.maxdate)
        }
        if(periodId != 0 && !rangeSelect){
            let response = await Axios.get("/api/q/rest?api=SystemMonitor@process@getProcessesPeriod?id=" + periodId);
            setSysList([...response.data.response.message.sys_list])
        }
        if(rangeSelect){
            let sdate = new Date(startDate)
            let tdate = new Date(toDate)
            const data = {
                startDate: sdate.getFullYear() + '-' + ( sdate.getMonth() + 1) + '-' + sdate.getDate(),
                toDate: tdate.getFullYear() + '-' + (tdate.getMonth() + 1) + '-' + tdate.getDate()
            };
            let response = await Axios.post("/api/q/rest?api=SystemMonitor@process@getRange", {data});
            console.log('messages', response.data.response.message)
            setSysList([...response.data.response.message.sys_list])
        }
        setRows(rows + 1)
    }

    useEffect(() => {
        getProcesses();
    }, [periodId, rangeSelect]);

    useEffect(() => {
        if (sysList.length > 0) {
            setChartValue(sysList[0].mssysname, sysList[0].msservernames)
        }
    }, [sysList])

    let sys_filter = (groupId === 0 && statusId === 0) ? sysList :
        sysList.filter(list => (groupId === 0 ? true : (list.group_id.split(',').findIndex(list => list == groupId)) >= 0 ? true : false)
            && (statusId === 0 ? true : (list.status > statusDefault[statusId - 1] && list.status <= statusDefault[statusId]))
        )

    return (
        <Suspense>
            <div className="p-16">
                <div className="row dump-menu p-16 mb-2">
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
                            minDate={new Date(minDate)}
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
                <div className="row justify-content-between m-0 p-0">
                    <div className={`${width < 960 ? 'col-sm-12' : 'full-chart'}`}>
                        <DialogChart dialogAvg={dialogAvg} dialogNow={dialogNow} dialogMax={dialogMax}/>
                    </div>
                    <div className={`${width < 960 ? 'col-sm-12' : 'full-chart'}`}>
                        <BatchChart batchAvg={batchAvg} batchNow={batchNow} batchMax={batchMax}/>
                    </div>
                    <div className={`${width < 960 ? 'col-sm-12' : 'full-chart'}`}>
                        <SpoolChart spoolAvg={spoolAvg} spoolNow={spoolNow} spoolMax={spoolMax}/>
                    </div>
                    <div className={`${width < 960 ? 'col-sm-12' : 'full-chart'}`}>
                        <UpdChart updAvg={updAvg} updNow={updNow} updMax={updMax}/>
                    </div>
                    <div className={`${width < 960 ? 'col-sm-12' : 'full-chart'}`}>
                        <Upd2Chart upd2Avg={upd2Avg} upd2Now={upd2Now} upd2Max={upd2Max}/>
                    </div>
                </div>
                <ProcessBottomTable statusDefault={statusDefault} sysList={sysList} stateList={stateList}/>
            </div>
            <RightSetting statusDefault={statusDefault} setConfig={setConfig}/>
        </Suspense>
    );
}
