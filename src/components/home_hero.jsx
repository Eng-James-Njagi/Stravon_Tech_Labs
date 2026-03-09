import "../css/home_page.css"
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
                  <button className="btn-primary">View Products</button>
                  <button className="btn-secondary">Portfolio</button>
               </div>
            </div>
         </div>
         <img src="/Sample2.png" className="heroImage"/>
      </div>
      </>
   )
}