import { FaArrowRightFromBracket, FaUser, FaXmark, FaPen, FaCircleArrowLeft   } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
// import { retrieveToken, storeToken } from '../tokenStorage.js';
// import { useNavigate } from "react-router-dom";

// FaCheck

function Header2(){
  const [action, setAction] = useState("");
  const profileIconRef = useRef<HTMLImageElement>(null);
  const AccountDivRef = useRef<HTMLDivElement>(null);
  const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
  const [beltName, setBeltName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  // var storage = require('../tokenStorage.js);
  // var obj = (other data, jwtToken:storage.retrieveToken());
  // var js = JSON.stringify(obj);
  // const navigate = useNavigate();

  useEffect(() => {
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
      setBeltName("ERROR");
    }
  }, [userData.rank]);

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
      // window.location.href = "/";
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
                <p className="iconStyle"> {userData.name} <FaPen className="absolute right-0"/></p>
              </div>

              <h6 className="headerFont"><u>Email</u></h6>
              <div>
                <p className="iconStyle"> {userData.email} <FaPen className="absolute right-0"/></p>
              </div>

              <h6 className="headerFont"><u>Belt Rank</u></h6>
              <div>
                <p className="iconStyle"> {beltName} <FaPen className="absolute right-0"/></p>
              </div>

              <h6 className="headerFont"><u>Streak</u></h6>
              <div>
                <p> {userData.streak} </p>
              </div>
            </div>
            <FaCircleArrowLeft className="text-[4vh] hover:text-red-500" onClick={() => {setAction("DisplayAccount")}}/>
          </div>): null}
    </div>
  );
}

export default Header2;
