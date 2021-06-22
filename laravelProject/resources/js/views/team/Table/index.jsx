import React, {useState} from 'react'
import AddTeam from "../AddTeam";
import {Badge} from "react-bootstrap";

export default function Table({ column, data, leadUsers, addTeam, FunctionAreaList, deleteTeam
}) {
    const [editFlag, setEditFlag] = useState(false);
    const [team, setTeam] = useState(0);
    const [funcData, setFuncData] = useState([]);
    const showEditFlag =() => {
        setEditFlag(!editFlag)
    }
    const showEditModal =(list) => {
        let jobs = [];
        FunctionAreaList.filter(gros => {
            return list.functions.filter(sel => sel == gros.function_id).length > 0
        }).map(val =>
        jobs.push(
            {
                id: val.function_id,
                name: val.function_name,
                description: val.description,
                color_code: val.color_code
            }
        )
        )
        setFuncData([...jobs]);
        setEditFlag(!editFlag)
        setTeam(list);
    }
  return (
    <table className="table ntable-stye">
      <thead>
        <tr>
          {
            column.map((col, i) => <th key={i} width={col.width}>{col.title}</th>)
          }
        </tr>
      </thead>
      <tbody className="tbody-container">
        {data.map((list, index) => {
          return (
            <tr key={index} onClick={() => {
                showEditModal(list)
            }}>
              {column.map((col, i) => {
                if (col.render) {
                  return <td key={i}>{col.render(list[col.dataIndex] || undefined, list, data)}</td>
                }
                return <td key={i}>{list[col.dataIndex]}</td>
              })}
            </tr>
          )
        })}
        <AddTeam leadUsers={leadUsers} funcData = {funcData} editTeam={team} {...team} editflag = {true} showFlag={editFlag} handleClose={showEditFlag} addTeam = {addTeam} deleteTeam = {deleteTeam}/>
      </tbody>
    </table>
  )
}
