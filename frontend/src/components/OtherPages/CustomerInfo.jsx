import React from 'react'

function CustomerInfo(props) {
  const {data} = props;

  return (
      <tr>
        <td>{data.sn}</td>
        <td>{data["AMC"]}</td>
        <td>{data["Back Office Cont. No"]}</td>
        <td>{data["Back Office Email id"]}</td>
        <td>{data["RM Name"]}</td>
        <td>{data["RM Mobile Number"]}</td>
        <td>{data["RM Email id"]}</td>
        <td>{data["Sr. RM Name"]}</td>
        <td>{data["Sr. RM Mobile Number"]}</td>
        <td>{data["Sr. RM Email id"]}</td>
      </tr>
  )
}

export default CustomerInfo