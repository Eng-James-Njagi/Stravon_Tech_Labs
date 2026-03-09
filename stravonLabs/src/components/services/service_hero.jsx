import '../../css/services/heroSection.css'
export default function ServiceHero(){
   return(
       <div className="heroHeader">
         <div className="heroText">
            <h2>
               Comprehensive 
               Digital 
               Services
            </h2>
            <h3>
               From websites to branding,
               we deliver complete digital solutions
               that help your business attract customers
               and grow.
            </h3>
            <div className="buttons">
              <div className="buttons">
                  <button className="btn-primary">View Services</button>
               </div>
            </div>
         </div>
         <img src="/serviceHero.png" className="heroImage"/>
      </div>
   )
}