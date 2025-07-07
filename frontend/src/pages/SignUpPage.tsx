
import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("Next");

  // Form state
  const [user, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

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
          {action === "Back"?<div></div>:<div>
            <h1 className="card-title bebasFont">BEGIN YOUR TRAINING</h1>
          </div>}
          {action === "Next"?<div></div>:<div>
            <h1 className="card-title bebasFont">WHat Is Your Belt Level</h1>
            <p className="bebasFont"> Completely new to Karate? Choose white belt </p>
          </div>}
          
          <div id="redDiv">
            {action === "Back"?<div></div>:<form className="card-form">
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
                <input type="password" className="form-control" id="password" placeholder="Enter password"
                  value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </form>}
            {action === "Next"?<div></div>:<div className="card-form bebasFont">
              <div className="beltdiv">
                <div className="options-container">
                  <div className="option ">
                    <input type="radio" className="radio" id="whiteBelt" name="belts" value="White Belt" />
                    <label htmlFor="whiteBelt">White Belt</label>
                  </div>
                </div>
                <img src="/assets/WhiteBelt.png" alt="White Belt" className="beltPosition"/>
              </div>
              <br />
              <div className="beltdiv">
                <div className="options-container">
                  <div className="option">
                    <input type="radio" className="radio" id="yellowBelt" name="belts" value="Yellow Belt" />
                    <label htmlFor="yellowBelt">Yellow Belt</label>
                  </div>
                </div>
                <img src="/assets/YellowBelt.png" alt="Yellow Belt" className="beltPosition"/>
              </div>
              <br />
              <div className="beltdiv">
                <div className="options-container">
                  <div className="option">
                    <input type="radio" className="radio" id="orangeBelt" name="belts" value="Orange Belt" />
                    <label htmlFor="orangeBelt">Orange Belt</label>
                  </div>
                </div>
                <img src="/assets/OrangeBelt.png" alt="Orange Belt" className="beltPosition"/>
              </div>
              <br />
              {message && <div style={{marginTop: "1em"}}>{message}</div>}
            </div>}
          </div>

          <br />

          {action === "Back"?<div></div>:<div>
            <button type="submit" className="btn btn-primary" onClick={()=>{setAction("Back")}}> Next </button>
          </div>}

          {action === "Next"?<div></div>:<div className="registerBtn" onClick={handleSubmit}>
            <button type="submit" className="btn btn-primary" onClick={()=>{setAction("Next")}}> Back </button>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>}
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
