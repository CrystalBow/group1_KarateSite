import React from 'react';

const HomePage = () => {
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
            <li><a href="#">LOG IN</a></li>
          </ul>
        </nav>
      </header>

      <div className="page-container">
        <div className="custom-card">
          <h1 className="card-title">WELCOME TO KARATE TRAINER</h1>
          <img src="LogoMain2.png" className="card-img-top" alt="..." />
          <div className="card-body">
            
            <p className="card-text">
              Get started.
            </p>
            <a href="#" className="btn btn-primary">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;