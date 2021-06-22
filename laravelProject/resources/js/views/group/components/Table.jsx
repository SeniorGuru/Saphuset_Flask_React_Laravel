import React from 'react'

export default function Table({
  column,
  data
}) {
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
            <tr key={index}>
              {column.map((col, i) => {
                if (col.render) {
                  return <td key={i}>{col.render(list[col.dataIndex] || undefined, list, data)}</td>
                }
                return <td key={i}>{list[col.dataIndex]}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
