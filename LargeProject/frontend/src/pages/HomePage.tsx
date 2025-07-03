import React from 'react';
import Header from '../components/Header';

const HomePage = () => {
  return (
    <>
      <div>
        <Header action="LOG IN" />
      </div>
      <div>
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
    </>
  );
};

export default HomePage;