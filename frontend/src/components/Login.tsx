import { useState } from "react";
import Header1 from "./Header1";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handler for sign up action
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    navigate("/forgotpasswordpage");
  };

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

    const usernameEmpty = !loginName.trim();
    const passwordEmpty = !loginPassword.trim();

    // Set red highlight flags
    setUsernameInvalid(usernameEmpty);
    setPasswordInvalid(passwordEmpty);

    if (usernameEmpty || passwordEmpty) {
      setMessage("Please fill out all forms");
      return;
    }

    var obj = { user: loginName, password: loginPassword };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/login"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var res = JSON.parse(await response.text());
      console.log("Login Response:", res); //debuggin

      // JWT stuff
      const { accessToken, error, id } = res;

      // Login failure
      if (id === -1 || !accessToken || typeof accessToken !== "string") {
        setMessage(error || "Login failed. No access token received.");
        return;
      }
      try 
      {
        const decoded: any = jwtDecode(accessToken);
        const { id, user, name, email, rank, streak, progressW, progressY, progressO } = decoded;
        const account = 
        {
          id,
          user,
          name, 
          email,
          rank,
          streak,
          progressW,
          progressY,
          progressO
        };
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user_data", JSON.stringify(account))
        setMessage("");
        navigate("/curriculum");
      }
      catch
      {
        setMessage("Failed to decode access token.");
      }  
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  return (
    <>
      <div>
        <Header1 action="SIGN UP" onAction={handleSignUp} />
      </div>
      <div>
        <div className="page-container">
          <div className="custom-card custom-card-items-centered">
            <h1 className="card-title bebasFont">ENTER KARATE TRAINER</h1>
            <div id="redDiv" className="redDivLogin">
              <form className="card-form">
                <div className="form-group">
                  <label
                    htmlFor="username" className="bebasFont"
                    style={{ fontFamily: "Bebas Neue" }}
                  >
                    Username{usernameInvalid && <span style={{ color: "black" }}> *</span>}
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      usernameInvalid ? "input-invalid" : ""
                    }`}
                    id="username"
                    placeholder="Enter username"
                    value={loginName}
                    onChange={(e) => {
                      setLoginName(e.target.value);
                      setUsernameInvalid(false); 
                    }}
                  />
                </div>
                <div className="form-group">
                  <label
                    htmlFor="password" className="bebasFont"
                    style={{ fontFamily: "Bebas Neue" }}
                  >
                    Password{passwordInvalid && <span style={{ color: "black" }}> *</span>}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      passwordInvalid ? "input-invalid" : ""
                    }`}
                    id="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setPasswordInvalid(false); 
                    }}
                  />
                  <div className="form-check mt-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="showPasswordCheck"
                      checked={showPassword}
                      onChange={() => setShowPassword((prev) => !prev)}
                    />
                    <label
                      className="form-check-label bebasFont"
                      htmlFor="showPasswordCheck"
                    >
                      Show Password
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <span id="loginResult" className={message ? "error-message" : ""}>{message}</span>
            <br />
            <button type="submit" className="btn btn-primary" onClick={doLogin}>
              Login
            </button>
            <button type="button" className="btn btn-link" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
