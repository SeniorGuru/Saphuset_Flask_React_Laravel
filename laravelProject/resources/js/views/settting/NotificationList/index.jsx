import React, {Component, useEffect, useState} from 'react';
import {
    Container,
    Row,
    Col,

} from "react-bootstrap";

import './style.css';

export default function NotificationList({notification_list, editflag, module ,setNotiLists}) {

    const [notiList, setNotiList] = useState([]);
    const [rows, setRows] = useState(0);
    useEffect(()=>{
        if(notification_list){
            let t_array = [...notification_list];
            let t_array1 = [];
            t_array.map(value => {
                if(value.module === module){
                    let element = {
                        "key": value.notif_type,
                        "description": value.description,
                        "allowed": value.allowed
                    }
                    t_array1.push(element)
                }
            })
            setNotiList([...t_array1])
            setRows(rows + 1)
        }
    }, [notification_list, module])
    useEffect(()=> {
        setNotiLists(notiList)
    }, [editflag])

    const handlecheck = (index) => {
        if(!editflag) return
        let temp = [...notiList];
        temp[index].allowed = (temp[index].allowed  === 1) ? 0 : 1;
        setNotiList(temp)
        setRows(rows + 1)
        console.log(notiList)
    }
    return (
        <Col sm="6" className="p-16">
            <div className="date-container p-16">
                <h4>Notifications</h4>
                <div className=" scrollbar-primary addgroup-dialog pt-16">
                    {notiList.map((gro, index) => {
                        return (
                            <div className="form-check mb-1" key={index}>
                                <label className="checkbox checkbox-primary">
                                    <input
                                        type="checkbox"
                                        onChange={()=>handlecheck(index)}
                                        id={`gridCheck${index}`}
                                        checked={gro.allowed === 1}
                                        value={gro.key}
                                    />
                                    <span htmlFor={`gridCheck${index}`}>{gro.description}</span>
                                    <span className="checkmark"></span>
                                </label>
                                {/*<input className="form-check-input" id={`gridCheck${index}`} type="checkbox" onChange={()=>handlecheck(index)} checked={gro.description === 1} />*/}
                                {/*<label className="form-check-label cursor-pointer ml-3" htmlFor={`gridCheck${index}`}>*/}
                                {/*    {gro.key}*/}
                                {/*</label>*/}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Col>
    );
}
