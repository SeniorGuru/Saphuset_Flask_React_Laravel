import Axios from 'axios';
import React, { Component } from 'react';
import {Badge, OverlayTrigger, Popover, Row, Tab, Tabs} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import AddGroupModal from './components/AddGroupModal';
import AddModal from './components/AddModal';
import Table from './components/Table';
import GroupList from './groupList';
import './style.css';
import Detail from "../settting/Detail";
import Notification from "../settting/Notification";
import SetupNotification from "../settting/SetupNotification";

export default class Example extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: "",
      showCreate: false,
      showAddGroup: false,
      showAddToGroup: false,
      group: [],
      groupName: "",
      groupDescription: "",
      selGroupList: [],
      grouper: [],
      groupedSystem: [],
      selectedGroup: [],
      selected: {},
      editing: false,
      editId: "",
      search: "",
      activeGroup: ''
    }
  }

  async componentDidMount() {
    let response = await Axios.get("/api/q/rest?api=Module@group@hello");
    this.setState({ message: response.data.response.message })
    this.getAllGroup();
    this.getAllGrouper();
    this.getGroupedSystem();
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.getSelectedGroup = this.getSelectedGroup.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.setShowCreate = this.setShowCreate.bind(this);
    this.setEditState = this.setEditState.bind(this);
    this.addGrouper = this.addGrouper.bind(this);
    this.setShowAddGroup = this.setShowAddGroup.bind(this);
    this.setShowAddToGroup = this.setShowAddToGroup.bind(this);
    this.popover = this.popover.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async getAllGroup() {
    loaderToggle(true);
    let response = await Axios.get("/api/q/rest?api=Module@group@getAllGroup");
    const { group_list } = response.data.response.message;
    if (group_list.length > 0) this.getSelectedGroup(group_list[0].group_id, {}, false);
    this.setState({ group: group_list })
    loaderToggle(false);
  }

  async getAllGrouper() {
    let response = await Axios.get("/api/q/rest?api=Module@group@getAllGrouper");
    this.setState({ grouper: response.data.response.message.group_list })
  }

  async getSelectedGroup(id, sel = {}, flag = true) {
    if (this.state.editing && flag) {
      this.setShowCreate(true, sel);
    } else {
      const data = {
        group_id: id,
      };
      let response = await Axios.post("/api/q/rest?api=Module@group@getSelectedGroup", { data });

      this.setState({ selGroupList: response.data.response.message.group_list, activeGroup: id });
    }
  }

  async addGroup() {
    try {
      const data = {
        group_name: this.state.groupName,
        group_description: this.state.groupDescription,
      };
      if (this.state.editing) {
        data.group_id = this.state.editId;
        await Axios.post("/api/q/rest?api=Module@group@editGroup", { data });
      } else {
        await Axios.post("/api/q/rest?api=Module@group@addGroup", { data });
      }
      toastr.success('Succeeded', "Success", {
        showMethod: "slideDown",
        hideMethod: "slideUp",
        timeOut: 4000
      });
      this.getAllGroup();
    } catch (err) {
      toastr.error("Failed", "Error", {
        showMethod: "slideDown",
        hideMethod: "slideUp",
        timeOut: 4000
      });
    }
    this.setState({ showCreate: false });
  }

  async deleteGroup(id) {
    const data = {
      group_id: id,
    };
    await Axios.post("/api/q/rest?api=Module@group@deleteGroup", { data });
    this.getAllGroup();
    this.getAllGrouper();
    this.setState({ selGroupList: [] });
  }

  async getGroupedSystem() {
    let response = await Axios.get("/api/q/rest?api=Module@group@getGroupedSystem");
    this.setState({ groupedSystem: response.data.response.message.group_list });
  }

  setShowCreate(flag, sel = {}) {
    if (this.state.editing) {
      this.setState({ groupName: sel.group_name, groupDescription: sel.group_description, editId: sel.group_id });
    } else {
      this.setState({ groupName: "", groupDescription: "" });
    }
    this.setState({ showCreate: flag });
  };

  setEditState(editing = false) {
    this.setState({ editing });
  }

  setShowAddGroup(flag, sel = [], gro = {}) {
    console.log(flag, sel, gro)
    this.setState({ showAddGroup: flag, selectedGroup: sel, selected: gro });
  };

  setShowAddToGroup(flag) {
    this.setState({ showAddToGroup: flag });
  };

  getGroupSystem(flag = false) {
    if (!flag)
      return this.state.groupedSystem.filter(groSys => {
        return this.state.grouper.filter(gro => gro.mssysname === groSys.mssysname && gro.mandt === groSys.mandt).length === 0
      })
    return this.state.grouper;
  }

  handleCheck(e) {
    const { checked, name } = e.target;
    let selectedGroup = this.state.selectedGroup.filter(sel => sel != name);
    if (checked) {
      selectedGroup.push(name);
    }
    this.setState({ selectedGroup });
  }

  async addGrouper() {
    if (this.state.selectedGroup.length > 0) {
      const data = {
        group: this.state.selected,
        selected: this.state.selectedGroup
      };
      await Axios.post("/api/q/rest?api=Module@group@addGrouper", { data });
      this.getAllGrouper();
      this.setShowAddGroup(false);
    }
  }
   popover () {
       return <Popover id="popover-basic" hidden={!this.state.showAddGroup}>
           <Popover.Title as="h3">Add a Group</Popover.Title>
           <Popover.Content>
               <AddGroupModal {...this.state} handleCheck={this.handleCheck} addGrouper={this.addGrouper} setShowAddGroup={this.setShowAddGroup} />
               <div className="pop-button-container pr-2">
                   <button className="btn btn-success btn-sm float-right" onClick={() => this.addGrouper()}>Add Group</button>
                   {/*<button className="btn btn-secondary  btn-sm float-right mr-12" onClick={() => setShowAddGroup(false)}>Cancel</button>*/}
               </div>
           </Popover.Content>

       </Popover>;
   };

  render() {
    return (
      <div className="main-content p-10">
        <div className="breadcrumb p-10">
          <h1>Groups</h1>
        </div>
        <div className="separator-breadcrumb border-top"></div>
        <section className="contact-list">
            <div className="copied-structure-100 position-relative">
                {(this.state.showCreate) && <div className="overlay-dialog">
                </div>}
                {this.state.showCreate && <AddModal {...this.state} handleChange={this.handleChange} setShowCreate={this.setShowCreate} addGroup={this.addGroup} />}

                {/*{this.state.showAddGroup && <AddGroupModal {...this.state} handleCheck={this.handleCheck} addGrouper={this.addGrouper} setShowAddGroup={this.setShowAddGroup} />}*/}
                <GroupList {...this.state} setShowCreate={this.setShowCreate} getSelectedGroup={this.getSelectedGroup} deleteGroup={this.deleteGroup} setEditState={this.setEditState}/>
                <div className="actual-table-container table-style float-left">
                    <Row>
                        <div className="col-md-5 pl-30 form-group mb-3">
                            <input className="form-control form-control-rounded" type="text" placeholder="Search" onChange={this.handleChange} name="search" />
                        </div>
                    </Row>
                    <Tabs defaultActiveKey="assign" id="uncontrolled-tab-example">
                        <Tab eventKey="assign" title="Assigned Systems">
                            <div className="tab-pane fade show active" id="listBasic" role="tabpanel" aria-labelledby="list-basic-tab">
                                <Table
                                    column={[
                                        { title: 'SID', width: '20%', dataIndex: 'mssysname' },
                                        { title: 'Description', width: '40%', dataIndex: 'description' },
                                        { title: 'Clients', width: '40%', dataIndex: 'mandt' },
                                    ]}
                                    data={this.state.selGroupList.filter(list => this.state.search === "" || list.mssysname.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.description.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.mandt.toLowerCase().search(this.state.search.toLowerCase()) >= 0)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="group" title="Grouped Systems">
                            <div className="tab-pane fade show" id="homeBasic" role="tabpanel" aria-labelledby="home-basic-tab">
                                <Table
                                    column={[
                                        { title: 'Count', width: '20%', dataIndex: 'count' },
                                        { title: 'SID', width: '20%', dataIndex: 'mssysname' },
                                        { title: 'Clients', width: '20%', dataIndex: 'mandt' },
                                        {
                                            title: 'Groups', width: '20%', dataIndex: 'selectGroup', render: (value) => {
                                                return this.state.group.filter(gros => {
                                                    return value.filter(sel => sel == gros.group_id).length > 0
                                                }).map(val => <Badge key={val.group_id} className={`badge-pill badge-primary m-1`} style={{ fontSize: "14px" }} >{val.group_name}</Badge>)
                                            }
                                        },
                                        {
                                            title: '', width: '20%', dataIndex: '', render: (value, list) => {

                                                return  <OverlayTrigger trigger="click" placement="top" overlay={this.popover()} rootClose >
                                                    <button className="btn btn-primary btn-sm" onClick={() => this.setShowAddGroup(true, list.selectGroup, list)}>Add to group</button>
                                                </OverlayTrigger>
                                            }
                                        },
                                    ]}
                                    data={this.getGroupSystem(true).filter(list => this.state.search === "" || list.mssysname.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.mandt.toLowerCase().search(this.state.search.toLowerCase()) >= 0)}
                                />
                            </div>
                        </Tab>
                        <Tab eventKey="nongroup" title="Non Grouped Systems">
                            <div className="tab-pane fade" id="profileBasic" role="tabpanel" aria-labelledby="profile-basic-tab">
                                <table className="table ntable-stye">
                                    <thead>
                                    <tr>
                                        <th width="30%">SID </th>
                                        <th width="30%">Clients</th>
                                        <th width="20%"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="tbody-container">
                                    {this.getGroupSystem().filter(list => this.state.search === "" || list.mssysname.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.mandt.toLowerCase().search(this.state.search.toLowerCase()) >= 0).map((gro, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{gro.mssysname}</td>
                                                <td>{gro.mandt}</td>
                                                <td>
                                                    <OverlayTrigger trigger="click" placement="top" overlay={this.popover()} rootClose >
                                                        <button className="btn btn-primary btn-sm" onClick={() => this.setShowAddGroup(true, [], gro)}>Add to group</button>
                                                    </OverlayTrigger>
                                                    </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                <Table
                                    column={[
                                        { title: 'SID', width: '20%', dataIndex: 'mssysname' },
                                        { title: 'Clients', width: '30%', dataIndex: 'mandt' },
                                        {
                                            title: '', width: '30%', dataIndex: '', render: (value, list) => {

                                                return <OverlayTrigger trigger="click" placement="top" overlay={this.popover()} rootClose >
                                                    <button className="btn btn-primary btn-sm" onClick={() => this.setShowAddGroup(true, list.selectGroup, list)}>Add to group</button>
                                                </OverlayTrigger>
                                            }
                                        },
                                    ]}
                                    data={this.getGroupSystem().filter(list => this.state.search === "" || list.mssysname.toLowerCase().search(this.state.search.toLowerCase()) >= 0 || list.mandt.toLowerCase().search(this.state.search.toLowerCase()) >= 0)}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </section>
      </div >
    );
  }
}

