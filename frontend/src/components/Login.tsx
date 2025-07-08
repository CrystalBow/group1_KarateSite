import { useState } from "react";
import Header1 from "./Header1";
import { useNavigate } from "react-router-dom";

function Login() {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);

  const navigate = useNavigate();

  // Handler for sign up action
  const handleSignUp = () => {
    navigate("/signup");
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
        <Header1 action="SIGN UP" onAction={handleSignUp} />
      </div>
      <div>
        <div className="page-container">
          <div className="custom-card custom-card-items-centered">
            <h1 className="card-title bebasFont">ENTER KARATE TRAINER</h1>
            <div id="redDiv" className="redDivLogin">
              <form className="card-form bebasFont">
                <div className="form-group">
                  <label
                    htmlFor="username"
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
                    htmlFor="password"
                    style={{ fontFamily: "Bebas Neue" }}
                  >
                    Password{passwordInvalid && <span style={{ color: "black" }}> *</span>}
                  </label>
                  <input
                    type="password"
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
                </div>
              </form>
            </div>
            <span id="loginResult" className={message ? "error-message" : ""}>{message}</span>
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
