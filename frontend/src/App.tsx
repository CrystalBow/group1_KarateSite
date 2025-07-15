//import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import Curriculum from "./pages/Curriculum";
import WhiteBeltLessons from "./pages/WhiteBeltLessons";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path ="/signup" element={<SignUpPage />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/whitebeltlesson" element={<WhiteBeltLessons/>}/>
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </Router>
  );
}
export default App;
