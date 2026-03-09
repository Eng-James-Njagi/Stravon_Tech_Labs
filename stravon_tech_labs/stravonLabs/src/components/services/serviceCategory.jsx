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
            <h4>Responsive Design</h4>
            <h4>SEO Optimized</h4>
            <h4>SEO Optimized</h4>
            <h4>Lightning Fast</h4>
            <h4>Scalable</h4>
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
            <h4>Logo Design</h4>
            <h4>Brand Identity</h4>
            <h4>Marketing Materials</h4>
            <h4>Business Cards</h4>
            <h4>Social Media Graphics</h4>
         </div>
         </div>
      </div>
   )
}