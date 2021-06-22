import React, {Component, useEffect, useState} from 'react';
import {
    Container,
    Row,
    Col,

} from "react-bootstrap";

import './style.css';
import TimeField from "react-simple-timefield";

const weekday = [
    {
        "key":"Sunday",
        "value": 0
    },
    {
        "key":"Monday",
        "value": 0
    },
    {
        "key":"Tuesday",
        "value": 0
    },
    {
        "key":"Wednesday",
        "value": 0
    },
    {
        "key":"Thursday",
        "value": 0
    },
    {
        "key":"Friday",
        "value": 0
    },{
        "key":"Saturday",
        "value": 0
    },
    ];
export default function WorkingDate( { moduleTime_list, moduleDate_list, editflag, setFromTimes, setToTimes, setDayLists}) {

    const [weekdays, setWeekDays] = useState(weekday);
    const [rows, setRows] = useState(0);
    const [fromTimeFlag, setFromTimeFlag]= useState(false);
    const [toTimeFlag, setToTimeFlag]= useState(false);
    const [fromTime, setFromTime] = useState('')
    const [toTime, setToTime] = useState('')

    useEffect(()=>{

        setFromTimes(fromTime)
        setToTimes(toTime)
        setDayLists([...weekdays])
        setRows(rows + 1)
    }, [editflag])

    useEffect(() => {
        if (moduleDate_list) {
            let temp = [...weekdays];
            moduleDate_list.days.map((val, index) => {
                temp[index].value = val
            })
            setWeekDays(temp);
            setRows(rows + 1);
        }
    }, [moduleDate_list])

    useEffect(()=> {
        if(moduleTime_list){
            let p_t1 = '';
            let time1 = moduleTime_list.from_time.split(":")[0];

            if(parseInt(time1) < 10){
                p_t1 = '0' + time1.toString();
            } else {
                p_t1 = time1;
            }
            let time2 = moduleTime_list.from_time.split(":")[1];
            setFromTime(p_t1 + ':' + time2)
            time1 = moduleTime_list.to_time.split(":")[0];
            if(parseInt(time1) < 10){
                p_t1 = '0' + time1.toString();
            } else {
                p_t1 = time1;
            }
            time2 = moduleTime_list.to_time.split(":")[1];
            setToTime(p_t1 + ':' + time2)
        }
    }, [moduleTime_list])
    const handlecheck = (index) => {
        if(!editflag) return;
        let temp = [...weekdays];
        temp[index].value = temp[index].value === 1 ? 0: 1;
        setWeekDays(temp)
    }
    const  firstOnTimeChange = (event, value) => {
        const newTime = value.replace(/-/g, ':');
        const time = newTime.substr(0, 5);

        setFromTime(time)
        setFromTimes(time)
    }
    const  toOnTimeChange = (event, value) => {
        const newTime = value.replace(/-/g, ':');
        const time = newTime.substr(0, 5);

        setToTime(time)
        setToTimes(time)
    }
    return (
        <Col sm="6" className="p-16">
            <div className="date-container p-16">
                <h4>Working Hours</h4>

                <div className="row p-16 ml-5">
                    <div>
                        {
                            editflag ?<TimeField
                                value={fromTime}
                                onChange={firstOnTimeChange}
                                className="time-input"
                            /> :<h5>{fromTime}</h5>
                        }
                    </div>
                    <div className="ml-16">
                        {
                            editflag?<TimeField
                                value={toTime}
                                onChange={toOnTimeChange}
                                className="time-input"
                            /> :<h5 >{toTime}</h5>
                        }

                    </div>
                </div>
                <h4>Working Days</h4>
                <div className="row m-0 pt-16">
                    {weekdays.map((gro, index) => {
                        return (
                            <div className="form-check mb-2" key={index}>
                                <label className="checkbox checkbox-primary">
                                    <input
                                        type="checkbox"
                                        checked={gro.value}
                                        onChange={()=>handlecheck(index)}
                                        name={gro.key}
                                        id={`daycheck${index}`}
                                    />
                                    <span htmlFor={`daycheck${index}`}>{gro.key}</span>
                                    <span className="checkmark"></span>
                                </label>
                                {/* <input className="form-check-input" type="checkbox" id={`daycheck${index}`}*/}
                                {/*                         name={gro.key}  checked={gro.value} onChange={()=>handlecheck(index)}/>*/}
                                {/*<label className="form-check-label cursor-pointer mr-4"  htmlFor={`daycheck${index}`}*/}
                                {/*       >*/}
                                {/*    {gro.key}*/}
                                {/*</label>*/}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Col>
    )
}
