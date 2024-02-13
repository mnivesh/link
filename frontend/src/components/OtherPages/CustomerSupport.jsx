import React from 'react'
import CustomerInfo from './CustomerInfo'
import '../../styles/CustomerStyle.css'

const customerData = [
  {
    sn: '1',
    name: 'Ved Prakash',
    contact: '+91 8447757684',
    email: 'ved@niveshonline.com',
    seniorName: 'Pramod Bhutani',
    seniorContact: '+91 9910056952'
  },
  {
    sn: '2',
    name: 'Sagar Maini',
    contact: '+91 84477 57683',
    email: 'sagar@niveshonline.com',
    seniorName: 'Pramod Bhutani',
    seniorContact: '+91 9910056952'
  },
  {
    sn: '3',
    name: 'Manjeet Kumar',
    contact: '+91 9643007603',
    email: 'manjeet@niveshonline.com',
    seniorName: 'Vilakshan Bhutani',
    seniorContact: '+91 9910056952'
  },
  {
    sn: '4',
    name: 'Ishu Mawar',
    contact: '+91 9560258383',
    email: 'ishu@niveshonline.com',
    seniorName: 'Vilakshan Bhutani',
    seniorContact: '+91 9910056952'
  },
  {
    sn: '5',
    name: 'Paramjeet Singh',
    contact: '+91 9811436952',
    email: 'paramjeet@niveshonline.com',
    seniorName: 'Pramod Bhutani',
    seniorContact: '+91 9910056952'
  },
  {
    sn: '6',
    name: 'Himanshu Dhanik',
    contact: '+91 9910840655',
    email: 'himanshu@niveshonline.com',
    seniorName: 'Vilakshan Bhutani',
    seniorContact: '+91 9910056952'
  },
  {
    sn: '7',
    name: 'Yatin Munjal',
    contact: '+91 95602 58282',
    email: 'yatin@niveshonline.com',
    seniorName: 'Vilakshan Bhutani',
    seniorContact: '+91 9910056952'
  },
]

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
        <table>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Contact Detail</th>
            <th>Email ID</th>
            <th>Senior Name</th>
            <th>Senior Contact</th>
          </tr>
          {customerData.map(customer => (
            <CustomerInfo data={customer} />
          ))}
        </table>
      </div>
    </div>
  )
}

export default CustomerSupport