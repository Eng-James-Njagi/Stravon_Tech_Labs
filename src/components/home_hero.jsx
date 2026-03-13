import "../css/home_page.css"
import {Link} from 'react-router-dom'
export default function HomeHero(){
   return(
      <>
      <div className="homeHeroHeader">
         <div className="homeHeroText">
            <h2>
               Building Digital Experiences 
               that Elevate Brands
            </h2>
            <p>
               Transform your business with cutting-edge 
               web solutions and stunning graphic designs. 
               From concept to launch,
               we craft digital experiences 
               that drive results.
            </p>
            <div className="HomeButtons">
               <Link to="/services"><button className="btn-primary">View our Services</button></Link>
               <Link to="/portfolio"><button className="btn-secondary">Portfolio</button></Link>
            </div>
         </div>
         <img src="/Sample2.png" className="homeHeroImage"/>
      </div>
      </>
   )
}