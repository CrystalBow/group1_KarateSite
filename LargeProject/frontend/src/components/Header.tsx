import React from 'react';
import {Link} from 'react-router-dom';
const Header = () => {
  return (
    <div>
      <header className="custom-header">
        <img
          src="SmallLogo.png"
          alt="Logo"
          className="header-logo"
        />
        <nav>
          <ul className="header-nav">
            <li><a href="#">ABOUT US</a></li>
            <li><a href="#">WHAT IS KARATE TRAINER?</a></li>
            <li><a href="#">FEATURES</a></li>
            <li>
                <Link to = "/login">LOG IN</Link></li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;