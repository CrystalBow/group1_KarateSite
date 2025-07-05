// import { useState } from "react";

// function Login() {
//   const [message, setMessage] = useState("");
//   const [loginName, setLoginName] = useState("");
//   const [loginPassword, setPassword] = useState("");

//   function handleSetLoginName(e: any): void {
//     setLoginName(e.target.value);
//   }
//   function handleSetPassword(e: any): void {
//     setPassword(e.target.value);
//   }

//   async function doLogin(event: any): Promise<void> {
//     event.preventDefault();
//     var obj = { login: loginName, password: loginPassword };
//     var js = JSON.stringify(obj);
//     try {
//       const response = await fetch("http://karatemanager.xyz:5000/api/login", {
//         method: "POST",
//         body: js,
//         headers: { "Content-Type": "application/json" },
//       });
//       var res = JSON.parse(await response.text());
//       if (res.id <= 0) {
//         setMessage("User/Password combination incorrect");
//       } else {
//         var user = {
//           firstName: res.firstName,
//           lastName: res.lastName,
//           id: res.id,
//         };
//         localStorage.setItem("user_data", JSON.stringify(user));
//         setMessage("");
//         window.location.href = "/cards";
//       }
//     } catch (error: any) {
//       alert(error.toString());
//       return;
//     }
//   }

//   return (
//     <div>
//       <span id="loginResult">{message}</span>
//       <input type="text" placeholder="Username" className="form-control" onChange={handleSetLoginName}/>
//       <input type="password" placeholder="Password" className="form-control" onChange={handleSetPassword} />
//       <button className="btn btn-primary" onClick={doLogin}>Login</button>
//     </div>
//   );
// }
// export default Login;

import { useState } from "react";

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
    <div>
      <span id="loginResult">{message}</span>
      <input type="text" placeholder="Username" className="form-control" onChange={handleSetLoginName}/>
      <input type="password" placeholder="Password" className="form-control" onChange={handleSetPassword} />
      <button className="btn btn-primary" onClick={doLogin}>Login</button>
    </div>
  );
}
export default Login;

