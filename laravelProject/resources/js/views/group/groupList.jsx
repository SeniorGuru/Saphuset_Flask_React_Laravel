import React from 'react'

export default function GroupList({
  group,
  editing,
  setShowCreate,
  getSelectedGroup,
  deleteGroup,
  activeGroup,
  setEditState,
}) {
  return (
    <div className="left-menu-container">
      <div className="left-menu-inner-content">
        <div className="newgroup-container">
          <button className="btn btn-primary float-right" onClick={() => { setEditState(!editing) }}>{editing ? 'Save' : 'Edit'}</button>
          {!editing && <button className="btn btn-primary float-right mr-12" onClick={() => { setShowCreate(true) }}>New Group</button>}
        </div>
        <div className="left-groups-container scrollbar-primary">
          {group.map(gro => {
            return (
              <div className="form-group group-item-view mb-12 cursor-pointer" key={gro.group_id}>
                <div className={"col-sm-10 group-item-list" + (editing ? "" : " col-sm-12") + (activeGroup == gro.group_id ? " active" : "")} onClick={() => getSelectedGroup(gro.group_id, gro)}>
                  <div className="group-box">
                    <div>
                      <div className="left-menu-heading">
                        {gro.group_name}
                      </div>
                      <label>{gro.group_description}</label>
                    </div>
                  </div>
                </div>
                {editing && <div className="col-sm-2 pr-0">
                  <i className="i-Remove font-20 color-danger" onClick={() => swal_confirmation((e) => {
                    if (e) deleteGroup(gro.group_id)
                  }, "Are you sure!", "Do you want to delete this entry ?")
                  }></i>
                </div>}
              </div>)
          })}
        </div>
      </div>
    </div>
  )
}
