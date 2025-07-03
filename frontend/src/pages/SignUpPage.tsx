// import React from "react";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';


const SignUpPage = () => {
    const navigate = useNavigate(); // Add this line

    // Handler for sign up action
    const handleLogIn = () => {
        navigate("/login"); // Navigate to the sign-up page
    };
  
    return (
    
    <div>
      <Header action="LOG IN" onAction={handleLogIn}/>
      <div className="page-container">
        <div className="custom-card">
          <h1 className="card-title">Please sign up below</h1>
          <div id="redDiv">
            <form className="card-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Enter username" />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="Name" className="form-control" id="Name" placeholder="Enter your Name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" />
              </div>
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;