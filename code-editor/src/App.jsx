import React from "react";
import LoginSignup from "./pages/Login-Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes.jsx";
import Chat from "./pages/Chat/index.jsx";
import LandingPage from "./pages/Landing";
import CodePage from "./pages/CodePage"
import Profile from "./pages/Profile/index.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} element={<LoginSignup />} />
        <Route path={routes.code} element={<CodePage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<h3>Not Found</h3>} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
