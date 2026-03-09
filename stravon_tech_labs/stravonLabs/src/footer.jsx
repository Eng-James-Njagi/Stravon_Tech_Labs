import './css/footer.css'
import {Link} from 'react-router-dom'
export default function Footer(){
   return(
    <footer>
      <div className="footerMessage">
         <div className="footerCompany">
            <img src="/Com.jpg" className="footerCompany_Image"/>
            <h2>Stravon Tech Labs</h2>
         </div>
         <div className="footerContacts">
            <h3>Contact Us</h3>
            <div className="contact">
               <i className="fi fi-rr-phone-call" />
               <p>+254 115 338036</p>
            </div>

            <div className="social">
               <i className="fi fi-rr-envelope" />
               <p>midnightalpha031@gmail.com</p>
            </div>

            <div className="social">
               <i className="fi fi-rr-marker" />
               <p>Muranga Town, Muranga</p>
            </div>

         </div>
         <div className="footerLinks">
            <h3>Quick Links</h3>
            <div className="links">
               <Link>Home</Link>
               <Link>Services</Link>
               <Link>Projects</Link>
               <Link>About</Link>
            </div>
         </div>
      </div>
      <div className="footerSocials">
         <h3>Follow us: </h3>
         <div className="socials">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin"></i>
            <i className="fab fa-youtube"></i>
            <i className="fab fa-github"></i>
         </div>
      </div>
      <p className="footerCopyright">
      © 2026 Stravon Tech Labs. All rights reserved.
      </p>
    </footer>
   )
}