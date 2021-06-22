import React from 'react'
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
export default class Detail extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            details: props.details,
            name: props.details.name,
            email: props.details.email,
            password: "",
            phone: props.details.phone,
            address: props.details.address,
            company: props.details.company,
            hidePass: true,
            checkValidate: false,
            editFlag: props.editFlag,
        }
        this.handleChanges = this.handleChanges.bind(this)
        this.handleVlideate = this.handleVlideate.bind(this)
    }
    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.details !== this.state.details) {
            this.setState({
                details: nextProps.details,
                name: nextProps.details.name,
                email: nextProps.details.email,
                phone: nextProps.details.phone,
                address: nextProps.details.address,
                company: nextProps.details.company
            });
        }

    }
    handleChanges(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    handleVlideate(event){
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            this.setState({
                checkValidate: true
            })
        } else {

            this.setState({
                checkValidate: false,
            })
            this.props.setEditFlag(false, '');
            this.props.setDetail(this.state.name, this.state.email, this.state.password, this.state.phone, this.state.address, this.state.company)
        }
    }
    render() {
        return (
            <Form noValidate  validated={this.state.checkValidate} onSubmit={this.handleVlideate}>
                <Col className="p-16">
                    <Row className="p-16">
                        <Col sm={8}>
                            <div className="row">
                                <Form.Group as={Col} sm={6} className="pt-3" >
                                    <Form.Label >
                                        <h5 className="m-0">Name</h5>
                                    </Form.Label>
                                    {
                                        !this.props.editFlag?
                                            <h5 className="m-0 pt-3">{this.props.details.name}</h5>
                                            :
                                        <Form.Control className="form-control" type="text" placeholder="Name"
                                                   onChange={this.handleChanges}
                                                   name="name" value={this.state.name} required/>}
                                    <Form.Control.Feedback type="invalid">
                                        Please input name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="row" >
                                <Form.Group as={Col} sm={6} className="pt-3">
                                    <Form.Label >
                                        <h5 className="m-0">Email</h5>
                                    </Form.Label>
                                    {
                                        !this.props.editFlag ? <h5 className="m-0 pt-3">{this.props.details.email}</h5>
                                            :
                                            <Form.Control className="form-control" type="email" placeholder="Email"
                                                          onChange={this.handleChanges}
                                                          name="email" value={this.state.email} required />
                                    }
                                    <Form.Control.Feedback type="invalid">
                                        Please input email.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} sm={6} className="pt-3">
                                    <Form.Label>
                                        <h5 className="m-0">Password</h5>
                                    </Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            className="form-control"
                                            type={this.state.hidePass ? "password" : "text"}
                                            placeholder="********"
                                            onChange={this.handleChanges}
                                            value={this.state.password}
                                            name="password"
                                            disabled={!this.props.editFlag}
                                            required
                                        />
                                        <InputGroup.Append
                                            onClick={() => this.setState({hidePass: !this.state.hidePass})}>
                                            <InputGroup.Text><i className="i-Eye"/></InputGroup.Text>
                                        </InputGroup.Append>
                                        <Form.Control.Feedback type="invalid">
                                            Please input password.
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group as={Col} sm={6} className="pt-3">
                                    <Form.Label >
                                        <h5 className="m-0">Phone</h5>
                                    </Form.Label>
                                    {
                                        !this.props.editFlag ? <h5 className="m-0 pt-3">{this.props.details.phone}</h5>
                                            :
                                            <Form.Control className="form-control" type="text" placeholder="Phone"
                                                          onChange={this.handleChanges}
                                                          name="phone" value={this.state.phone} required />
                                    }
                                    <Form.Control.Feedback type="invalid">
                                        Please phone number.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group as={Col} sm={6} className="pt-3">
                                    <Form.Label >
                                        <h5 className="m-0">Address</h5>
                                    </Form.Label>
                                    {
                                        !this.props.editFlag ? <h5 className="m-0 pt-3">{this.props.details.address}</h5>
                                            :
                                            <Form.Control className="form-control" type="text" placeholder="Address"
                                                          onChange={this.handleChanges}
                                                          name="address" value={this.state.address} required />
                                    }
                                    <Form.Control.Feedback type="invalid">
                                        Please input address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group as={Col} sm={6} className="pt-3">
                                    <Form.Label >
                                        <h5 className="m-0">Company</h5>
                                    </Form.Label>
                                    {
                                        !this.props.editFlag ? <h5 className="m-0 pt-3">{this.props.details.company}</h5>
                                            :
                                            <Form.Control className="form-control" type="text" placeholder="Company"
                                                          onChange={this.handleChanges}
                                                          name="company" value={this.state.company} required />
                                    }
                                    <Form.Control.Feedback type="invalid">
                                        Please input Company.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div className="col-md-12 p-0">
                                <div className="card bg-dark text-white mb-4"  style={{height: "200px", width: 200}}>
                                    <img className="card-img" src={"1.jpg"} style={{height: "200px", width: 200}} alt="Avatar" />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="row pr-32 pl-32 float-right">
                        {
                            this.props.editFlag&&<button type="submit" className="btn btn-success btn-sm mt-3 mr-3"  style={{fontSize: "16px"}}>&nbsp;Save&nbsp;
                            </button>
                        }
                        {
                            !this.props.editFlag&&<button  className="btn btn-primary btn-sm mt-3" style={{fontSize: "16px"}}
                                 onClick={() => {
                                    this.props.setEditFlag(true, '');
                                 }}>&nbsp;Edit&nbsp;
                        </button>}
                        {this.props.editFlag && <button className="btn btn-danger btn-sm mt-3"
                                                        style={{fontSize: "16px"}} onClick={()=>{
                            this.props.setEditFlag(false, '');
                        }}>&nbsp;Cancel&nbsp;
                        </button>}
                    </div>
                </Col>
            </Form>
        )
    }
}
