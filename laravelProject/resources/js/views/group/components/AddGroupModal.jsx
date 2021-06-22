import React from 'react'

export default function AddGroupModal({
  group,
  handleCheck,
  selectedGroup,
  addGrouper,
  setShowAddGroup
}) {
  return (
    <div className="dialog-box-container-delete">
      <div className="dialog-group-container scrollbar-primary addgroup-dialog">
        {group.map(gro => {
          return (
            <div className="form-check mb-1" key={gro.group_id}>
              <input className="form-check-input" id={`gridCheck${gro.group_id}`} name={gro.group_id} type="checkbox" onChange={handleCheck} checked={selectedGroup.filter(sel => sel == gro.group_id).length > 0} />
              <label className="form-check-label cursor-pointer ml-3" htmlFor={`gridCheck${gro.group_id}`}>
                {gro.group_name}
              </label>
            </div>
          )
        })}
      </div>

    </div>
  )
}
