import React from 'react'

export default function AddModal({
  editing,
  groupName,
  groupDescription,
  addGroup,
  setShowCreate,
  handleChange
}) {
  return (
    <div className="dialog-box-container">
      <div className="dialog-box-heading">
        {editing ? <span>Edit Group &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> : 'Create new group'}
        <button className="close-btn" onClick={() => { setShowCreate(false) }}><img src="css/basicConfiguration/groups/close1.png" width="13" /></button>
      </div>
      <div className="groupname-container">
        <div className="groupname-label">
          Group name
        </div>
        <input className="left-grp-input" name="groupName" onChange={handleChange} value={groupName} />
      </div>
      <div className="groupname-container pt-10">
        <div className="groupname-label">
          Group description
        </div>
        <input className="left-grp-input" name="groupDescription" onChange={handleChange} value={groupDescription} />
      </div>
      <div className="pop-button-container pt-25">
        <button className="btn btn-primary float-right" onClick={() => addGroup()}>{editing ? 'Apply' : 'Create'}</button>
        <button className="btn btn-secondary float-right mr-12" onClick={() => setShowCreate(false)}>Cancel</button>
      </div>
    </div>
  )
}
