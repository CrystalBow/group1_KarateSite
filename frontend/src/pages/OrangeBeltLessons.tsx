import { useState, useEffect } from "react";
import Header2 from "../components/Header2.tsx";

const lessons = [
  {
    name: "TENCHI HAPPO 7-8 TRADITIONAL",
    videoId: "fTqnJaLS_RY?si=v5_OwAPvI-EwEmAd&t=399",
    description: "Tenchi happos oat...",
  },
  {
    name: "CAT STANCE",
    videoId: "kHIUkFahyKA",
    description: "cooler meow...",
  },
  {
    name: "PINAN SHODAN",
    videoId: "qNP1pbzXXJs",
    description: "Pinan Shodan cool...",
  },
  {
    name: "ROPPO HO",
    videoId: "MiYJWNg6DSs",
    description: "Roppo Ho...",
  },
];

const OrangeBeltLessons = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(1);

  useEffect(() => {
    const fetchUserProgress = async () => {
      const jwtToken = localStorage.getItem("token");

      const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
      const id = userData.id;

      console.log(localStorage.getItem("token"));
      console.log(id);

      if (!jwtToken || !id) {
        console.warn("Missing token or user ID");
        return;
      }

      try {
        const response = await fetch(
          "http://143.198.160.127:5000/api/getUserProgress",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, jwtToken }),
          }
        );

        const data = await response.json();

        if (data.error === "The JWT is no longer valid") {
          localStorage.removeItem("token");

          console.warn("Session expired. Please log in again.");
          return;
        }

        if (data.progressO !== undefined) {
          setUnlockedCount(data.progressO);
        }

        // if (data.jwtToken && data.jwtToken.trim() !== "") {
        //   localStorage.setItem("token", data.jwtToken);
        // }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };

    fetchUserProgress();
  }, []);

  const updateUserProgress = async (newProgressO: number) => {
    const jwtToken = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
    const id = userData.id;

    if (!jwtToken || !id) {
      console.warn("Missing token or user ID");
      return;
    }

    try {
      const response = await fetch(
        "http:///143.198.160.127:5000/api/updateProgress",
        {
          //i decided to just  hardcode path instead of using buildpath lol
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            progressO: newProgressO,
            jwtToken,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Error updating progress:", data.error);
      } else {
        // if (data.jwtToken && data.jwtToken.trim() !== "") {
        //   localStorage.setItem("token", data.jwtToken);
        // }
        if (data.progressO !== undefined) {
          setUnlockedCount(data.progressO);
        }
      }
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  const handleNext = async () => {
    if (currentLessonIndex < lessons.length - 1) {
      const newLessonIndex = currentLessonIndex + 1;
      const newUnlockedCount = Math.max(unlockedCount, newLessonIndex + 1);

      setCurrentLessonIndex(newLessonIndex);
      setUnlockedCount(newUnlockedCount);

      await updateUserProgress(newUnlockedCount);
    }
  };

  return (
    <div>
      <Header2 />
      <div className="page-container">
        <div className="custom-card whitebelt-container">
          {/* LEFT SIDEBAR */}
          <div className="whitebelt-sidebar">
            <h2 className="belt-title">WHITE BELT</h2>
            {lessons.map((lesson, index) => (
              <button
                key={lesson.name}
                className={`lesson-section ${
                  index < unlockedCount ? "unlocked" : "locked"
                }`}
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
              CURRENT LESSON:{" "}
              <span className="highlight">
                {lessons[currentLessonIndex].name}
              </span>
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
                {Array(4)
                  .fill(lessons[currentLessonIndex].description)
                  .map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
              </div>
              {currentLessonIndex < lessons.length - 1 ? (
                <button className="next-btn" onClick={handleNext}>
                  Next
                </button>
              ) : (
                <p
                  className="next-btn"
                  style={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  All lessons complete
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrangeBeltLessons;
