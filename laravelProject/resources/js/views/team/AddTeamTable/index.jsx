import React from "react";
const cellEditProp = {
    mode: 'click',
    blurToSave: true,
};
import './style.css'
import {Row} from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import Button from "react-bootstrap/Button";

// validator function pass the user input value and should return true|false.

const color_value = [
    {
        "key":"Code 1",
        "value":"#003473"
    },
    {
        "key":"Code 2",
        "value":"#f44336"
    },
    {
        "key":"Code 3",
        "value":"#ffc107"
    },
    {
        "key":"Code 4",
        "value":"#4caf50"
    }];

export default class AddTeamTable extends React.Component {

    constructor(props) {
        super(props);
        this.colorFormatter = this.colorFormatter.bind(this);
        this.updateFunctionData = this.updateFunctionData.bind(this);
    }
    deleteclick(id) {
        this.props.deleteFunction(id)
    }
    changeColorCode(id, index){
        let data = [...this.props.functionData];
        data[id].color_code = color_value[index].value;
        this.props.setFunctionData(data);
    }
    colorFormatter(cell, row) {
        let cell_index = color_value.findIndex(obj => obj.value === cell)
        return <Row className="justify-content-between ml-8 mr-8">
            { this.props.editFlag && (
                <div className="btn-group ">
                    <Dropdown>
                        <Dropdown.Toggle
                            as="div"
                            className="toggle-hidden"
                        >
                            <button
                                className="btn custom-btn  btn-sm dropdown-toggle"
                                style={{background: cell, color:'#ffffff'}}
                                type="button"
                            >
                                {color_value[cell_index].key}
                            </button>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                color_value.map((val, index) => {
                                    return <Dropdown.Item key={index} onClick={()=>this.changeColorCode(row.id, index)}>
                                        <span className="ul-task-manager__dot mr-2" style={{background: val.value}}/>
                                        {val.key}
                                    </Dropdown.Item>;
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
            { this.props.editFlag && (
                <Button
                    variant="outline-danger"
                    className="btn-icon btn-sm text-capitalize"
                    onClick={ ()=> this.deleteclick(row.id)}
                >
                    <span className="ul-btn__icon">
                        <i className="i-Remove"></i>
                    </span>
                </Button>
            )}
            { !this.props.editFlag && (
                <button
                    className="btn custom-btn  btn-sm"
                    style={{background: cell, color:'#ffffff'}}
                    type="button"
                >
                    {color_value[cell_index].key}
                </button>
            )
            }
        </Row>;
    }

    updateFunctionData(type, id, e){
        let data = this.props.functionData;
        switch(type){
            case 'name':
                data[id].name = e.target.value;
                break;
            case 'description':
                data[id].description = e.target.value;
                break;
            case 'color_code':
                data[id].color_code = e.target.value;
                break;
        }
        this.props.setFunctionData(data);
        this.setState({})
    }

    render() {
        console.log(this.props.functionData)
        return (
            <table className="table ntable-stye">
                <thead>
                    <tr>
                        <th width="30%">Functional Area</th>
                        <th width="40%">Description</th>
                        <th>Color Code</th>
                    </tr>
                </thead>
                <tbody className="tbody-container function-Table">
                    { this.props.functionData && this.props.functionData.map((row, index) => {
                        let cell_index = color_value.findIndex(obj => obj.value === row.color_code)
                        if(this.props.searchdata === "" || row.name.toLowerCase().search(this.props.searchdata.toLowerCase()) >= 0 || row.description.toLowerCase().search(this.props.searchdata.toLowerCase()) >= 0){
                            return (
                                <tr key={index} id={row.id}>
                                    <td className="pt-2">
                                        {
                                            (!this.props.plusflag || this.props.editFlag )? (
                                                    <input type="text" className="form-control form-control" value={row.name} onChange={this.updateFunctionData.bind(this, 'name', index)}/>
                                                ):
                                                row.name
                                        }
                                    </td>
                                    <td className="pt-2">
                                        {
                                            (!this.props.plusflag || this.props.editFlag )? (
                                                    <input type="text" className="form-control form-control" value={row.description} onChange={this.updateFunctionData.bind(this, 'description', index)}/>
                                                ) :
                                                row.description
                                        }
                                    </td>
                                    <td className="pt-2">
                                        <div className="row pl-8 pr-8 pt-1 justify-content-between">
                                            {(!this.props.plusflag || this.props.editFlag )&& (
                                                <div className="btn-group ">
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            as="div"
                                                            className="toggle-hidden"
                                                        >
                                                            <button
                                                                className="btn custom-btn  btn-sm dropdown-toggle"
                                                                style={{background: row.color_code, color:'#ffffff'}}
                                                                type="button"
                                                            >
                                                                {color_value[cell_index].key}
                                                            </button>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {
                                                                color_value.map((val, indexs) => {
                                                                    return <Dropdown.Item key={indexs} onClick={()=>this.changeColorCode(index, indexs)}>
                                                                        <span className="ul-task-manager__dot mr-2" style={{background: val.value}}/>
                                                                        {val.key}
                                                                    </Dropdown.Item>;
                                                                })
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            )}
                                            {(!this.props.plusflag || this.props.editFlag )&& (
                                                <Button
                                                    variant="outline-danger"
                                                    className="btn-icon btn-sm text-capitalize"
                                                    onClick={ ()=> {swal_confirmation((e) => {
                                                        if (e) this.deleteclick(index)
                                                    }, "Are you sure!", "Do you want to delete this entry ?")}}
                                                >
                                            <span className="ul-btn__icon">
                                                <i className="i-Remove"></i>
                                            </span>
                                                </Button>
                                            )}
                                            { (this.props.plusflag && !this.props.editFlag ) && (
                                                <button
                                                    className="btn custom-btn  btn-sm"
                                                    style={{background: row.color_code, color:'#ffffff'}}
                                                    type="button"
                                                >
                                                    {color_value[cell_index].key}
                                                </button>
                                            )
                                            }
                                        </div>
                                    </td>
                                </tr>
                            )
                        } else {
                            return (<tr key={index} id={row.id}/>)
                        }
                    })}
                </tbody>
                </table>
        );
    }
}
