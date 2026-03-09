import '../../css/about/heroSection.css'
export default function HeroSection(){
   return(
       <div className="heroHeader">
         <div className="heroText">
            <h2>
               Building Digital Experiences 
               that Elevate Brands
            </h2>
            <p>
               Transform your business  with cutting-edge 
               web solutions and stunning graphic designs. 
               From concept to launch,
               we craft digital experiences 
               that drive results.
            </p>
         </div>
         <img src="/about2.png" className="heroImage"/>
      </div>
   )
}