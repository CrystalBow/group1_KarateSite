import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("Next");

  const [user, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleLogIn = () => {
    navigate("/login");
  };

  const app_name = "karatemanager.xyz";
  function buildPath(route: string): string {
    return process.env.NODE_ENV !== "development"
      ? "http://" + app_name + ":5000/" + route
      : "http://localhost:5000/" + route;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Collect fields that are empty
    const invalids: string[] = [];
    if (!user.trim()) invalids.push("username");
    if (!name.trim()) invalids.push("name");
    if (!email.trim()) invalids.push("email");
    if (!password.trim()) invalids.push("password");
    setInvalidFields(invalids);

    // Don't submit if there are invalid fields
    if (invalids.length > 0) {
      setMessage("Please fill out all required fields.");
      return;
    }

    var obj = { user, name, email, password };
    var js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/register"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = await response.json();
      if (res.error === "") {
        setMessage("Sign up successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(res.error || "Sign up failed.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <Header action="LOG IN" onAction={handleLogIn} />
      <div className="page-container">
        <div className="custom-card custom-card-items-centered">
          {action === "Back" ? null : (
            <div>
              <h1 className="card-title bebasFont">BEGIN YOUR TRAINING</h1>
            </div>
          )}
          {action === "Next" ? null : (
            <div>
              <h1 className="card-title bebasFont">WHat Is Your Belt Level</h1>
              <p className="bebasFont">
                Completely new to Karate? Choose white belt
              </p>
            </div>
          )}

          <div id="redDiv">
            {action === "Back" ? null : (
              <form className="card-form bebasFont">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className={`form-control ${
                      invalidFields.includes("username") ? "input-invalid" : ""
                    }`}
                    id="username"
                    placeholder="Enter username"
                    value={user}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      invalidFields.includes("name") ? "input-invalid" : ""
                    }`}
                    id="name"
                    placeholder="Enter your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      invalidFields.includes("email") ? "input-invalid" : ""
                    }`}
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className={`form-control ${
                      invalidFields.includes("password") ? "input-invalid" : ""
                    }`}
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </form>
            )}

            {action === "Next" ? null : (
              <div className="card-form bebasFont">
                <div className="beltdiv">
                  <div className="options-container">
                    <div className="option">
                      <input
                        type="radio"
                        className="radio"
                        id="whiteBelt"
                        name="belts"
                        value="White Belt"
                      />
                      <label htmlFor="whiteBelt">White Belt</label>
                    </div>
                  </div>
                  <img
                    src="/assets/WhiteBelt.png"
                    alt="White Belt"
                    className="beltPosition"
                  />
                </div>
                <br />
                <div className="beltdiv">
                  <div className="options-container">
                    <div className="option">
                      <input
                        type="radio"
                        className="radio"
                        id="yellowBelt"
                        name="belts"
                        value="Yellow Belt"
                      />
                      <label htmlFor="yellowBelt">Yellow Belt</label>
                    </div>
                  </div>
                  <img
                    src="/assets/YellowBelt.png"
                    alt="Yellow Belt"
                    className="beltPosition"
                  />
                </div>
                <br />
                <div className="beltdiv">
                  <div className="options-container">
                    <div className="option">
                      <input
                        type="radio"
                        className="radio"
                        id="orangeBelt"
                        name="belts"
                        value="Orange Belt"
                      />
                      <label htmlFor="orangeBelt">Orange Belt</label>
                    </div>
                  </div>
                  <img
                    src="/assets/OrangeBelt.png"
                    alt="Orange Belt"
                    className="beltPosition"
                  />
                </div>
                <br />
                {message && <div style={{ marginTop: "1em" }}>{message}</div>}
              </div>
            )}
          </div>

          <br />

          {action === "Back" ? null : (
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();

                  const invalids: string[] = [];
                  if (!user.trim()) invalids.push("username");
                  if (!name.trim()) invalids.push("name");
                  if (!email.trim()) invalids.push("email");
                  if (!password.trim()) invalids.push("password");

                  setInvalidFields(invalids);

                  if (invalids.length > 0) {
                    setMessage("Please fill out all required fields.");
                    return;
                  }

                  setMessage("");
                  setAction("Back");
                }}
              >
                Next
              </button>
            </div>
          )}

          {action === "Next" ? null : (
            <div className="registerBtn">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  setAction("Next");
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
