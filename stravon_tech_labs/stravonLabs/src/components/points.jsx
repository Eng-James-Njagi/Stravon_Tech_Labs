import '../css/points.css'
export default function Points(){
   return(
      <>
      <div className="points">
         <div className="point">
            <img src="/sample3.png" className="pointImage"/>
           <div className="pointText">
            <h3>Expert Web Development Designs</h3>
            <p>
               Professional designs built
               with modern technologies
               and industry best practices 
               for optimal performance
               and user experience.
            </p>
           </div>
         </div>
         <div className="point reverse">
            <img src="/second.png" className="pointImage"/>
           <div className="pointText">
            <h3>Custom Solutions to your Needs</h3>
            <p>
               Every project is unique, 
               crafted specifically to align with
               your business objectives 
               and target audience requirements.
            </p>
           </div>
         </div>
          <div className="point">
            <img src="/Icons.png" className="pointImage"/>
           <div className="pointText">
            <h3>Ongoing Support and Maintenance</h3>
            <p>
              Comprehensive maintenance and
               support services to ensure your
               digital presence stays strong
               and up-to-date.
            </p>
           </div>
         </div>
         <div className="point reverse">
            <img src="/THird.png" className="pointImage"/>
           <div className="pointText">
            <h3>Proven Results Across Industries</h3>
            <p>
               A successful track record
               of delivering impactful
               digital solutions across
               multiple industries
               and business sizes.
            </p>
           </div>
         </div>
      </div>
      </>
   )
}