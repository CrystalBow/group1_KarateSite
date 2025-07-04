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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path ="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
}
export default App;
