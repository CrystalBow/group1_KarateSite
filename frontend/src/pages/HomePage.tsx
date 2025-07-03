import React, { useEffect } from "react";
import Header from "../components/Header.tsx";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (window.location.hash === "#features") {
      const el = document.getElementById("features");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  useEffect(() => {
    if (window.location.hash === "#about") {
      const el = document.getElementById("about");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div>
      <Header action="LOG IN" onAction={handleLogin} />
      <div className="page-container">
        <div className="custom-card">
          <div className="card-scroll-content">
            <h1 className="card-title">WELCOME TO KARATE TRAINER</h1>
            <img src="LogoMain2.png" className="card-img-top" alt="..." />
            <div className="card-body">
              <p className="card-text">Get started.</p>
              <a href="/signup" className="btn btn-primary">
                Sign Up
              </a>
            </div>
            <div className="about" id="about">
              <h2>
                <u>WHAT IS KARATE TRAINER?</u>
              </h2>
              <p>
                Karate Trainer has everything you need to learn traditional
                karate. Based off Shito- Ryu, one of the main karate styles from
                Okinawa Japan, Karate Trainer will teach you the basics....
              </p>
            </div>
            <div className="features" id="features">
              <h2>
                <u>Features of Karate Trainer</u>
              </h2>
              <p>
                {" "}
                Karate Trainer Includes: Karate curriculum - all belts, with
                stances & basics{" "}
              </p>
              <p> Access to Drills & Stretches</p>
              <p> Exercises to technique</p>
              <p> Self-Defense</p>
              <p> Workouts for health and fitness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
