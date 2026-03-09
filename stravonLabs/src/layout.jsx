import { LuAlignCenter } from 'react-icons/lu'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function Layout() {
   const [isOpen, setisOpen] = useState(false)

   const hamsDisplay = () => setisOpen(!isOpen)

   return (
      <header>
         <div className="logo">
            <img src="/Com.jpg" />
            <h1>Stravon Tech Labs</h1>
         </div>
         <nav className={isOpen ? "nav-open" : ""}>
            <ul>
               <NavLink to="/" end>Home</NavLink>
               <NavLink to="/services">Services</NavLink>
               <NavLink to="/portfolio">Portfolio</NavLink>
               <NavLink to="/about">About</NavLink>
            </ul>
         </nav>
         <button className={isOpen ? "butt-open" : ""}>
            Book free Consultation
         </button>
         <LuAlignCenter
            onClick={hamsDisplay}
            className="ham"
            style={{ width: '40px', height: '40px' }}
         />
      </header>
   )
}