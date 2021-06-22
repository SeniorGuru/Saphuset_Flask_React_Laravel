import React, {Component, useEffect, Fragment, useState} from "react";
import Table from "../../../../Components/Table";
import {Accordion, AccordionCollapse, AccordionToggle, Card} from "react-bootstrap";
import './style.css'
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import ReactEcharts from "echarts-for-react";
import AddTeam from "../../../team/AddTeam";
const dSoftColumn = [
    {
        text: 'Component', dataField: 'component'
    },
    {
        text: 'Release', dataField: 'release',
    },
]

export default function ProgressRightTable({tableList, setSoftwareFlag, setSDetail, setSpList, setKDetail, setKernelFlag, kernList}) {

    const [searchVal, setSearchVal] = useState('')

    const handleSearch = (event) => {
        setSearchVal(event.target.value)
    }

    return (
        <div className="col-sm-9 pl-5">
            <div className="row justify-content-end">
                <div className="col-md-3 form-group mb-3">
                    <input className="form-control" type="text" placeholder="Search" name="searchValue"
                           value={searchVal} onChange={handleSearch}/>
                </div>
            </div>
            <Table keyField="id" table
                   className="right-table"
                   columns={[
                       {
                           text: 'Status', dataField: 'status', headerStyle: () => {
                               return {width: "5%"};
                           }
                       },
                       {
                           text: 'Group', dataField: 'group_name',
                       },
                       {
                           text: 'SID', dataField: 'sysnamelist',
                       },
                       {
                           text: 'Software UTD', dataField: 'NUMBER'
                       },
                       {text: 'Software Equal', dataField: 'TYPE'},
                       {text: 'Kernel UTD', dataField: 'PROCESS_ID'},
                       {text: 'Kernel Equal', dataField: 'PROCESS_STATE'},
                       {text: 'Approved SP', dataField: 'ON_HOLD_INFO'},
                       {text: 'Approved Kernel', dataField: 'WP_FAILUERS'},
                       {text: 'Display SP', dataField: 'CPU_TIME',
                           headerStyle: () => {
                               return {width: "5%"};
                           },
                           formatter: (cell, row) => {
                               return <div>
                                   <Button variant="info" className="btn-icon m-0 btn-sm text-capitalize" onClick={()=> {
                                       let softCol = [...dSoftColumn]
                                       row.sysList.map(val => {
                                           softCol.push( {
                                               text: val, dataField: val,
                                           })
                                       })
                                       softCol.push({
                                           text: 'New Release', dataField: 'new_release',
                                       })
                                       setSpList([...softCol])
                                       setSDetail(row.s_detail)
                                       setSoftwareFlag(true)
                                   }}>
                                       View
                                   </Button>
                               </div>;
                           }
                           },
                       {text: 'Display Kernel', dataField: 'TIME',
                           headerStyle: () => {
                               return {width: "5%"};
                           },
                           formatter: (cell, row) => {
                               return <div>
                                   <Button variant="info" className="btn-icon m-0 btn-sm text-capitalize" onClick={()=> {
                                       setKDetail( [...kernList.filter(list => row.sysList.findIndex(data=> data == list.MSSYSNAME)>=0)])
                                       setKernelFlag(true)
                                   }}>
                                       View
                                   </Button>
                               </div>;
                           }}
                   ]}
                   pagination={true}
                   data={
                       tableList
                   }
            />
        </div>
    );
}
