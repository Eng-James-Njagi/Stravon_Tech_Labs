import '../css/ads_section.css'
import { Link } from 'react-router-dom'
export default function AdsSection() {
   return (
      <>
         <div className="add">
            <img src="/RoofAdd.jpg" className="addImage" />
            <div className="addText">
               <h2>
                  Launch Your Online Presence
                  Today — From Ksh 8,000"
               </h2>
               <p>
                  Don't let budget hold you back.
                  Start with a high-converting landing page
                  for Ksh 8,000,then scale up as your
                  business grows.
               </p>
               <Link to="/services"><small>View more packages→</small></Link>
               <a
                  href="https://wa.me/254105140326?text=Hi%2C%20I%27m%20interested%20in%20the%20Ksh%208%2C000%20landing%20page%20package.%20I%27d%20like%20to%20get%20started."
                  target="_blank"
                  rel="noreferrer"
               >
                  <button>Get yours today →</button>
               </a>
            </div>
         </div>
      </>
   )
}