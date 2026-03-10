import "../css/home_page.css"
import {Link} from 'react-router-dom'
export default function HomeHero(){
   return(
      <>
      <div className="heroHeader">
         <div className="heroText">
            <h2>
               Building Digital Experiences 
               that Elevate Brands
            </h2>
            <h3>
               Transform your business  with cutting-edge 
               web solutions and stunning graphic designs. 
               From concept to launch,
               we craft digital experiences 
               that drive results.
            </h3>
            <div className="buttons">
              <div className="buttons">
                  <Link to="/services"><button className="btn-primary">View our Services</button></Link>
                  <Link to="/portfolio"><button className="btn-secondary">Portfolio</button></Link>
               </div>
            </div>
         </div>
         <img src="/Sample2.png" className="heroImage"/>
      </div>
      </>
   )
}