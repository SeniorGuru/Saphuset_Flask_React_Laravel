import React, {Component, useEffect, Fragment, useState} from "react";
import Table from "../../../../Components/Table";
import {Accordion, AccordionCollapse, AccordionToggle, Card} from "react-bootstrap";
import './style.css'
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ReactEcharts from "echarts-for-react";
import AddTeam from "../../../team/AddTeam";

export default function ProcessBottomTable({sysList, setChartValue, statusDefault, stateList}) {

    const [searchVal, setSearchVal] = useState('')


    const handleSearch = (event) => {
        setSearchVal(event.target.value)
    }
    return (
        <div className="p-2"
        >
            <div className="row justify-content-between">
                <div className="col-md-3 form-group mb-3">
                    <input className="form-control" type="text" placeholder="Search" name="searchValue"
                           value={searchVal} onChange={handleSearch}/>
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
                               if (row.status <= statusDefault[1]) {
                                   return <div className="rectangle"></div>;
                               } else if (row.status > statusDefault[1] && row.status <= statusDefault[2]) {
                                   return <div className="triangle"></div>;
                               } else {
                                   return <div className="circle"></div>;
                               }
                           }
                       },
                       {
                           text: 'SID', dataField: 'mssysname',
                       },
                       {
                           text: 'SERVER_NAME', dataField: 'SERVER_NAME',  headerStyle: () => {
                               return {width: "10%"};
                           }
                       },
                       {
                           text: 'NUMBER', dataField: 'NUMBER',  headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {text: 'TYPE', dataField: 'TYPE'},
                       {
                           text: 'User', dataField: 'UNAME', headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {text: 'PROCESS_ID', dataField: 'PROCESS_ID'},
                       {text: 'PROCESS_STATE', dataField: 'PROCESS_STATE'},
                       {text: 'ON_HOLD_INFO', dataField: 'ON_HOLD_INFO'},
                       {text: 'WP_FAILUERS', dataField: 'WP_FAILUERS'},
                       {text: 'CPU_TIME', dataField: 'CPU_TIME'},
                       {text: 'TIME', dataField: 'TIME'},
                       {text: 'WAIT_PRIORITY', dataField: 'WAIT_PRIORITY'},
                       {text: 'PROGRAM_NAME', dataField: 'PROGRAM_NAME'},
                       {text: 'CLIENT', dataField: 'CLIENT'},
                       {text: 'USER', dataField: 'USER'},
                       {text: 'PRIORITY', dataField: 'PRIORITY'},
                   ]}
                   pagination={true}
                   data={
                       sysList
                   }
            />
        </div>
    );
}
