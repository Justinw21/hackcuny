import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Intro from './components/map/Intro'
import GMap from './components/map/Map'
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {
  return (
    <>
      <div>
        <Navbar/>
          <Routes>
            <Route path="/" element={<GMap/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Routes>
      </div>
    </>
  )
}

export default App
