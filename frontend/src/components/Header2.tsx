

function Header2(){
  return (
    <div id  ="NavContainer">
      <header className="custom-header">
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
      </header>
    </div>
  );
}

export default Header2;
