

function Header2({ profileImg, beltText }: { profileImg: string; beltText: string }){
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
            <li className = "navbar" id="CurriculumButton"><a href="#">CURRICULUM</a></li>
            <li className = "navbar" id="HomeButton"><a href="/">HOME</a></li>
          </ul>
        </nav>
        <div id="profileIconDiv">
          <img
            src={profileImg}
            alt="profile Icon"
            id="ProfileIcon"
          />
          <p>{beltText}</p>
        </div>
      </header>
    </div>
  );
}

export default Header2;
