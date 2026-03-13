import { LuAlignCenter } from 'react-icons/lu'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Layout() {
   const [ isOpen, setisOpen ] = useState(false)

   const hamsDisplay = () => setisOpen(!isOpen)

   return (
      <header>
         <div className="logo">
           <NavLink to="/">
            <img src="/Com.jpg" />
            <h1>Stravon Tech Labs</h1>
           </NavLink>
         </div>
         <nav className={isOpen ? "nav-open" : ""}>
            <ul>
               <NavLink to="/" end>Home</NavLink>
               <NavLink to="/services">Services</NavLink>
               <NavLink to="/portfolio">Portfolio</NavLink>
               <NavLink to="/about">About</NavLink>
            </ul>
         </nav>
         <a
            href="https://wa.me/254105140326?text=Hi%20i%20would%20like%20to%20book%20a%20consultation%20for%20a%20more%20customized%20project."
            target="_blank"
            className="consultLink"
            rel="noreferrer"
         >
            <button className={isOpen ? "butt-open" : ""}>
               Book free Consultation→
            </button>
         </a>
         <LuAlignCenter
            onClick={hamsDisplay}
            className="ham"
            style={{ width: '40px', height: '40px' }}
         />
      </header>
   )
}