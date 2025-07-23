import { useEffect, useState } from "react";

import Header2 from "../components/Header2.tsx";

const CurriculumPage = () => {
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState({
    white: 0,
    yellow: 0,
    orange: 0,
  });

  useEffect(() => {
    const storedData = localStorage.getItem("user_data");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setUserName(parsed.name);

      setProgress({
        white: Math.round(((parsed.progressW + 1) / 7) * 100), 
        yellow: Math.round(((parsed.progressY + 1) / 4) * 100), 
        orange: Math.round(((parsed.progressO + 1) / 4) * 100), 
      });
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
              WELCOME{userName ? `, ${userName.toUpperCase()}` : ""} SELECT A
              LESSON
            </h1>

            <nav className="lesson-nav">
              <button className="lesson-btn">
                <a href="/whitebeltlesson" style={{ textDecoration: "none" }}>
                  <img src="/assets/WhiteLesson.png" alt="Lesson 1" />
                  <span style={{ color: "white" }}>ENTER WHITE BELT</span>
                  <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${progress.white}%` }}
                    ></div>
                    <p className="text-xs text-white text-right mt-1">{progress.white}% Complete</p>
                  </div>
                </a>
              </button>

              <button className="lesson-btn">
                <a href="/yellowbeltlesson" style={{ textDecoration: "none" }}>
                  <img src="/assets/YellowLesson.png" alt="Lesson 2" />
                  <span style={{ color: "white" }}>ENTER YELLOW BELT</span>
                  <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${progress.yellow}%` }}
                    ></div>
                    <p className="text-xs text-white text-right mt-1">{progress.yellow}% Complete</p>
                  </div>
                </a>
              </button>

              <button className="lesson-btn">
                <a href="/orangebeltlesson" style={{ textDecoration: "none" }}>
                  <img src="/assets/OrangeLesson.png" alt="Lesson 3" />
                  <span style={{ color: "white" }}>ENTER ORANGE BELT</span>
                  <div className="w-full h-2 bg-gray-300 rounded-full mt-1">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{ width: `${progress.orange}%` }}
                    ></div>
                    <p className="text-xs text-white text-right mt-1">{progress.orange}% Complete</p>
                  </div>
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
