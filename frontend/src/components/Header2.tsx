import { FaArrowRightFromBracket, FaUser, FaXmark, FaPen, FaCircleArrowLeft   } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// FaCheck

function Header2({ profileImg, beltText }: { profileImg: string; beltText: string }){
  const [action, setAction] = useState("");
  const profileIconRef = useRef<HTMLImageElement>(null);
  const AccountDivRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
            <li className = "navbar" id="HistoryButton"><a href="#">HISTORY</a></li>
            <li className = "navbar" id="CurriculumButton"><a href="/curriculum">CURRICULUM</a></li>
            <li className = "navbar" id="HomeButton"><a href="/">HOME</a></li>
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
          <p>{beltText}</p>
        </div>
      </header>

      {action === "DisplayAccount" ? (
        <div className="AccountDiv" ref={AccountDivRef}> 
          <div id="UsernameDiv">
            <p id="UsernameText"> MegavicX </p>
          </div>
          
          <div id="ProfileOptionsDiv">
            <div className="profileOptions">
              <p className="iconStyle absolute left-0" onClick={() => {setAction("DisplayProfile")}}> <FaUser /> Profile </p>
            </div>
            <div className="profileOptions">
              <p className="iconStyle absolute left-0" onClick={() => {navigate("/")}}> <FaArrowRightFromBracket /> Log Out </p>
            </div>
            <div className="profileOptions">
              <p className="iconStyle absolute left-0"> <FaXmark /> Delete Account </p>
            </div>
          </div>
        </div>): null
        }

        {action === "DisplayProfile" ? (
          <div id="ProfileDiv" className="AccountDiv" ref={AccountDivRef}> 
            <div id="UsernameDiv">
              <p id="UsernameText"> MegavicX </p>
            </div>

            <br/>
            
            <div id="ProfileEditDiv" className="">
              <h6 className="headerFont"><u>Name</u></h6>
              <div>
                <p className="iconStyle"> Victor Acuna <FaPen className="absolute right-0"/></p>
              </div>

              <h6 className="headerFont"><u>Email</u></h6>
              <div>
                <p className="iconStyle"> email@gmail.com <FaPen className="absolute right-0"/></p>
              </div>

              <h6 className="headerFont"><u>Belt Rank</u></h6>
              <div>
                <p className="iconStyle"> White Belt<FaPen className="absolute right-0"/></p>
              </div>

              <h6 className="headerFont"><u>Streak</u></h6>
              <div>
                <p>2</p>
              </div>
            </div>
            <FaCircleArrowLeft className="text-[4vh] hover:text-red-500" onClick={() => {setAction("DisplayAccount")}}/>
          </div>): null}
    </div>
  );
}

export default Header2;
