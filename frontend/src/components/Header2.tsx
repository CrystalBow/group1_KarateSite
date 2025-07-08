

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
          <ul className="header-nav">
            <li className = "navbar" id="AboutUsButton"><a href="#">CURRENT LESSON</a></li>
            <li className = "navbar" id= "WhatIsKarateTrainerButton"><a href="/#about">BACK</a></li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header2;
