import { useState } from "react";
import Header1 from "../components/Header1.tsx";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");


  const navigate = useNavigate();

  // Handler for sign up action
  const handleSignUp = () => {
    navigate("/signup");
  };

  const app_name = "karatetrainer.xyz";
  function buildPath(route: string): string {
    return process.env.NODE_ENV !== "development"
      ? "http://" + app_name + ":5000/" + route
      : "http://localhost:5000/" + route;
  }

  async function sendEmail(event: any): Promise<void> {
    event.preventDefault();

    if (!email.trim()) {
        setMessage("Please enter your email.");
        return;
    }

    const obj = { email };
    const js = JSON.stringify(obj);

    try {
        const response = await fetch(buildPath("api/requestPasswordReset"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
        });

        const res = await response.json();

        if (res.success) {
        setMessage("Reset email sent. Check your inbox or spam folder.");
        } else {
        setMessage(res.error || "Failed to send reset email.");
        }
        } catch (err) {
            setMessage("Error connecting to server.");
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
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Enter email associated with account"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  
                </div>
                </form>
            </div>
            <span className="error-message">{message}</span>
            <button type="submit" className="btn btn-primary" onClick={sendEmail}>
              Send Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ForgotPassword;
