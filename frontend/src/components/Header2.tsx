import { FaArrowRightFromBracket, FaUser, FaXmark, FaPen, FaCircleArrowLeft,FaCheck } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// import { retrieveToken, storeToken } from '../tokenStorage.js';
import { useNavigate } from "react-router-dom";

function Header2(){
  const [action, setAction] = useState("");
  const [beltName, setBeltName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  // const [testEdit, setTestEdit] = useState("Changes");
  const [copy, setCopy] = useState("");
  const [message, setMessage] = useState("");
  const profileIconRef = useRef<HTMLImageElement>(null);
  const AccountDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem("token");

    if (jwtToken)
    {
      const decodedToken: any = jwtDecode(jwtToken);
      console.log("Decoded Token:", decodedToken);
    } 
    else 
    {
      console.warn("No token found in localStorage.");
    }  

    // If no user_data, i.e no one is logged in
    if (Object.keys(userData).length === 0)
    {
      window.location.reload();
      window.location.href = "/"; // return to home page
      return;
    }

    if (userData.rank === 0) 
    {
      setBeltName("White Belt");
      setProfileImg("/assets/ProfileWhiteBelt.png");
    } 
    else if (userData.rank === 1) 
    {
      setBeltName("Yellow Belt");
      setProfileImg("/assets/ProfileYellowBelt.png");
    } 
    else if (userData.rank === 2) 
    {
      setBeltName("Orange Belt");
      setProfileImg("/assets/ProfileOrangeBelt.png");
    } 
    else 
    {
       setBeltName("ERROR"); // debuggin
    }
  }, [userData.rank]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      setCopy(userData.name);
    }
  }, [isEditing]); // Focus when isEditing becomes true

  const app_name = "karatemanager.xyz";
  function buildPath(route: string): string {
    if (process.env.NODE_ENV != "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  function doLogout(event: any): void 
  {
    event.preventDefault();
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  async function confirmDelete(event: any): Promise<void>
  {
    event.preventDefault();
    
    let okay = confirm("Are you sure you want to delete this Account? \nThis is a permanent action and once the account is deleted it can not be recovered.");
    
    if (okay)
    {
      let message = await deleteAccount();
      alert(message);
      setTimeout(() => navigate("/"), 1500);
    }
  }

  const deleteAccount = async () =>
  {
    const jwtToken = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
    const id = userData.id;
    const user = userData.user;

    console.log(localStorage.getItem("token"));
    console.log(user);

    if (!jwtToken || !id) {
      console.warn("Missing token or user ID");
      return;
    }

    try {
      const response = await fetch(buildPath("api/deleteUser"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, jwtToken }),
        }
      );

      const data = await response.json();

      if (data.error === "The JWT is no longer valid") {
        localStorage.removeItem("token");

        console.warn("Session expired. Please log in again.");
        return;
      }

      console.log(data.message);

      //if (data.jwtToken && data.jwtToken.trim() !== "") {
        //localStorage.setItem("token", data.jwtToken);
      //}
      return(data.message);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  }

  const updateProfile = async () =>
  {
    const jwtToken = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
    const id = userData.id;
    const user = userData.user;
    const name = copy; // stores updated name
    const email = "";
    const rank = userData.rank; 

    console.log(localStorage.getItem("token"));
    console.log(user);

    if (!jwtToken || !id) {
      console.warn("Missing token or user ID");
      return;
    }

    try {
      const response = await fetch(buildPath("api/editUserInfo"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, name, email, rank, jwtToken }),
        }
      );

      const data = await response.json();

      if (data.error === "The JWT is no longer valid") {
        localStorage.removeItem("token");

        console.warn("Session expired. Please log in again.");
        return;
      }

      console.log("data t:", data);
      userData.name = data.name;

      localStorage.setItem("user_data", JSON.stringify(userData));

      console.log("data info:", data);

      //if (data.jwtToken && data.jwtToken.trim() !== "") {
        //localStorage.setItem("token", data.jwtToken);
      //}
      // return(data.message);
      setMessage(data.message);
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const iconClicked = profileIconRef.current && profileIconRef.current.contains(event.target as Node);
      const divClicked = AccountDivRef.current && AccountDivRef.current.contains(event.target as Node);
      if (!iconClicked && !divClicked) {
        setAction("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="NavContainer">
      <header className="custom-header bebasFont">
        <a href="/">
          <img
            src="/assets/SmallLogo.png"
            alt="Logo"
            className="header-logo"
          />
        </a>
        <nav>
          <ul className="header2-nav">
            <li className = "navbar" id="HistoryButton"><a href="/history">HISTORY</a></li>
            <li className = "navbar" id="CurriculumButton"><a href="/curriculum">CURRICULUM</a></li>
            <li className = "navbar" id="HomeButton"><a href="/kataspage">KATA</a></li>
          </ul>
        </nav>
        <div id="profileIconDiv">
          <img
            src={profileImg}
            alt="profile Icon"
            id="ProfileIcon"
            ref={profileIconRef}
            onClick={(e) =>{ 
                  e.preventDefault();
                  if (action === "")
                  {
                    setAction("DisplayAccount");
                  }
                  else
                  {
                    setAction("")
                  }
                }}
          />
          <p>{beltName}</p>
        </div>
      </header>

      {action === "DisplayAccount" ? (
        <div className="AccountDiv" ref={AccountDivRef}> 
          <div id="UsernameDiv">
            <p id="UsernameText"> {userData.user} </p>
          </div>
          
          <div id="ProfileOptionsDiv">
            <div className="profileOptions">
              <p className="iconStyle absolute left-0" onClick={() => {setAction("DisplayProfile")}}> <FaUser /> Profile </p>
            </div>
            <div className="profileOptions">
              <p className="iconStyle absolute left-0" onClick={doLogout}> <FaArrowRightFromBracket /> Log Out </p>
            </div>
            <div className="profileOptions">
              <p className="iconStyle absolute left-0" onClick={confirmDelete}> <FaXmark /> Delete Account </p>
            </div>
          </div>
        </div>): null
        }

        {action === "DisplayProfile" ? (
          <div id="ProfileDiv" className="AccountDiv" ref={AccountDivRef}> 
            <div id="UsernameDiv">
              <p id="UsernameText"> {userData.user} </p>
            </div>

            <br/>
            
            <div id="ProfileEditDiv" className="">
              <h6 className="headerFont"><u>Name</u></h6>
              <div>
                {isEditing ? (
                  <div className="inline-flex pb-3">
                  <input 
                    ref={inputRef}
                    type="text" 
                    id="editInput" 
                    className=""
                    value={copy}
                    onChange={(e) => {setCopy(e.target.value)}}
                  /> 
                  <p> 
                    <FaXmark 
                      className="IconPosition"
                      id="xMarkIcon"
                      onClick={() => {
                        setIsEditing(!isEditing);
                      }}
                    />
                    <FaCheck 
                      className="IconPosition"
                      id="checkIcon"
                      onClick={() => {
                        setIsEditing(!isEditing);
                        updateProfile();
                      }}
                    /> 
                  </p>
                  </div>) : (
                  <p className="iconStyle"> 
                    {userData.name}
                    <FaPen 
                      className="IconPosition" 
                      onClick={() => {setIsEditing(!isEditing)}}
                    />
                  </p>)}
              </div>

              <h6 className="headerFont"><u>Email</u></h6>
              <div>
                <p className="iconStyle"> {userData.email} <FaPen className="IconPosition"/></p>
              </div>

              <h6 className="headerFont"><u>Belt Rank</u></h6>
              <div>
                <p className="iconStyle"> {beltName} <FaPen className="IconPosition"/></p>
              </div>

              <h6 className="headerFont"><u>Streak</u></h6>
              <div>
                <p> {userData.streak} </p>
              </div>
            </div>
            <FaCircleArrowLeft className="text-[4vh] hover:text-red-500 cursor-pointer" onClick={() => {setAction("DisplayAccount")}}/>
            <br/>
            <p className="text-center text-[2vh]"> {message} </p>
          </div>): null}
    </div>
  );
}

export default Header2;
