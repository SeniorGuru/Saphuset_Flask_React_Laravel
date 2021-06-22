import {
    Container,
    Row,
    Col, Form, Badge,

} from "react-bootstrap";

import './style.css';
import React, {useState} from "react";
import Table from "../../../Components/Table";

export default function SetupNotification({setupData_list, moduleNotification_list, setModuleCheckId, setallcheck}) {

    const [moduleId, setModuleId] = useState(0);
    const [groupId, setGroupId] = useState(0);
    const [instanceId, setInstanceId] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    const handelModuleId =(e) => {
        setModuleId(e.target.value)
    }

    const handelGroupId =(e) => {
        console.log(e.target.value)
        setGroupId(e.target.value)
    }
    const handelInstanceId =(e) => {
        setInstanceId(e.target.value)
    }

    const handleSearch = (e) => {
        setSearchValue(e.target.value)
    }

    const editCheck = (ids, cell ,row) => {
        setModuleCheckId(ids, row, cell===1 ? 0 : 1)
    }

    const setIds = () => {
        setModuleId(0);
        setGroupId(0);
        setInstanceId(0);
    }

    const setAll = (type) => {
        setallcheck(type, noti_filter.filter(list=> searchValue === "" || list.mssysname.toLowerCase().search(searchValue.toLowerCase()) >= 0))
        console.log(noti_filter.filter(list=> searchValue === "" || list.mssysname.toLowerCase().search(searchValue.toLowerCase()) >= 0))
    }

    let noti_filter =(moduleId === 0 && groupId===0 && instanceId===0) ? moduleNotification_list
        :
        moduleNotification_list.filter(list => (instanceId === 0? true: list.mssysname === instanceId) && (moduleId === 0? true: list.module === moduleId) && (groupId === 0? true: (list.group_id.split(',').findIndex(list=> list== groupId )) >= 0 ?true: false) )

    return (
        <div className="p-16 setup-container" >
            <div className="row filter-menu p-16">
                <Form.Group as={Col} md="3" controlId="exampleForm.SelectCustom" >
                    <select className="form-control" onChange={handelModuleId} value={moduleId}>
                        <option key="0" value="0" disabled={true} onChange={handelModuleId}>Select Module</option>
                        { setupData_list.module_list && setupData_list.module_list.map(value => <option key={value.module_id} value={value.module_id}>{value.module_name}</option>) }
                    </select>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="exampleForm.SelectCustom" >
                    <select className="form-control" onChange={handelGroupId} value={groupId} >
                        <option key="0" value="0" disabled={true} >Select Group</option>
                        { setupData_list.group_list && setupData_list.group_list.map(value => <option key={value.group_id} value={value.group_id}>{value.group_name}</option>) }
                    </select>
                </Form.Group>
                <Form.Group as={Col} md="3" controlId="exampleForm.SelectCustom" >
                    <select className="form-control" onChange={handelInstanceId} value={instanceId} >
                        <option key="0" value="0" disabled={true} >Select SAP Systems</option>
                        { setupData_list.instance_list && setupData_list.instance_list.map(value => <option key={value.mssysname} value={value.mssysname}>{value.mssysname}</option>) }
                    </select>
                </Form.Group>
                <button className="btn btn-primary btn-sm mb-3 ml-3" style={{fontSize: "16px"}} onClick={setIds}>
                    Clear
                </button>
            </div>
            <div className="row mt-3">
                <div className="col-md-6 form-group mb-3">
                    <input className="form-control" type="text" placeholder="Search" onChange={handleSearch} name="searchValue" />
                </div>
                <button className="btn btn-primary btn-sm mb-3 ml-3" style={{fontSize: "16px"}} onClick={()=> setAll(1)}>
                    Activate All
                </button>
                <button className="btn btn-primary btn-sm mb-3 ml-3" style={{fontSize: "16px"}} onClick={()=> setAll(0)}>
                    De-Activate All
                </button>
            </div>
            <div className="setup-table">
                <Table keyField="id" table
                       columns ={[
                           { text: 'Systems', width: '25%', dataField: 'mssysname', sort:true},
                           { text: 'SMS', width: '25%', dataField: 'sms' , formatter: (cell, row) => {
                                   return <label className="switch">
                                       <input type="checkbox" key={row.id} checked={cell === 1} onChange={()=> editCheck(0,cell, row)}/>
                                       <span className="slider round"></span>
                                   </label>;
                               }},
                           { text: 'Email', width: '25%', dataField: 'email' , formatter: (cell, row) => {
                                   return <label className="switch">
                                       <input type="checkbox" key={row.id} checked={cell === 1} onChange={()=> editCheck(1, cell ,row)}/>
                                       <span className="slider round"></span>
                                   </label>;
                               }},
                           { text: 'PDF Report', width: '25%', dataField: 'pdf_report', formatter: (cell, row) => {
                                   return <label className="switch">
                                       <input type="checkbox" key={row.id} checked={cell === 1} onChange={()=> editCheck(2,cell, row)}/>
                                       <span className="slider round"></span>
                                   </label>;
                               } },
                       ]}
                       pagination={true}
                       data = {
                           noti_filter.filter(list=> searchValue === "" || list.mssysname.toLowerCase().search(searchValue.toLowerCase()) >= 0)
                       }
                />
            </div>
        </div>
    );
}
