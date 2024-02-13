import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/AppLinkStyle.css'

function AppLink() {
  return (
    <div className='app-link-container'>
      <div className="app-link-content">
        <h2>Download the mNivesh App</h2>
        <p>Get the mNivesh app for easy access to your financial tools:</p>
        <ul>
            <li><Link className="link" to="https://play.google.com/store/apps/details?id=com.milestone.mNivesh&hl=en_IN&gl=US&pli=1" target="_blank">mNivesh App for Android</Link></li>
            <li><Link className="link" to="https://apps.apple.com/au/app/mnivesh/id1023746858" target="_blank">mNivesh App for iOS</Link></li>
        </ul>
    </div>
    </div>
  )
}

export default AppLink