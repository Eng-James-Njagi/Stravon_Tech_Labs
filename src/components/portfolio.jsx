import '../css/portfolioLink.css'
import {Link} from 'react-router-dom'
export default function PortfolioLink(){
   return(
      <>
      <div className="portLink">
         <img src="/Projects.png" className="portLink_image"/>
         <div className="portLink_text">
            <h2>See What We Have Built</h2>
            <p>
               Explore our portfolio of successful
               projects across various industries.
               From startup websites to enterprise
               solutions, discover how we've helped
               businesses achieve their digital goals.
            </p>
            <Link to="/portfolio"><button>View Other Projects→</button></Link>
         </div>
      </div>
      </>
   )
}