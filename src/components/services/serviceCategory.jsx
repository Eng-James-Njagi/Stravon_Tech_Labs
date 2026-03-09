import '../../css/services/categoryService.css'
export default function Category(){
   return(
      <div className="serv">
         <div className="service">
         <div className="service_Image">
            <img src="/estate.jpg"/>
            <img src="/furniture.jpg"/>
         </div>
         <div className="service_Text">
            <h2>Web Development Services</h2>
            <p>
               Fast, mobile-friendly websites that  rank well on Google
               and grow with your business
            </p>
         </div>
         <div className="service_Points">
            <p>Responsive Design</p>
            <p>SEO Optimized</p>
            <p>SEO Optimized</p>
            <p>Lightning Fast</p>
            <p>Scalable</p>
         </div>
         </div>
         <div className="service">
         <div className="service_Image_sec">
            <img src="/6.png"/>
            <img src="/7.jpeg"/>
         </div>
         <div className="service_Text">
            <h2>Graphic Design  Services</h2>
            <p>
               From logos to complete brand packages, we create a consistent
               visual identity that makes your business memorable and professional
            </p>
         </div>
         <div className="service_Points">
            <p>Logo Design</p>
            <p>Brand Identity</p>
            <p>Marketing Materials</p>
            <p>Business Cards</p>
            <p>Social Media Graphics</p>
         </div>
         </div>
      </div>
   )
}