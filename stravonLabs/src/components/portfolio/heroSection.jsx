import '../../css/portfolio/heroSection.css'

export default function HeroSection(){
   return(
      <div className="portfolio_wrapper">

         <div className="portfolio_hero">
            <div className="portfolio_hero_inner">
               <img src="Sample2.png" alt="Hero Image" className="portfolio_hero_image"/>
               <div className="portfolio_tag portfolio_tag--top_left">
                  Results That Speak
               </div>
               <div className="portfolio_tag portfolio_tag--top_right">
                  "Proven. Powerful. Delivered"
               </div>
               <div className="portfolio_tag portfolio_tag--bottom_right">
                  Results That Speak
               </div>
            </div>
         </div>

         <div className="portfolio_intro">
            <h2>We Build What Works</h2>
            <p>
               From startups finding their first customers to enterprises scaling to
               millions—discover the digital solutions that turned ambition into measurable growth
            </p>
            <button>Gallery Of Success →</button>
         </div>

      </div>
   )
}