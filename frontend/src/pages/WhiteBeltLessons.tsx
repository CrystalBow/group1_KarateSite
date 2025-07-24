import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../components/Header2.tsx";

// import { storeToken } from "../tokenStorage";
// import { jwtDecode } from "jwt-decode";

const lessons = [
  {
    name: "BLOCKING",
    videoId: "FJPltl4Moag",
    description: "Down Block is one of the main five blocks...",
  },
  {
    name: "PUNCHES",
    videoId: "2xN9JKTOWQQ",
    description: "Punches are essential techniques in Karate...",
  },
  {
    name: "KICKS",
    videoId: "8sKklkweXdU",
    description: "Kicks involve powerful leg movements...",
  },
  {
    name: "STANCES",
    videoId: "VIDEO_ID_4",
    description: "Stances are the foundation of all techniques...",
  },
  {
    name: "GO HO NO UKE",
    videoId: "8vfnP-52X5A",
    description: "Go Ho No Ukei is a part of a set sequence of movements and techniques...",
  },
  {
    name: "EMPI ROPPO",
    videoId: "W5DE-2QsgpI",
    description:
      "Empi Roppo is a part of a set sequence of movements and techniques...",
  },
  {
    name: "TEN NO KATA",
    videoId: "fxx9OWrROr8",
    description:
      "Ten No Kata is a part of a set sequence of movements and techniques...",
  },
  
];

const WhiteBeltLessons = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lessonQuery = queryParams.get("lesson");

  useEffect(() => {
    const fetchUserProgress = async () => {
      const jwtToken = localStorage.getItem("token");
      const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
      const id = userData.id;

      const indexFromQuery = lessons.findIndex(
        (l) =>
          l.name.toLowerCase().trim() ===
          (lessonQuery ?? "").toLowerCase().trim()
      );
      if (indexFromQuery !== -1) {
        setCurrentLessonIndex(indexFromQuery);
      }

      if (!id) {
        console.warn("Missing user ID");
        return;
      }
      if (!jwtToken) {
        console.warn("Missing token");
      }

      try {
        const response = await fetch(
          "http:///143.198.160.127:5000/api/getUserProgress",
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

        if (data.progressW !== undefined) {
          setUnlockedCount(data.progressW);

          const updatedUser = {
            ...userData,
            progressW: data.progressW,
            progressY: data.progressY,
            progressO: data.progressO,
          };
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
        }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      }
    };

    fetchUserProgress();
  }, [lessonQuery]);

  const updateUserProgress = async (newProgressW: number) => {
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            progressW: newProgressW,
            progressY: userData.progressY,
            progress0: userData.progressO,
            jwtToken,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Error updating progress:", data.error);
      } else {
        if (data.progressW !== undefined) {
          setUnlockedCount(data.progressW);

          const updatedUser = {
            ...userData,
            progressW: data.progressW,
            progressY: data.progressY,
            progressO: data.progressO,
            rank: data.rank,
          };
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
        }

        //storeToken(data.jwtToken); //test
      }
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  const handleNext = async () => {
    if (currentLessonIndex < lessons.length - 1) {
      const newLessonIndex = currentLessonIndex + 1;
      const newUnlockedCount = Math.max(unlockedCount, newLessonIndex);
      setCurrentLessonIndex(newLessonIndex);
      setUnlockedCount(newUnlockedCount);
      await updateUserProgress(newUnlockedCount);
    }
  };

  const progressPercent = Math.round(
    ((unlockedCount + 1) / lessons.length) * 100
  );

  return (
    <div>
      <Header2 />
      <div className="page-container">
        <div className="custom-card whitebelt-container">
          {/* LEFT SIDEBAR */}
          <div className="whitebelt-sidebar overflow-y-auto max-h-[75vh] p-2">
            <h2 className="belt-title">WHITE BELT</h2>
            {lessons.map((lesson, index) => {
              const unlocked = index < unlockedCount + 1;
              return (
                <button
                  key={lesson.name}
                  className={`lesson-section ${
                    unlocked ? "unlocked" : "locked"
                  } ${currentLessonIndex === index ? "selected" : ""}`}
                  onClick={() => {
                    if (unlocked) setCurrentLessonIndex(index);
                  }}
                >
                  {unlocked ? lesson.name : `🔒 ${lesson.name}`}
                </button>
              );
            })}

             {/* Progress Bar */}
            <div className="w-full mb-4">
              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-right text-white mt-1">
                {progressPercent}% Complete
              </p>
            </div>
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
                {Array(6)
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

export default WhiteBeltLessons;
