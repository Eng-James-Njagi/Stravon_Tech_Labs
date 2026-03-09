import '../../css/services/contactCTA.css'
export default function contactCTA(){
   return(
      <div className="contact">
         <img src="/Assistant.png" className="contact_Image"/>
         <div className="contact_Text">
            <h2>Didn't Find the Right Fit </h2>
            <p>Every Business is unique
               Lets discuss your project and create 
               a custom solution tailored to your goals and budget
            </p>
            <button>Lets Talk | Get a custom Quote</button>
         </div>
      </div>
   )
}