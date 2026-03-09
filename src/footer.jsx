import './css/footer.css'
import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa'

export default function Footer() {
   return (
      <footer>
         <div className="footerMessage">
            <div className="footerCompany">
               <img src="/Com.jpg" className="footerCompany_Image" />
               <h2>Stravon Tech Labs</h2>
            </div>

            <div className="footerContacts">
               <h3>Contact Us</h3>
               <div className="social">
                  <FiMail className="footer-icon" />
                  <p>midnightalpha031@gmail.com</p>
               </div>
               <div className="social">
                  <FiMapPin className="footer-icon" />
                  <p>Muranga Town, Muranga</p>
               </div>
               <div className="social">
                   <FiPhone className="footer-icon" />
                  <p>+254 105 140326</p>
               </div>
            </div>

            <div className="footerLinks">
               <h3>Quick Links</h3>
               <div className="links">
                  <Link to="/">Home</Link>
                  <Link to="/services">Services</Link>
                  <Link to="/portfolio">Projects</Link>
                  <Link to="/about">About</Link>
               </div>
            </div>
         </div>

         <div className="footerSocials">
            <h3>Follow us:</h3>
            <div className="socials">
               <FaFacebook className="social-icon" />
               <FaTwitter className="social-icon" />
               <FaInstagram className="social-icon" />
               <FaLinkedin className="social-icon" />
               <FaYoutube className="social-icon" />
               <FaGithub className="social-icon" />
            </div>
         </div>

         <p className="footerCopyright">
            © 2026 Stravon Tech Labs. All rights reserved.
         </p>
      </footer>
   )
}