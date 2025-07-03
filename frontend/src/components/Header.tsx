import React from 'react';

function Header(props) {
  return (
    <div id  ="NavContainer">
      <header className="custom-header">
        <a href="/">
          <img
            src="SmallLogo.png"
            alt="Logo"
            className="header-logo"
          />
        </a>
        <nav>
          <ul className="header-nav">
            <li className = "navbar" id="AboutUsButton"><a href="#">ABOUT US</a></li>
            <li className = "navbar" id= "WhatIsKarateTrainerButton"><a href="/#about">WHAT IS KARATE TRAINER?</a></li>
            <li className = "navbar" id="FeaturesButton"><a href="/#features">FEATURES</a></li>
            <li className = "navbar" id="LoginSignInButton">
              <a href="#" onClick={e => { e.preventDefault(); if (props.onAction) props.onAction(); }}>
                {props.action}
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;