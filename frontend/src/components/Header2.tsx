import { FaArrowRightFromBracket, FaUser, FaXmark, FaPen, FaCircleArrowLeft,FaCheck } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
// import { retrieveToken, storeToken } from '../tokenStorage.js';
import { useNavigate } from "react-router-dom";

function Header2(){
  const [action, setAction] = useState("");
  const [beltName, setBeltName] = useState("");
  const [rankChange, setRankChange] = useState(-1);
  const [profileImg, setProfileImg] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingRank, setIsEditingRank] = useState(false);
  const [copy, setCopy] = useState("");
  const [message, setMessage] = useState("");
  const profileIconRef = useRef<HTMLImageElement>(null);
  const AccountDivRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
  const navigate = useNavigate();
  const [reloadFlag, setReloadFlag] = useState(0);

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
      console.warn("Could not load UserData")
      window.location.reload();
      window.location.href = "/"; // return to home page
      return;
    }
    console.log(userData)
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
    if ((isEditingName || isEditingEmail) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName, isEditingEmail]); // Focus when isEditing becomes true

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
      setMessage(message);
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

  const updateProfile = async (field : string) =>
  {
    const jwtToken = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
    const id = userData.id;
    const user = userData.user;
    let name = ""; 
    let email = "";
    let rank = userData.rank; 

    if (field === "name")
    {
      name = copy;
    }
    else if (field === "email")
    {
      email = copy;
    }
    else if (field === "rank")
    {
      rank = rankChange;
    }
    

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
      console.log("updated fields:", data.updatedFields)
      console.log("data name = " + data.updatedFields.name);

      if (field === "name")
      {
        userData.name = name;
      }
      else if (field === "email")
      {
        userData.email = email;
      }
      else if (field === "rank")
      {
        userData.rank = rank;
        userData.progressW = data.updatedFields.progressW;
        userData.progressY = data.updatedFields.progressY;
        userData.progressO = data.updatedFields.progressO;
      }

      console.log("userData:", userData);

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

      console.log("reloadFlag = " + reloadFlag);

      if (iconClicked)
      {
        setReloadFlag(1);
        console.log("icon has been clicked");
        console.log("In clicked if reloadFlag = " + reloadFlag);
      }

      if (!iconClicked && !divClicked && reloadFlag == 1) {
        setAction("");
        window.location.reload();
        setReloadFlag(0)
        console.log("In out if reloadFlag = " + reloadFlag);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reloadFlag]);


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
          <p className="text-center text-[2vh]"> {message} </p>
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
                {isEditingName ? (
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
                        setIsEditingName(!isEditingName);
                      }}
                    />
                    <FaCheck 
                      className="IconPosition"
                      id="checkIcon"
                      onClick={() => {
                        setIsEditingName(!isEditingName);
                        updateProfile("name");
                      }}
                    /> 
                  </p>
                  </div>) : (
                  <p className="iconStyle"> 
                    {userData.name}
                    <FaPen 
                      className="IconPosition" 
                      onClick={() => {
                        setIsEditingName(!isEditingName)
                        setIsEditingEmail(false);
                        setIsEditingRank(false);
                        setCopy(userData.name);
                      }}
                    />
                  </p>)}
              </div>

              <h6 className="headerFont"><u>Email</u></h6>
              <div>
                {isEditingEmail ? (
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
                        setIsEditingEmail(!isEditingEmail);
                      }}
                    />
                    <FaCheck 
                      className="IconPosition"
                      id="checkIcon"
                      onClick={() => {
                        setIsEditingEmail(!isEditingEmail);
                        updateProfile("email");
                      }}
                    /> 
                  </p>
                  </div>) : (
                  <p className="iconStyle"> 
                  {userData.email} 
                  <FaPen 
                    className="IconPosition"
                    onClick={() => {
                      setIsEditingEmail(!isEditingEmail);
                      setIsEditingName(false);
                      setIsEditingRank(false);
                      setCopy(userData.email);
                    }}
                  />
                </p>)}
              </div>

              <h6 className="headerFont"><u>Belt Rank</u></h6>
              <div>
                {isEditingRank ? (
                  <div className="inline-flex pb-3">
                    <select 
                      name="belt rank" 
                      id="rankDropDown" 
                      value={rankChange} 
                      onChange={(e) => {
                      setRankChange(Number(e.target.value));
                    }}
                    >
                        <option value="0"> White Belt </option>
                        <option value="1"> Yellow Belt </option>
                        <option value="2"> Orange Belt </option>
                    </select>
                    <p> 
                      <FaXmark 
                        className="IconPosition"
                        id="xMarkIcon"
                        onClick={() => {
                          setIsEditingRank(!isEditingRank);
                        }}
                      />
                      <FaCheck 
                        className="IconPosition"
                        id="checkIcon"
                        onClick={() => {
                          setIsEditingRank(!isEditingRank);
                          updateProfile("rank");
                        }}
                      /> 
                    </p>
                  </div>) : (
                    <p className="iconStyle"> 
                      {beltName} 
                      <FaPen 
                        className="IconPosition"
                        onClick={() => {
                          setIsEditingName(false);
                          setIsEditingEmail(false);
                          setIsEditingRank(!isEditingRank);
                          setRankChange(userData.rank);}}
                        />
                    </p>
                  )}
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
