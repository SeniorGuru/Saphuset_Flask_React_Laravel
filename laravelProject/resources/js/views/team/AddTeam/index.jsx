import React, {useEffect, useState} from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Badge, Form} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AddTeamTable from "../AddTeamTable";
import Alert from "react-bootstrap/Alert";
import './style.css'

export default function AddTeam({leadUsers, editTeam, team_name, team_description, showFlag, handleClose, addTeam, funcData, editflag, deleteTeam}) {
    const [leadId, setLeadId] = React.useState(0);
    const [teamName, setTeamName] = useState("");
    const [description, setDescription] = useState("");
    const [functionData, setFunctionData] = useState([]);
    const [checkData, setCheckData] = useState(false);
    const [rows, setRows] = useState(0);
    const [teamId, setTeamID] = useState(0)
    const [mainEdit, setMainEdit] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    useEffect(() => {
        console.log(editTeam)
        if (leadUsers.length > 0) {
            setLeadId(leadUsers[0].id);
            if (editflag) {
                if(editTeam.lead_id != 0){
                    setLeadId(editTeam.lead_id)
                } else {
                    setLeadId(leadUsers[0].id);
                }
                setTeamID(editTeam.team_id)
                setFunctionData([...funcData]);
            } else {
                setFunctionData([]);
            }
        }
    }, [leadUsers, editflag, funcData, editTeam]);

    useEffect(() => {
        if (editflag) {
            setTeamName(team_name)
        }
    }, [team_name])

    useEffect(() => {
        if (editflag) {
            setDescription(team_description)
        }
    }, [team_description])
    const onChangeLead = () => {
        setLeadId(event.target.value)
    }
    const handlenameChange = (event) => {
        setTeamName(event.target.value)
    }
    const handleDescription = (event) => {
        setDescription(event.target.value)
    }
    const handleMainEdit =() => {
        setMainEdit(!mainEdit)
    }
    const deleteFunction = (id) => {
        let jobs = [...functionData];
        let index = jobs.findIndex(obj => obj.id === id);
        jobs.splice(id, 1);
        setFunctionData(jobs)
    }
    const handleChange = (e) => {
        setSearchValue(e.target.value)
    }
    const deleteTeams = () => {
        initvalue()
        handleClose()
        console.log(teamId)
        console.log(leadId)
        deleteTeam(teamId, leadId)
    }
    const checkFunction = () => {

        let jobs = [...functionData];
        if (teamName.length === 0 || description.length === 0 || jobs.length === 0 || leadId === 0) {
            setCheckData(true)
            return
        }
        let result = false;
        jobs.map(obj => {
            if (obj.name.length === 0) {
                setCheckData(true)
                result = true
            }
        })
        if (result) return;
        addTeam(leadId, teamName, description, jobs, editflag, teamId)
        initvalue()
        handleClose()
    }

    const initvalue = () =>{
        setFunctionData([]);
        setCheckData(false)
        setMainEdit(false)
        // setTeamName("")
        // setDescription("")
    }
    const addNewFunction = () => {
        let jobs = functionData;
        jobs.push(
            {
                id: -1,
                name: '',
                description: '',
                color_code: '#003473'
            }
        )
        setFunctionData([...jobs]);
        setRows(rows + 1);
    }

    return (
        <Modal show={showFlag} onHide={() => {
            initvalue()
            handleClose();
        }} size={'lg'} centered={true} scrollable={true}>
            <Modal.Header closeButton>
                {/* <h4 className="p-1">Team Details</h4>
                <button className="team-Detail-close-btn" onClick={() => {
                    initvalue()
                    handleClose();
                }}><img src="css/basicConfiguration/groups/close1.png" width="13" /></button> */}
                <Modal.Title>Team Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {checkData && (
                    <Alert variant="danger" dismissible onClose={() => setCheckData(false)}>
                        <Alert.Heading>Please input all fields!</Alert.Heading>
                    </Alert>
                )}
                <div className="row">
                    <div className="col-5">
                        <Form.Group as={Row} className="m-0 pr-0">
                            <Form.Label column sm="12" className="align-self-center mb-0">
                                <h5 className="m-0">Team:</h5>
                            </Form.Label>

                            {
                                !mainEdit && editflag ? (<Form.Label column sm="12" className="align-self-center mb-0">
                                        <h6 className="m-0">{editTeam.team_name}</h6>
                                    </Form.Label>):
                                    <Col sm="12" className="pr-0 align-self-center ">
                                        <Form.Control className="form-control" type="text" placeholder="Team"
                                                      onChange={handlenameChange}
                                                      name="teamname" value={teamName}/>
                                    </Col>
                            }
                        </Form.Group>
                    </div>
                    <div className="col-5">
                        <Form.Group as={Row} className="m-0 pr-0">
                            <Form.Label column sm="12" className="align-self-center mb-0">
                                <h5 className="m-0">Team Lead:</h5>
                            </Form.Label>
                            {
                                !mainEdit && editflag ? (<Form.Label column sm="12" className="align-self-center mb-0">
                                        <h6 className="m-0">{editTeam.lead_name}</h6>
                                    </Form.Label>) :
                                    <Col sm="12" className="pr-0 align-self-center">
                                        <select className="custom-select" onChange={onChangeLead} defaultValue={leadId}
                                        > {
                                            leadUsers.map((val) => <option key={val.id} value={val.id}>{val.name}</option>
                                            )
                                        }
                                        </select>
                                    </Col>
                            }
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-5">
                        <Form.Group as={Row} className="m-0 pr-0">
                            <Form.Label column sm="12" className="align-self-center mb-0">
                                <h5 className="m-0">Description:</h5>
                            </Form.Label>
                            {
                                !mainEdit && editflag ? (<Form.Label column sm="12" className="align-self-center mb-0">
                                        <h6 className="m-0">{editTeam.team_description}</h6>
                                    </Form.Label>):
                                    <Col sm="12" className="pr-0 align-self-center ">
                                        <Form.Control className="form-control" type="text" placeholder="Description"
                                                      onChange={handleDescription} name="teamdescription"
                                                      value={description}/>
                                    </Col>
                            }
                        </Form.Group>
                    </div>
                    {
                        (!editflag||mainEdit) && <div className="col-7 text-right pt-4">
                            <button className="btn btn-primary btn-sm mt-3" style={{fontSize: "14px"}}
                                    onClick={addNewFunction}><i className="i-Add text-white mr-2"></i>Add
                            </button>
                        </div>
                    }
                </div>
                <div className="mt-3">
                    <div className="col-md-6 form-group mb-3">
                        <input className="form-control form-control-rounded" type="text" placeholder="Search" onChange={handleChange} name="searchValue" />
                    </div>
                    <AddTeamTable functionData={functionData} setFunctionData={setFunctionData} deleteFunction={deleteFunction} editFlag={mainEdit} plusflag={editflag} searchdata={searchValue}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-secondary" onClick={() => {
                    initvalue()
                    handleClose();
                }}>
                    Cancel
                </Button>
                {
                    (editflag && !mainEdit) && <Button
                        variant="primary"
                        onClick={handleMainEdit}
                    >
                        Edit
                    </Button>
                }
                {
                    editflag&&<Button
                        variant="danger"
                        onClick={()=>{
                            swal_confirmation((e) => {
                                if (e) deleteTeams()
                            }, "Are you sure!", "Do you want to delete this entry ?")
                        }}
                    >
                        Delete
                    </Button>

                }
                {
                    (!editflag||mainEdit) && <Button variant="success" onClick={checkFunction}>
                        Save
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    )
}
