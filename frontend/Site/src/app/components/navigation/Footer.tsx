import React from 'react'
import './Footer.css';
import logo from "../../../app/images/logos/logo-white.png";

const Footer = () => {
  return (
    <footer>
        <section className="footer d-flex justify-content-center">
            <span className='footer-inner-content-width'>
              <p className="footer-section-content1">
              The B.C. Public Service acknowledges the territories of First Nations around B.C. and is grateful to carry out our work on these lands. We acknowledge the rights, interests, priorities, and concerns of all Indigenous Peoples - First Nations, Métis, and Inuit - respecting and acknowledging their distinct cultures, histories, rights, laws, and governments.
              </p>            
            </span>
        </section>
        <section className="footer-section-two">
           <div className='footer-section-two-row-one footer-inner-content-width' >
              <div className="footer-section-two-column-one">                 
                    <span className='footer-inner-content-width'>
                        <a href="https://gov.bc.ca">
                           <img src={logo} className="footer-logo" alt="BC Government Logo" />
                         </a>
                    </span>
                    <p className="footer-inner-content-width">
                    We can help in over 120 languages and through Telephone Device For The Deaf (TDD). Call, email or text us, or find a service centre
                    </p>
                                  
              </div>
              <div className='footer-section-two-column-two'>
                  <div className='content-header'>More Info</div>
                  <div className="footer-section-two-column-row-two">
                    <div className='footer-section-two-column-row-column-one'>
                    <a href='#' className='footer-link'>Home</a>
                      <a href='#' className='footer-link'>About gov.bc.ca</a>
                      <a href='#' className='footer-link'>Disclaimer</a>
                      <a href='#' className='footer-link'>Privacy</a>
                    </div>
                    <div className='footer-section-two-column-row-column-one'>
                      <a href='#' className='footer-link'>Accessibility</a>
                      <a href='#' className='footer-link'>Copyright</a>
                      <a href='#' className='footer-link'>Contact Us</a>                   
                    </div>
                  </div>
              </div>
           </div>
          
        </section>  
        <section className="d-flex justify-content-center-md">
            <span className='footer-inner-content-width'>
              <p className="">
              © 2024 Government of British Columbia
              </p>            
            </span>
        </section>     
    </footer>
  )
}

export default Footer