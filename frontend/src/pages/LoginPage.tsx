// import React from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  // Handler for sign up action
  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <>
      <div>
        <Header action="SIGN UP" onAction={handleSignUp} />
      </div>
      <div>
        <div className="page-container">
          <div className="custom-card">
            <h1 className="card-title">ENTER KARATE TRAINER</h1>
            <div id="redDiv">
              <form className="card-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                  />
                </div>
                <button type="submit" className="btn btn-primary" >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
