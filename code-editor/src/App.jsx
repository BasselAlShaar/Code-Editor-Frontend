import React from 'react';
import LoginSignup from './pages/Login-Signup'
import "./styles/App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes.jsx";
import Socials from './components/Socials';
import LandingPage from './pages/landing/index.jsx';


const App = ()=>{
    return(
      <BrowserRouter>
        <Routes>
          <Route path={routes.login} element={<LoginSignup />} />
            <Route path='/socials' element={<Socials />} />
            <Route path='/landing' element={<LandingPage />} />
          <Route path="/*" element={<h3>Not Found</h3>} />
        </Routes>
      </BrowserRouter>
    )
}
export default App;