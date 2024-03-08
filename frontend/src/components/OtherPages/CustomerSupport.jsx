import React from 'react'
import CustomerInfo from './CustomerInfo'
import '../../styles/CustomerStyle.css'

import customerData from '../../assets/amc_contacts.json' 

function CustomerSupport() {
  return (
    <div className='customer-container'>
      <div className='customer-content'>
        <h2>Customer Support</h2>
        <p>If you have any questions, concerns, or need assistance, our customer support team is here to help you.</p>
        <p>Contact us through the following channels:</p>
        <ul>
          <li>Email: support@niveshonline.com</li>
          <li>Phone: +91 8269135135</li>
        </ul>

        <h3>Contact Information</h3>
        <section className='table'>
        <table>
          <thead>
            <tr>
              <th>S.no</th>
              <th>AMC</th>
              <th>Back Office Cont. No.</th>
              <th>Back Office Email ID</th>
              <th>RM Name</th>
              <th>RM Mobile Number</th>
              <th>RM Email ID</th>
              <th>Sr. RM Name</th>
              <th>Sr. RM Mobile Number</th>
              <th>Sr. RM Email ID</th>
            </tr>
          </thead>
          <tbody>{customerData.map(customer => (
            <CustomerInfo key={customer.sn} data={customer} />
          ))}</tbody>
        </table>
        </section>
      </div>
    </div>
  )
}

export default CustomerSupport