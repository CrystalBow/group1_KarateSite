import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header1.tsx";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    const hash = location.hash;

    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }
  }, [location]);

  return (
    <div>
      <Header1 action="LOG IN" onAction={handleLogin} />
      <div className="page-container">
        <div className="custom-card">
          <div className="card-scroll-content">
            <div className="hero-section">
              <h1 className="card-title">WELCOME TO KARATE TRAINER</h1>
              <img src="/assets/LogoMain2.png" className="card-img-top" alt="..." />
              <div className="card-body">
                <p className="card-text">Get started.</p>
                <a href="/signup" className="btn btn-primary">
                  Sign Up
                </a>
              </div>
            </div>
            <div className = "paint-overlay">
              <img id="about" src="/assets/RearRedPaint.png" className="rear-img" alt="About Us" />
              <div className="about">
                <h2>
                  <u>WHAT IS KARATE TRAINER?</u>
                </h2>
                <p>
                  Karate Trainer has everything you need to learn traditional karate. 
                  Based on Shito-Ryu, one of the main karate styles from Okinawa, Japan, 
                  Karate Trainer will teach you all the basic blocks, forms (kata), 
                  and applications. It is also useful for those already 
                  involved in karate who want to better their skills. 
                  With features including drills to help with footwork and combos, 
                  stretches for flexibility, karate specific exercises to make your kicks and 
                  punches stronger, and more.
                </p>
              </div>
            </div>
            <div className="paint-overlay">
              <img id="features" src="/assets/RearRedPaint.png" className="rear-img" alt="About Us" />
              <div className="features">
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
    </div>
  );
};

export default HomePage;
