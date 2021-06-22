import React, {Component, useEffect, useState} from "react";
import Table from "../../../../Components/Table";
import {Card} from "react-bootstrap";
import './style.css'
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ReactEcharts from "echarts-for-react";

export default function BottomTable({snapList, setChartValue, statusDefault, setApproved}) {

    const [searchVal, setSearchVal] = useState('')
    const [checkedList, setCheckedList] = useState([])

    console.log(snapList)
    // const [rows, setRows] = useState(0)

    const [show, setShow] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleClose = () => {
        setShow(false);
    };

    const saveApprove =()=> {
        setApproved(checkedList)
    }

    const handleSearch = (event) => {
        setSearchVal(event.target.value)
    }

    const setCheck = (row, list) => {
        let index = list.findIndex(ind => ind == row.id);
        if(index >= 0) list.splice(index, 1);
        else list.push(row.id);
        setCheckedList(list);
    }

    return (
        <div className="p-2"
        >
            <div className="row justify-content-between">
                <div className="col-md-3 form-group mb-3">
                    <input className="form-control" type="text" placeholder="Search" name="searchValue"
                           value={searchVal} onChange={handleSearch}/>
                </div>
                <div>
                    {
                        checkedList.length>0&&<Button
                            variant="primary"
                            onClick={saveApprove}
                        >
                            Save
                        </Button>
                    }
                </div>
            </div>
            <Table keyField="id" table
                   className="bottom-table"
                   columns={[
                       {
                           text: 'Status', dataField: 'status', headerStyle: () => {
                               return {width: "5%"};
                           },
                           formatter: (cell, row) => {
                               if (row.totalDays <= statusDefault[1]) {
                                   return <div className="rectangle"></div>;
                               } else if (row.totalDays > statusDefault[1] && row.totalDays <= statusDefault[2]) {
                                   return <div className="triangle"></div>;
                               } else {
                                   return <div className="circle"></div>;
                               }
                           }
                       },
                       {
                           text: 'SID', dataField: 'sid', headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {
                           text: 'Current Date', dataField: 'DATUM',  headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {
                           text: 'Time', dataField: 'UZEIT',  headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {text: 'Application Server', dataField: 'AHOST'},
                       {
                           text: 'User', dataField: 'UNAME', headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {text: 'Runtime Error', dataField: 'RUNTIME_ERROR'},
                       {text: 'Exception', dataField: 'EXCEPTION'},
                       {text: 'Terminated Program', dataField: 'TERMINATED_PROGRAM'},
                       {
                           text: 'Current Today', dataField: 'currentToday', headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {
                           text: 'Total(All Days)', dataField: 'totalDays', headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {
                           text: 'Details', dataField: 'details', headerStyle: () => {
                               return {width: "5%"};
                           },

                           formatter: (cell, row) => {
                               return <div>
                                   <Button variant="info" className="btn-icon m-0 btn-sm text-capitalize" onClick={()=> {setShow(true);setSelectedRow(row)}}>
                                       View
                                   </Button>
                               </div>;
                           }
                       },
                       {
                           text: 'Approved', dataField: 'approved', headerStyle: () => {
                               return {width: "5%"};
                           }, formatExtraData: checkedList, formatter: (cell, row, rowIndex, formatExtraData) => {
                               return <label className="checkbox checkbox-primary">
                                   <input
                                       type="checkbox"
                                       id="rtl-checkbox"
                                       checked={formatExtraData.findIndex(ind => ind == row.id) >= 0}
                                       onChange={() => {
                                           setCheck(row, [...formatExtraData]);
                                       }}
                                   />
                                   <span></span>
                                   <span className="checkmark"></span>
                               </label>;
                           }
                       },
                   ]}
                   pagination={true}
                   data={
                       snapList.filter(list => searchVal === "" || list.AHOST.toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.RUNTIME_ERROR.toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.sid.toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.DATUM.toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.UZEIT.toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.UNAME.toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.currentToday.toString().toLowerCase().search(searchVal.toLowerCase()) >= 0 || list.totalDays.toString().toLowerCase().search(searchVal.toLowerCase()) >= 0 ||
                           list.TERMINATED_PROGRAM.toLowerCase().search(searchVal.toLowerCase()) >= 0
                       )
                   }
            />
            <Modal show={show} onHide={handleClose} size={'lg'} centered={true} >
                <Modal.Header closeButton>
                    <Modal.Title>Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>Short Text</h3>
                    <div style={{marginBottom:20}}>{selectedRow?selectedRow.short_text:""}</div>
                    <h3>What happened?</h3>
                    <div>{selectedRow?selectedRow.what_happened:""}</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
