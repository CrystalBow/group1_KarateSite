import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";



function Login() {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");

  const navigate = useNavigate();

  // Handler for sign up action
  const handleSignUp = () => {
    navigate("/signup");
  };


  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }
  const app_name = "karatemanager.xyz";
  function buildPath(route: string): string {
    if (process.env.NODE_ENV != "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }
  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    var obj = { user: loginName, password: loginPassword };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("api/login"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        navigate("/");
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  return (
    <>
      <div>
        <Header action="SIGN UP" onAction={handleSignUp} />
      </div>
      <div>
        <div className="page-container">
          <div className="custom-card custom-card-items-centered">
            <h1 className="card-title bebasFont">ENTER KARATE TRAINER</h1>
            <div id="redDiv" className="redDivLogin">
              <form className="card-form bebasFont">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    value={loginName}
                    onChange={handleSetLoginName}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={handleSetPassword}
                  />
                </div>
              </form>
            </div>
            <span id ="loginResult">{message}</span>
            <br />
            <button type="submit" className="btn btn-primary" onClick={doLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
