import React, {Component, useEffect, useState} from "react";
import './style.css'
import {Form} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

export default function RightSetting ({timeFlag, timeValue, statusDefault, setConfig}){
    const [hide, setHide] = useState(true);
    const [greenval, setGreenVal] = useState(0)
    const [yellowval, setYellowVal] = useState(0)
    const [redval, setRedVal] = useState(0)
    const [timeval, setTimeVal] = useState(0)
    const [checkFlag, setCheckFlag] = useState(false)
    const [checkData, setCheckData] = useState(false)

    useEffect(()=>{
        if(hide){
            setCheckFlag(timeFlag)
            setTimeVal(timeValue)
            setGreenVal(statusDefault[1])
            setYellowVal(statusDefault[2])
            setRedVal(statusDefault[3])
        }
    }, [timeFlag, timeValue, statusDefault, hide])

    const handleHide = () => {
        setHide(!hide)
    }
    const handleGreen = (event) => {
        setGreenVal(event.target.value)
    }
    const handleYello = (event) => {
        setYellowVal(event.target.value)
    }
    const handleRed = (event) => {
        setRedVal(event.target.value)
    }
    const handletime = (event) => {
        setTimeVal(event.target.value)
    }

    const save = () => {
        if(greenval < 1 || yellowval < 1 || redval < 1) {
            setCheckData(true)
            return
        }
        if(greenval >= yellowval || yellowval >= redval || greenval >= redval){
            setCheckData(true)
            return
        }
        if(checkFlag && timeval < 1){
            setCheckData(true)
            return
        }
        setConfig(checkFlag, timeval, greenval, yellowval, redval)
        handleHide()
    }

    return (
        <div
            id="right_customizer"
            className={`customizer ${hide ? '' : 'open'}`}
        >
            <div className="handle" onClick={handleHide}>
                <i className="i-Gear spin"></i>
            </div>
            <div className="accordion" id="accordionCustomizer">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <p className="mb-0">Configuration</p>
                    </div>
                    <div
                        className="p-16"
                    >
                        {checkData && (
                            <Alert variant="danger" dismissible onClose={() => setCheckData(false)}>
                                <Alert.Heading>Please input correct fields!</Alert.Heading>
                            </Alert>
                        )}
                        <Form.Group as={Row} className="m-3 pr-0 form-inline">
                            <Form.Label column sm={3} className="align-self-center mb-0">Green:
                            </Form.Label>
                            <Form.Control className="form-control col-sm-8" type="number" placeholder="Green"
                                          name="green" value={greenval} onChange={handleGreen}/>
                        </Form.Group>
                        <Form.Group as={Row} className="m-3 pr-0 form-inline">
                            <Form.Label column sm={3} className="align-self-center mb-0">Yellow:
                            </Form.Label>
                            <Form.Control className="form-control col-sm-8" type="number" placeholder="Yellow"
                                          name="yellow" value={yellowval} onChange={handleYello}/>
                        </Form.Group>
                        <Form.Group as={Row} className="m-3 pr-0 form-inline">
                            <Form.Label column sm={3} className="align-self-center mb-0">Red:
                            </Form.Label>
                            <Form.Control className="form-control col-sm-8" type="number" placeholder="Red"
                                          name="red" value={redval} onChange={handleRed}/>
                        </Form.Group>
                        <Form.Group as={Row} className="m-3 pr-0 form-inline">
                            <label className="checkbox col-sm-5 checkbox-primary">
                                <input
                                    type="checkbox"
                                    id="rtl-checkbox"
                                    checked={checkFlag}
                                    onChange={()=>{
                                        setCheckFlag(!checkFlag)
                                    }}
                                />
                                <span>Time select</span>
                                <span className="checkmark"></span>
                            </label>
                            <Form.Control className="form-control col-sm-6" type="number" placeholder="Select second"
                                          name="second" disabled={!checkFlag} value={timeval} onChange={handletime}/>
                        </Form.Group>

                        <Row className="mr-8 float-right">
                            <Button className="btn btn-secondary mr-3" onClick={handleHide}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary" onClick = {save}
                            >
                                Save
                            </Button>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}
