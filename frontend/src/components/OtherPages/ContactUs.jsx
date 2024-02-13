import React from 'react'
import Footer from '../Root/Footer'
import '../../styles/ContactUsStyle.css'

function ContactUs() {
  return (
    <div>
      <header className="contact-us-header">
        <h1>Contact Us</h1>
      </header>

      <div className="contact-us-content">
        <div className="contact-info">
          <h2>Do not hesitate to reach out.</h2>

          <h3>Head office:</h3>
          <p>101-G, First Floor, Crown Heights, Sector 10, Rohini, Near Rithala Metro Station, Above Honda Showroom, Delhi-110085</p>
          <p>SCO114, Sonepat Sector 14, Haryana, 131001, Near Milk Point</p>

          <h3>Branch Offices:</h3>
          <p>166-P, Railway Road, Ferozepur Cantonment, Punjab-152001</p>

          <div className="contact-details">
            <h3>Contact Information:</h3>
            <p>+91 8269 135 135</p>
            <p>info@niveshonline.com</p>
          </div>

          <div className="working-hours">
            <h3>Working Hours:</h3>
            <p>Monday to Saturday</p>
            <p>9:00am - 6:00pm</p>
            <p>Sunday - Closed</p>
          </div>
        </div>

        <div className="map">
          {/* <!-- Embed Google Map using an iframe --> */}
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.9849964568825!2d77.10767411494987!3d28.71999438686824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03e08fffffff%3A0x78003ba9e40e97b1!2sMilestone%20Global%20Moneymart%20Private%20Limited!5e0!3m2!1sen!2sin!4v1615901562320!5m2!1sen!2sin" style={{border: 0, width: "400px", height: "300px"}} allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>

      <Footer/>
    </div>
  )
}

export default ContactUs