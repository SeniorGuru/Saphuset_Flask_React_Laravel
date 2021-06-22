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
    const [checkData, setCheckData] = useState(false)

    useEffect(()=>{
        if(hide){
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

    const save = () => {
        if(greenval < 1 || yellowval < 1 || redval < 1) {
            setCheckData(true)
            return
        }
        if(greenval >= yellowval || yellowval >= redval || greenval >= redval){
            setCheckData(true)
            return
        }
        setConfig(greenval, yellowval, redval)
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
