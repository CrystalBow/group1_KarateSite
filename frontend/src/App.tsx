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
import CurriculumPage from "./pages/CurriculumPage";
import WhiteBeltLessons from "./pages/WhiteBeltLessons";
import YellowBeltLessons from "./pages/YellowBeltLessons";
import OrangeBeltLessons from "./pages/OrangeBeltLessons"
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import About from "./pages/About";
import PasswordReset from "./pages/PasswordResetPage";
import KatasPage from "./pages/KatasPage";
import HistoryPage from "./pages/HistoryPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path ="/signup" element={<SignUpPage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/whitebeltlesson" element={<WhiteBeltLessons/>}/>
        <Route path="/yellowbeltlesson" element={<YellowBeltLessons/>}/>
        <Route path="/orangebeltlesson" element={<OrangeBeltLessons/>}/>
        <Route path="/forgotpasswordpage" element={<ForgotPasswordPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/kataspage" element={<KatasPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}
export default App;
