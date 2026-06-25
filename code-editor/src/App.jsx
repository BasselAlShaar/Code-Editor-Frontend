import React from "react";
import LoginSignup from "./pages/Login-Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes.jsx";
import Chat from "./pages/Chat/index.jsx";
import LandingPage from "./pages/landing";
import CodePage from "./pages/CodePage"
import Profile from "./pages/Profile/index.jsx";
import Admin from "./pages/Admin/index.jsx";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedLayout from "./routes/ProtectedLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedLayout />}>
          <Route path={routes.login} element={<LoginSignup />} />
          <Route path={routes.code} element={<CodePage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<h3>Not Found</h3>} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin" element={<ProtectedRoute roleRequired="admin"><Admin /></ProtectedRoute>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
