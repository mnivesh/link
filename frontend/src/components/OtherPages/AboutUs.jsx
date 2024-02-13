import React from 'react'
import '../../styles/AboutUsStyle.css'
import Footer from '../Root/Footer'

function AboutUs() {
  return (
    <main>
      <div className="about-content">
        <h2>About Our Company</h2>
        {/* <!-- Add a class to the paragraph for styling --> */}
        <p className="leading-fund">Leading Mutual Fund Distribution</p>
        <p>Milestone Global Moneymart (P) Ltd, established in March 2006 under the name Milestone Portfolio Consultants (P) Ltd, proudly offers a comprehensive suite of saving, investment, and insurance products across various asset classes. We provide income and wealth creation opportunities to our large retail customer base of 5.5K live accounts. Our strengths lie in delivering simple and accessible investment products for the average household. Client satisfaction has always been, and will always be, the driving force behind providing you with the best services we have to offer.</p>
      </div>
      <Footer/>
    </main>
  )
}

export default AboutUs