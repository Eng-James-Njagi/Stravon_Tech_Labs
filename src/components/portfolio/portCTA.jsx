import "../../css/portfolio/portCTA.css";
export default function CTASection() {
   return (
      <div className="CTA">
         <div className="CTA1">
            <div className="CTA1_Text">
               <h2>Your Project Deserves the Same Excellence </h2>
               <p>These success stories started with a single conversation.
                  Whether you're launching something new or transforming what exists,
                  let's talk about what's possible.
                  Book a consultation and get a clear path forward—no obligations,
                  just honest insights.
               </p>
               <button>Let’s get your Story Started →</button>
            </div>
            <img src="/Assistant.png" className="cta_Image" />
         </div>
         <div className="CTA2">
            <img src="/estate.jpg" className="cta2_Image" />
            <div className="CTA2_Text">
               <h2>Business-Class Websites from Ksh 12,000 </h2>
               <p>Why settle for templates when you 
                  have custom? Get a professionally designed
                  website that actually works for your
                  business—mobile-optimized, fast-loading,
                  and built to convert. Start small, scale
                  smart, and make your investment count."
                  Free consultation included
               </p>
               <button>Get Your Website →</button>
            </div>
         </div>
      </div>
   )
}