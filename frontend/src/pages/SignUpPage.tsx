import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const navigate = useNavigate(); // Add this line

  // Handler for sign up action
  const handleLogIn = () => {
    navigate("/login");
  };

  const app_name = "karatemanager.xyz";
  function buildPath(route: string): string {
    if (process.env.NODE_ENV != "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    var obj = { user, name, email, password };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("api/register"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      //var res= JSON.parse(await response.text());
      var res = await response.json();
      if (res.error == '') {
        setMessage("Sign up successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(res.error || "Sign up failed.")
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <Header action="LOG IN" onAction={handleLogIn}/>
      <div className="page-container">
        <div className="custom-card">
          <h1 className="card-title">BEGIN YOUR TRAINING</h1>
          <div id="redDiv">
            <form className="card-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Enter username"
                  value={user} onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" placeholder="Enter your Name"
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email"
                  value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" />
              </div>
              <button type="submit" className="btn btn-primary" onClick={()=>{setAction("Next")}}> Back </button>
              <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;