import React from 'react';
import './Table.css';

function createRow(headers, row) {
    return (
      <tr key={row[headers[0]]} >
        {headers.map((header, index) => <td key={index} style={row.errorMapping && row.errorMapping[header] ? { background: row.errorMapping[header] } : {}}>{row[header]}</td>)}
      </tr>
    );
}

function Table(props) {
    return (
        <table>
            <thead>
              <tr>
                {props.tableData && props.tableData.header.map(item => {
                  return <th key={item}>{item}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {props.tableData && props.tableData.data.map(item => {
                return createRow(props.tableData.header, item);
              })}
            </tbody>
          </table>
    );
}

export default Table;
