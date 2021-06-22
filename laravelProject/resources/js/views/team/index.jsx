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
import Table from "./Table";
import Axios from "axios";
import AddTeam from "./AddTeam";

export default class UserComplianceTeam extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selTeamList: [],
            FunctionAreaList:[],
            search: "",
            showAddFlag: false,
            showEditFlag: false,
            leadUsers:[]
        }
        // this.getTeamList = this.getTeamList.bind(this);
        this.addTeam = this.addTeam.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
    }
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    showAddTeam(){
        this.setState({
            showAddFlag: !this.state.showAddFlag
        })
    }
    componentDidMount() {
        this.getTeamList();
        this.getUsers();
        this.handleChange = this.handleChange.bind(this);
        this.showAddTeam = this.showAddTeam.bind(this);
    }
    async getTeamList() {
        loaderToggle(true);
        let response = await Axios.get("/api/q/rest?api=Module@team@getAllTeam");
        this.setState({ selTeamList: response.data.response.message.team_list })
        response = await Axios.get("/api/q/rest?api=Module@team@getAllFunction");
        this.setState({ FunctionAreaList: response.data.response.message.function_list })
        loaderToggle(false);
    }
    async getUsers() {
        let response = await Axios.get("/api/q/rest?api=Module@team@getLeadUsers");
        this.setState({ leadUsers: response.data.response.message.user_list })
    }
    async addTeam(id, name, description, functionData, editflag, teamId ) {
        try {
            const data = {
                lead_id: id,
                team_name: name,
                team_description: description,
                functionArea: functionData
            };
            console.log(data)
            if(editflag){
                data.team_id = teamId;
                await Axios.post("/api/q/rest?api=Module@team@editTeam", { data});
            } else {
                await Axios.post("/api/q/rest?api=Module@team@addTeam", { data});
            }
            toastr.success('Succeeded', "Success", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
            this.getTeamList();
        } catch (err) {
            console.error(err);
            toastr.error("Failed", "Error", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
        }
    }
    async deleteTeam(team_id, lead_id) {
        try {
            const data = {
                team_id: team_id,
                lead_id: lead_id
            };
            await Axios.post("/api/q/rest?api=Module@team@deleteTeam", { data});
            toastr.success('Succeeded', "Success", {
                showMethod: "slideDown",
                hideMethod: "slideUp",
                timeOut: 4000
            });
            this.getTeamList();
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
            <Container fluid className="main-content p-10">
                <div className="breadcrumb p-10">
                    <h1>Teams</h1>
                </div>
                <div className="separator-breadcrumb border-top"/>
                <section className="contact-list">
                    <div className="team-table-container table-style">
                        <Row>
                            <div className="col-md-6 pl-30 form-group mb-3">
                                <input className="form-control form-control-rounded" type="text" placeholder="Search" onChange={this.handleChange} name="search" />
                            </div>
                            <div className="col-md-6 pr-30 form-group text-right">
                                <button className="btn btn-primary  mr-3" onClick={this.showAddTeam} ><i className="i-Add text-white mr-2"></i>Team</button>
                                <AddTeam editflag = {false} leadUsers = {this.state.leadUsers} showFlag={this.state.showAddFlag} handleClose={this.showAddTeam} addTeam = {this.addTeam}/>
                            </div>
                        </Row>
                        <div className="tab-content" id="myTabContent">
                            <Table
                                FunctionAreaList = {this.state.FunctionAreaList}
                                selTeamList = {this.state.selTeamList}
                                leadUsers = {this.state.leadUsers} addTeam = {this.addTeam} deleteTeam = {this.deleteTeam}
                                column={[
                                    { title: 'Name', width: '25%', dataIndex: 'team_name' },
                                    { title: 'Team Lead', width: '25%', dataIndex: 'lead_name', render:(value, data) => {
                                            return <div
                                                className="d-flex align-items-center contact online"
                                            >
                                                <img
                                                    src={data.lead_avatar}
                                                    className="avatar-sm rounded-circle mr-3"
                                                    alt=""
                                                />
                                                <h6 className="">{value}</h6>
                                            </div>
                                        } },
                                    {
                                        title: 'Functional Areas', width: '20%', dataIndex: 'functions', render: (value) => {
                                            return this.state.FunctionAreaList.filter(gros => {
                                                return value.filter(sel => sel == gros.function_id).length > 0
                                            }).map(val => <Badge key={val.function_id} className={`badge-pill badge-primary m-1`} style={{ fontSize: "14px", background:val.color_code}} >{val.function_name}</Badge>)
                                        }
                                    },
                                    { title: 'Description', width: '25%', dataIndex: 'team_description' }
                                ]}
                                data={this.state.selTeamList.filter(list => this.state.search === "" || list.team_name.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.lead_name.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.team_description.toLowerCase().search(this.state.search.toLowerCase()) >= 0)}
                            />
                        </div>
                    </div>
                </section>
            </Container >
        );
    }
}
