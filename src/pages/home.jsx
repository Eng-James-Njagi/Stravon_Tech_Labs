import HomeHero from '../components/home_hero'
import AdsSection from '../components/ads_section'
import Us from '../components/us'
import Points from '../components/points'
import Core from '../components/core_services'
import PortfolioLink from '../components/portfolio'
import Testimonials from '../components/portfolio/testimonials'
export default function Home(){
   return(
      <>
      <HomeHero />
      <AdsSection />
      <Us />
      <Points />
      <Core />
      <PortfolioLink />
      <Testimonials/>
      </>
   )
}