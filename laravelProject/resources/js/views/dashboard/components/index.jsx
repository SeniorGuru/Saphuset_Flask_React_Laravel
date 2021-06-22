import {
    Container,
    Row,
    Col, Form, Badge, FormControl, Card, Button, ProgressBar,

} from "react-bootstrap";
import './style.css'
import React, {Suspense, useEffect, useState} from "react";
import RightSetting from "./rightsetting";
import Axios from "axios";
import ProgressBars from "./progressbar";
import ProgressRightTable from "./righttable";
import SoftwareDetail from "./softwaredetail";
import KernelDetail from "./kerneldetail";

export default function Components({index, setTabsBadge}) {
    const [groups, setGroups] = useState([]);
    const [rows, setRows] = useState(0)
    const [groupId, setGroupId] = useState(0)
    const [statusId, setStatusId] = useState(0)
    const [sysId, setSysId] = useState(0)
    const [statusDefault, setStatusDefault] = useState([0, 5, 7, 10])
    const [stateList, setStateList] = useState([])
    const [sysList, setSysList] = useState([])
    const [tableList, setTableList] = useState([])
    const [softwareFlag, setSoftwareFlag] = useState(false)
    const [KernelFlag, setKernelFlag] = useState(false)
    const [sDetail, setSDetail] = useState([])
    const [kDetail, setKDetail] = useState([])
    const [spList, setSpList] = useState([])
    const [kernList, setKernList] = useState([])


    const ClearFilter = () => {
        setGroupId(0)
        setStatusId(0)
        setSysId(0)
    }


    const handelStatus = (event) => {
        setStatusId(event.target.value)
    }

    const handelGroupId = (event) => {
        setGroupId(event.target.value)
    }

    const handleSysId = (event) => {
        setSysId(event.target.value)
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


    const getComponents = async () => {

        let response = await Axios.get("/api/q/rest?api=SystemMonitor@component@getComponents");

        console.log( 'Components', response.data.response.message)
        let temp_value = [0, 0, 0, 0]
        let t_type = ['SUCCESS_COMPONENTS', 'WARNING_COMPONENTS', 'ERROR_COMPONENTS']
        t_type.map((val, index) => {
            let inx = response.data.response.message.conf_list.findIndex(list => list.status_type == val)
            temp_value[index + 1] = response.data.response.message.conf_list[inx].count
        })
        setStatusDefault(temp_value)
        setKernList([...response.data.response.message.kerns_list])
        setSysList(response.data.response.message.sys_list)
        setStateList(response.data.response.message.state_list)
        setGroups([...response.data.response.message.group_list])
        setTableList([...response.data.response.message.table_list])
        setKernList([...response.data.response.message.kerns_list])

    }

    useEffect(() => {
        getComponents();
    }, []);


    return (
        <Suspense>
            {(!softwareFlag && !KernelFlag)&&<div className="p-16">
                {/*<div className="row dump-menu p-16 mb-2 justify-content-between">*/}
                {/*    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">*/}
                {/*        <select className="form-control" onChange={handelGroupId} value={groupId}>*/}
                {/*            <option key="0" value="0" disabled={true}>Select Group</option>*/}
                {/*            {*/}
                {/*                groups.map(list => <option key={list.group_id}*/}
                {/*                                           value={list.group_id}>{list.group_name}</option>)*/}
                {/*            }*/}
                {/*        </select>*/}
                {/*    </Form.Group>*/}
                {/*    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">*/}
                {/*        <select className="form-control" onChange={handelStatus} value={statusId}>*/}
                {/*            <option key="0" value="0" disabled={true}>Select Status</option>*/}
                {/*            <option key="1" value="1">Green</option>*/}
                {/*            <option key="2" value="2">Yellow</option>*/}
                {/*            <option key="3" value="3">Red</option>*/}
                {/*        </select>*/}
                {/*    </Form.Group>*/}
                {/*    <Form.Group as={Col} md="2" controlId="exampleForm.SelectCustom">*/}
                {/*        <select className="form-control" onChange={handleSysId} value={sysId}>*/}
                {/*            <option key="0" value="0" disabled={true}>Select Server Name</option>*/}
                {/*            {*/}
                {/*                sysList.map(list => <option key={list.mssysname}*/}
                {/*                                            value={list.mssysname}>{list.mssysname}</option>)*/}
                {/*            }*/}
                {/*        </select>*/}
                {/*    </Form.Group>*/}
                {/*    <div className="col-md-2 d-flex justify-content-between">*/}
                {/*        <button className="btn btn-primary btn-sm mb-3 ml-3" style={{fontSize: "16px"}}*/}
                {/*                onClick={ClearFilter}>*/}
                {/*            Clear*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row m-0 p-0">
                    <ProgressBars/>
                    <ProgressRightTable tableList={tableList} setSoftwareFlag={setSoftwareFlag} setSDetail={setSDetail} setSpList={setSpList} setKDetail={setKDetail} setKernelFlag={setKernelFlag} kernList={kernList}/>
                </div>
            </div>}
            {softwareFlag && <SoftwareDetail setSoftwareFlag={setSoftwareFlag} sDetail={sDetail} spList={spList}/>}
            {KernelFlag && <KernelDetail setKernelFlag={setKernelFlag} kDetail={kDetail} />}
            <RightSetting statusDefault={statusDefault} setConfig={setConfig}/>
        </Suspense>
    );
}
