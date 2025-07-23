import { useEffect, useState } from "react";

import Header2 from "../components/Header2.tsx";

const CurriculumPage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
  const storedData = localStorage.getItem("user_data");
  if (storedData) {
    const parsed = JSON.parse(storedData);
    setUserName(parsed.name);  
  }
}, []);
  return (
    <div>
      <Header2 />
      <div className="page-container">
        <div className="custom-card custom-card-items-centered">
          <div id="redDivCurr" className="redDivLogin">
            <img src="/assets/RearRedPaint.png" id="rearImgCurr"></img>
            <h1 className="bebasFont" id="lessonText">
              WELCOME{userName ? `, ${userName.toUpperCase()}` : ""} SELECT A LESSON
            </h1>
            
            <nav className="lesson-nav" >
              <button className="lesson-btn">
                <a href = "/whitebeltlesson" style={{textDecoration: "none"}}>
                <img src="/assets/WhiteLesson.png" alt="Lesson 1" />
                <span style={{color: "white"}}>ENTER WHITE BELT</span>
                </a>
              </button>
              <button className="lesson-btn">
                <a href = "/yellowbeltlesson" style={{textDecoration: "none"}}> 
                <img src="/assets/YellowLesson.png" alt="Lesson 2" />
                <span style={{color: "white"}}>ENTER YELLOW BELT</span>
                </a>
              </button>
              <button className="lesson-btn">
                <a href = "/orangebeltlesson" style={{textDecoration: "none"}}>
                <img src="/assets/OrangeLesson.png" alt="Lesson 3" />
                <span style={{color: "white"}}>ENTER ORANGE BELT</span>
                </a>
              </button>
            </nav>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumPage;
