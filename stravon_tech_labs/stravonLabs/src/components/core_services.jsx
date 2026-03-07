import '../css/core_services.css'
export default function Core(){
   return(
      <>
     <div className="core">
      <h2>Our Core Services</h2>
      <div className="coreCont">
         <div className="coreContainer">
            <img src="/estate.jpg" className="coreImage"/>
            <div className="coreText">
               <h3>Web Development</h3>
               <p>
                  From simple landing pages to
                  complex e-commerce platforms,
                  we build responsive, SEO-optimized
                  websites that convert visitors into
                  customers.
               </p>
            </div>
         </div>
          <div className="coreContainer">
            <img src="/6.png" className="coreImage"/>
            <div className="coreText">
               <h3>Graphic Design</h3>
               <p>
                  Professional logos,
                  marketing materials
                  and brand assets that
                  communicate
                  your message with impact
                  and consistency.
               </p>
            </div>
         </div>
          <div className="coreContainer">
            <img src="/Custom.png" className="coreImage"/>
            <div className="coreText">
               <h3>Digital Solutions</h3>
               <p>
                  Custom integrations,
                  API development,
                  and technical consulting
                  to streamline
                  your business operations.
               </p>
            </div>
         </div>
      </div>
     </div>
      </>
   )
}