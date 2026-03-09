import ServiceHero from '../components/services/service_hero'
import Category from '../components/services/serviceCategory'
import ServicesPackages from '../components/services/servicePackage'
import ContactCTA from '../components/services/contactCTA'
export default function Service(){
   return(
      <>
      <ServiceHero />
      <Category />
      <ServicesPackages/>
      <ContactCTA />
      </>
   )
}