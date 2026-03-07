// Layout.jsx (just the header/nav, no routes)
import {LuAlignCenter} from 'react-icons/lu'
import {useState} from 'react'
import {Link} from 'react-router-dom'

export default function Layout(){
   const [isOpen, setisOpen] = useState(false);

   const hamsDisplay = () => {
      setisOpen(!isOpen)
   }
   
   return( 
    <header>
      <div className="logo">
         <img src="/Com.jpg"/>
         <h1>Stravon Tech Labs</h1>
      </div>
      <nav className={isOpen ? "nav-open" : ""}>
         <ul>
            <Link to="/">Home</Link>  
            <Link to="/services">Services</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/about">About</Link>
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