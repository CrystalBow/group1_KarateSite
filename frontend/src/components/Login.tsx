import React, { useState } from "react";

function Login() {
  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");

  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    var obj = { login: loginName, password: loginPassword };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch("http://karatemanager.xyz:5000/api/login", {
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
        window.location.href = "/cards";
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  return (
    <div>
      <input type="text" placeholder="Username" className="form-control" />
      <input type="password" placeholder="Password" className="form-control" />
      <button className="btn btn-primary">Login</button>
    </div>
  );
}
export default Login;
