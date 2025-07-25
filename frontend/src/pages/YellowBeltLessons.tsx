import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../components/Header2.tsx";

const lessons = [
  {
    name: "TENSHIN HAPPO 1-6 TRADITIONAL:",
    videoId: "fTqnJaLS_RY?start=0&end=399",
    description: "Tenshin Happo means 'Eight Directional Evasion' in Shito-Ryu Karate, \
    It teaches movement in multiple directions to avoid and counter attacks, \
    Happo 1 uses high block with grab and counter to redirect force, \
    Happo 2 defends side punch with snap kick targeting the knee, \
    Happo 3 applies middle block with pull and strike for control, \
    Happo 4 responds to shoulder grabs with close-range counters, \
    Happo 5 handles aggressive grabs using elbows and takedowns, \
    Happo 6 escapes wrist grabs with blocks and follow-up strikes, \
    Each drill builds awareness, balance, and reactive footwork, \
    The form emphasizes practical self-defense in realistic scenarios, \
    It develops timing, positioning, and fluid transitions under pressure, \
    Tenshin Happo reinforces the principle of moving off the attack line, \
    Training these drills improves confidence and defensive reflexes,"
  },
  {
    name: "BASIC COMBINATIONS",
    videoId: "gIcix72-XC0",
    description: "Basic karate combinations build fluidity, timing, and offensive strategy, \
    Maegeri to Gyakuzuki teaches front kick followed by reverse punch, \
    Oi-zuki to Mae Geri blends forward punch with a front kick counter, \
    Soto Uke to Gyakuzuki trains block and punch from side defense, \
    Uchi Uke to Kizami-zuki to Gyakuzuki layers inside block with double punches, \
    Age Uke to Gyakuzuki to Gedan Barai covers high block, punch, and low sweep, \
    Shuto Uke to Nukite sharpens knife-hand block into spear-hand strike, \
    Sanbon Zuki drills triple punch with shifting stances and hip rotation, \
    Combinations improve reaction speed and transition between techniques, \
    They reinforce stances, breathing, and proper chambering mechanics, \
    Practicing combos develops rhythm, control, and martial awareness,"
  },
  {
    name: "CAT STANCE",
    videoId: "kHIUkFahyKA",
    description: "Cat stance, or Neko Ashi Dachi, is a foundational karate position, \
    It places 90% of body weight on the back leg for balance and control, \
    The front foot stays light, ready for quick kicks, sweeps, or movement, \
    This stance mimics a cat poised to strike—alert, agile, and grounded, \
    It enhances mobility, allowing fast transitions and evasive maneuvers, \
    The back leg acts as an anchor while the front leg remains reactive, \
    Proper form includes bent knees, upright posture, and aligned hips, \
    The stance supports both defensive blocks and offensive counters, \
    It trains timing, posture, and weight distribution under pressure, \
    Practicing cat stance builds stability, awareness, and readiness, \
    It appears in many katas and self-defense drills across karate styles, \
    Mastering Neko Ashi Dachi improves footwork and short-range technique, \
    Its subtle power makes it a strategic tool for both offense and defense,"
  },
  {
    name: "CHI NO KATA",
    videoId: "0R3zHQ59rd4",
    description: "Chi no Kata means 'Earth Form' and is practiced in Shito-Ryu Karate, \
    It introduces basic stances, blocks, strikes, and directional movement, \
    The kata begins in Musubi Dachi and transitions through Heiko and Zenkutsu Dachi, \
    Techniques include Age Uke, Gedan Barai, Soto Uke, and Oi Zuki punches, \
    It incorporates Mae Geri kicks and Tate Empi elbow strikes for variety, \
    Movements follow angular steps with 45° and 90° turns for spatial awareness, \
    Shiko Dachi is used for grounded defense and Gedan Barai countering, \
    Morote Zuki appears with simultaneous high and low punches for impact, \
    Yoko Shuto Uchi adds knife-hand strikes from Heiko Dachi stance, \
    Kiai is used to emphasize key strikes and build spirit and focus, \
    The kata teaches rhythm, balance, and coordination across directions, \
    Chi no Kata builds foundational skills for more advanced Shito-Ryu forms, \
    It reinforces posture, timing, and the principle of rooted technique,"
  },
];

const YellowBeltLessons = () => {
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

        if (data.progressY !== undefined) {
          setUnlockedCount(data.progressY);
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

  const updateUserProgress = async (newProgressY: number) => {
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
            progressW: userData.progressW,
            progressY: newProgressY,
            progress0: userData.progressO,
            jwtToken,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Error updating progress:", data.error);
      } else {
        if (data.progressY !== undefined) {
          setUnlockedCount(data.progressY);
          const updatedUser = {
            ...userData,
            progressW: data.progressW,
            progressY: data.progressY,
            progressO: data.progressO,
            rank: data.rank,
          };
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
        }
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

  const progressPercentage = Math.round(
    ((unlockedCount + 1) / lessons.length) * 100
  );

  return (
    <div>
      <Header2 />
      <div className="page-container">
        <div className="custom-card whitebelt-container">
          {/* LEFT SIDEBAR */}
          <div className="whitebelt-sidebar overflow-y-auto max-h-[75vh] p-2">
            <h2 className="belt-title">YELLOW BELT</h2>
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
            
            {/* PROGRESS BAR */}
            <div className="w-full mb-4">
              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-right text-white mt-1">
                {progressPercentage}% Complete
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
                {Array(1)
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

export default YellowBeltLessons;
