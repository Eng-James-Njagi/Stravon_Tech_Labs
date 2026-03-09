
import './App.css'
import Layout from './layout'
import Home from './pages/home'
import Service from './pages/services'
import Portfolio from './pages/portfolio'
import About from './pages/about'
import Footer from './footer'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

export default function App(){
  return(
    <BrowserRouter>
      <Layout />
      <Routes>
        <Route path="/" element={<Home />}/>  
        <Route path="/services" element={<Service />}/>
        <Route path="/portfolio" element={<Portfolio />}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}