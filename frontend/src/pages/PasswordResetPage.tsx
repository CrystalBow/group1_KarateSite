import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header1 from "../components/Header1.tsx";

const PasswordReset = () => {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
    else setMessage("Missing password reset token.");
  }, [searchParams]);

  const app_name = "karatemanager.xyz";
  function buildPath(route: string): string {
    return process.env.NODE_ENV !== "development"
      ? "http://" + app_name + ":5000/" + route
      : "http://localhost:5000/" + route;
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Please fill in both fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const obj = { token, newPassword: password };

    try {
      const response = await fetch(buildPath("api/resetPassword"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });

      const res = await response.json();

      if (response.ok) {
        setMessage(res.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(res.error || "Failed to reset password.");
      }
    } catch {
      setMessage("Error connecting to server.");
    }
  }

  return (
    <>
      <Header1 action="SIGN UP" onAction={() => navigate("/signup")} />
      <div className="page-container">
        <div className="custom-card custom-card-items-centered">
          <h1 className="card-title bebasFont">RESET YOUR PASSWORD</h1>
          <form className="card-form" onSubmit={handleReset}>
            <div className="form-group">
              <label className="bebasFont">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label className="bebasFont" style={{ marginTop: "1rem" }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showPasswordCheck"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                />
                <label className="form-check-label" htmlFor="showPasswordCheck">
                  Show Password
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Reset Password
            </button>
          </form>
          {message && <div className="error-message mt-3">{message}</div>}
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
