import React, {Component, useState} from 'react'
import {Col, Form, Row} from "react-bootstrap";
import WorkingDate from "../WorkingDate";
import NotificationList from "../NotificationList";

export default class Notification extends Component{

    constructor(props) {
        super(props);
        this.state={
            editFlag: props.editFlag,
            module_list: props.module_list,
            day_list: [],
            from_time:'',
            to_time: '',
            notif_list:[],
            real_list:[],
            notification_list: props.notification_list,
        }
        this.handleModuleId = this.handleModuleId.bind(this)
        this.setFromTime = this.setFromTime.bind(this)
        this.setToTime = this.setToTime.bind(this)
        this.setDayList = this.setDayList.bind(this)
        this.setNotiList = this.setNotiList.bind(this)
        this.saveValue = this.saveValue.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.module_list !== this.state.module_list || nextProps.notification_list !== this.state.notification_list) {
            this.setState({
                module_list: nextProps.module_list,
            });
        }
    }
    setFromTime(time){
        this.setState({from_time:time})
    }
    setToTime(time){
        this.setState({to_time:time})
    }
    setDayList(lists){
        this.setState({day_list: lists})
    }
    setNotiList(lists){
        this.setState({notif_list: lists})
    }
    handleModuleId(e) {
        this.props.setEditFlag(this.props.editFlag, e.target.value);
    }
    saveValue() {
        this.props.setEditFlag(false, this.state.module_list[0].module_id);
        this.props.setNotification(this.props.moduleId, this.state.from_time, this.state.to_time, this.state.day_list,this.state.notif_list )
    }
    render(){
        let index = this.props.moduleTime_list.findIndex(val=>val.module===this.props.moduleId)
        let index2 = this.props.moduleDate_list.findIndex(val=> val.module === this.props.moduleId)

        return (
            <Col className="p-16">
                <h5>Module</h5>
                <Row>
                    <Form.Group as={Col} md="3" sm="4" controlId="exampleForm.SelectCustom" >
                        <select className="form-control" onChange={this.handleModuleId} value={this.props.moduleId}>
                            { this.state.module_list.map(value => <option key={value.module_id} value={value.module_id}>{value.module_name}</option>) }
                        </select>
                    </Form.Group>
                </Row>
                <Row>
                    <WorkingDate moduleTime_list={this.props.moduleTime_list[index]} moduleDate_list={this.props.moduleDate_list[index2]} editflag = {this.props.editFlag}
                        setFromTimes={this.setFromTime} setToTimes={this.setToTime}  setDayLists={this.setDayList}
                    />
                    <NotificationList notification_list={this.props.notification_list} module = {this.props.moduleId} editflag = {this.props.editFlag} setNotiLists = {this.setNotiList}/>
                </Row>
                <div className="row pr-16 pl-16 float-right">
                    {
                        this.props.editFlag&&<button className="btn btn-success btn-sm mt-3 mr-3" onClick={this.saveValue} style={{fontSize: "16px"}}>&nbsp;Save&nbsp;
                        </button>
                    }
                    {
                        !this.props.editFlag&&<button type="submit" className="btn btn-primary btn-sm mt-3" style={{fontSize: "16px"}}
                                                      onClick={() => {
                                                          this.props.setEditFlag(true, this.props.moduleId);
                                                      }}>&nbsp;Edit&nbsp;
                        </button>}
                    {this.props.editFlag && <button type="submit" className="btn btn-danger btn-sm mt-3"
                                                    style={{fontSize: "16px"}} onClick={()=>{
                        // this.setState({editFlag: !this.props.editFlag})
                        this.props.setEditFlag(false, this.props.moduleId);
                    }}>&nbsp;Cancel&nbsp;
                    </button>}
                </div>
            </Col>
        )
    }


}
