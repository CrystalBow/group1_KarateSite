import { useState } from "react";
import Header2 from "../components/Header2.tsx";

const lessons = [
  {
    name: "TENCHI HAPPO 7-8 TRADITIONAL",
    videoId: "fTqnJaLS_RY?si=v5_OwAPvI-EwEmAd&t=399",
    description: "Tenchi happos oat..."
  },
  {
    name: "CAT STANCE",
    videoId: "kHIUkFahyKA",
    description: "cooler meow..."
  },
  {
    name: "PINAN SHODAN",
    videoId: "qNP1pbzXXJs",
    description: "Pinan Shodan cool..."
  },
  {
    name: "ROPPO HO",
    videoId: "MiYJWNg6DSs",
    description: "Roppo Ho..."
  },
];

const OrangeBeltLessons = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(1);

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setUnlockedCount(prev => Math.max(prev, currentLessonIndex + 2));
    }
  };

  return (
    <div>
      <Header2 profileImg="/assets/ProfileWhiteBelt.png" beltText="White Belt"/>
      <div className="page-container">
        <div className="custom-card whitebelt-container">
          {/* LEFT SIDEBAR */}
          <div className="whitebelt-sidebar">
            <h2 className="belt-title">WHITE BELT</h2>
            {lessons.map((lesson, index) => (
              <button
                key={lesson.name}
                className={`lesson-section ${index < unlockedCount ? "unlocked" : "locked"}`}
                onClick={() => {
                  if (index < unlockedCount) {
                    setCurrentLessonIndex(index);
                  }
                }}
              >
                {index < unlockedCount ? lesson.name : `🔒 ${lesson.name}`}
              </button>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="whitebelt-lesson-area">
            <h3 className="lesson-title">
              CURRENT LESSON: <span className="highlight">{lessons[currentLessonIndex].name}</span>
            </h3>
            <div className="video-container">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${lessons[currentLessonIndex].videoId}`}
                title="Lesson Video"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <div className="lesson-description-box">
              <div className="scrollable-text">
                {Array(6).fill(lessons[currentLessonIndex].description).map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
              {currentLessonIndex < lessons.length - 1 ? (
                <button className="next-btn" onClick={handleNext}>Next</button>
              ) : (
                <p className="next-btn" style={{ opacity: 0.5, cursor: "not-allowed" }}>All lessons complete</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrangeBeltLessons;
