import React, {Component} from 'react';
import {
    Container,
    Row,
    Col,
    Tab,
    Tabs,
    Button,
    TabContent,
    Nav, Badge,

} from "react-bootstrap";

import './style.css';
import Detail from "./Detail";
import Notification from "./Notification";
import Axios from "axios";
import SetupNotification from "./SetupNotification";

function formatTime(time){
    let tmp = time.split(":");
    let h = parseInt(tmp[0]);
    let m = parseInt(tmp[1]);
    if (h < 10) h = "0" + h;
    if (m < 10) m = "0" + m;
    return h+":"+m+":"+"00";
}

export default class UserComplianceSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            details: [],
            module_list:[],
            moduleTime_list:[],
            moduleDate_list:[],
            notification_list: [],
            editFlag: false,
            moduleId: '',
            setupData_list: [],
            moduleNotification_list: []
        }
        this.setSettingDetail = this.setSettingDetail.bind(this);
        this.setNotification = this.setNotification.bind(this);
        this.setEditFlag = this.setEditFlag.bind(this);
        this.setModuleCheckId = this.setModuleCheckId.bind(this);
        this.setallcheck = this.setallcheck.bind(this);
    }
    componentDidMount() {
        this.getSettingData();
        this.getNotificationData();
        this.getSetupData();
        this.getModuleNotificationList();
    }
    async getNotificationData() {
        loaderToggle(true);
        let response = await Axios.get("/api/q/rest?api=Setting@notification@getModule");
        this.setState({
            module_list: response.data.response.message.module_list,
            moduleId: response.data.response.message.module_list[0].module_id
        });
        response = await Axios.get("/api/q/rest?api=Setting@notification@getModuleTime");
        this.setState({ moduleTime_list: response.data.response.message.moduleTime_list })
        console.log(this.state.moduleTime_list)
        response = await Axios.get("/api/q/rest?api=Setting@notification@getModuleDate");
        this.setState({ moduleDate_list: response.data.response.message.moduleDate_list })
        console.log(this.state.moduleDate_list)
        response = await Axios.get("/api/q/rest?api=Setting@notification@getNotificationList");
        this.setState({ notification_list: response.data.response.message.notification_list })
        console.log(this.state.notification_list)
        loaderToggle(false);
    }
    async getSettingData() {
        loaderToggle(true);
        let response = await Axios.get("/api/q/rest?api=Setting@detail@getDetail");
        this.setState({ details: response.data.response.message.details })
        loaderToggle(false);
    }
    async getSetupData() {
        let response = await Axios.get("/api/q/rest?api=Setting@setup@getSetupData");
        this.setState({ setupData_list: response.data.response.message })
        console.log(this.state.setupData_list)
    }
    async getModuleNotificationList() {
        let response = await Axios.get("/api/q/rest?api=Setting@setup@getModuleNotifications");
        this.setState({ moduleNotification_list: response.data.response.message.module_noti_list })
        console.log(this.state.moduleNotification_list)
    }
    async setSettingDetail(name, email, password, phone, address, company) {
        try {
            const data = {
                name: name,
                email: email,
                password: password,
                phone: phone,
                address: address,
                company: company
            };
            console.log(data)
            await Axios.post("/api/q/rest?api=Setting@detail@setDetail", { data});
            toastr.success('Succeeded', "Success", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
            this.getSettingData();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }
    async setNotification(id, from_time, to_time, days, notifies) {
        try {
            const data = {
                id: id,
                from_time: formatTime(from_time),
                to_time: formatTime(to_time) ,
                days: days,
                notifies: notifies,
            };
            console.log(data)
            await Axios.post("/api/q/rest?api=Setting@notification@setNotification", { data});
            toastr.success('Succeeded', "Success", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
            this.getNotificationData();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }
    async setModuleCheckId(type, row, value) {
        try {
            const data = {
                type: type,
                module: row.module,
                mssysname: row.mssysname,
                value: value
            };
            console.log(data)
            await Axios.post("/api/q/rest?api=Setting@setup@setModuleCheckId", { data});
            // toastr.success('Succeeded', "Success", {
            //     showMethod: "slideDown",
            //     hideMethod: "slideUp",
            //     timeOut: 4000
            // });
            this.getModuleNotificationList();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }

    setEditFlag(flag, moduleId){
        this.setState({
            editFlag: flag,
            moduleId: (moduleId == ""? this.state.moduleId : moduleId)
        });
    }

    async setallcheck(type, filterData) {
        try {
            const data = {
                type: type,
                filterData: filterData,
            };
            console.log(data)
            await Axios.post("/api/q/rest?api=Setting@setup@setallcheck", { data});
            // toastr.success('Succeeded', "Success", {
            //     showMethod: "slideDown",
            //     hideMethod: "slideUp",
            //     timeOut: 4000
            // });
            this.getModuleNotificationList();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }


    render() {
        return (
            <Container fluid className="main-content p-16">
                <div className="breadcrumb p-10">
                    <h1>Settings</h1>
                </div>
                <div className="separator-breadcrumb border-top"/>
                <section className="contact-list">
                    <Tabs defaultActiveKey="setupnotification" id="uncontrolled-tab-example">
                        <Tab eventKey="details" title="Details">
                            <Detail details={this.state.details} setDetail = {this.setSettingDetail} setEditFlag = {this.setEditFlag} editFlag = {this.state.editFlag} />
                        </Tab>
                        <Tab eventKey="notifications" title="Notifications">
                            <Notification module_list = {this.state.module_list} moduleTime_list={this.state.moduleTime_list} moduleDate_list={this.state.moduleDate_list}
                                          notification_list = {this.state.notification_list} setNotification ={this.setNotification} setEditFlag = {this.setEditFlag} editFlag = {this.state.editFlag} setModuleId = {this.setModuleId} moduleId = {this.state.moduleId}
                            />
                        </Tab>
                        <Tab title="Setup Notifications" eventKey="setupnotification">
                            <SetupNotification setupData_list={this.state.setupData_list} moduleNotification_list={ this.state.moduleNotification_list} setModuleCheckId = {this.setModuleCheckId} setallcheck={this.setallcheck}/>
                        </Tab>
                    </Tabs>
                </section>
            </Container >
        );
    }
}
