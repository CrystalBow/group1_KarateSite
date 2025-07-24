import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../components/Header2.tsx";


const lessons = [
  {
    name: "TENSHIN HAPPO 7-8 TRADITIONAL",
    videoId: "fTqnJaLS_RY?si=v5_OwAPvI-EwEmAd&t=399",
    description: "Tenshin Happo means 'Eight Directional Evasion' in Shito-Ryu Karate, \
    It teaches strategic movement to avoid and counter attacks from all angles, \
    Happo 7 uses circular stepping and body rotation to redirect momentum, \
    It emphasizes spinning footwork and kuruma principles for fluid evasion, \
    Happo 8 combines angled retreat with height shifts for layered defense, \
    This drill teaches slipping under or around incoming strikes with precision, \
    Traditional execution focuses on posture, timing, and reactive control, \
    Movements reflect sabaki and tenshin—body shifting and subtle repositioning, \
    These patterns expand spatial awareness and dynamic footwork skills, \
    They prepare practitioners for unpredictable attacks and counters, \
    Tenshin Happo 7–8 deepen understanding of circular motion and energy flow, \
    Training these drills builds confidence in evasive movement and tactical response, \
    They reinforce the principle of “no be there” through elegant redirection,"
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
    name: "PINAN SHODAN",
    videoId: "qNP1pbzXXJs",
    description: "Pinan Shodan means 'Peaceful Mind First Level' and was created by Anko Itosu, \
    It introduces basic blocks, strikes, and stances in a symmetrical pattern, \
    The kata begins in hachiji dachi and uses neko ashi dachi for angled defense, \
    Techniques include soto uke, age uke, tettsui uke, and nukite strikes, \
    It emphasizes reverse body motion to generate power and control, \
    Movements train coordination, timing, and spatial awareness, \
    The form includes front kicks, hammer fists, and knife-hand blocks, \
    Transitions involve 45° and 90° turns to simulate multi-directional defense, \
    Pinan Shodan teaches rhythm, posture, and reactive footwork, \
    It builds foundational skills for the entire Pinan series and beyond, \
    The kata reflects Shito-Ryu’s blend of hard strikes and soft redirections, \
    Each move is deliberate, reinforcing balance and martial intent, \
    Pinan Shodan is often taught early to instill discipline and core technique,"
  },
  {
    name: "ROPPO HO",
    videoId: "MiYJWNg6DSs",
    description: "Roppo Ho means 'Six Directional Kicks' in Shito-Ryu Karate, \
    It teaches six fundamental kicking techniques for versatility and control, \
    Kicks include mae geri, yoko geri, mawashi geri, ushiro geri, mikazuki geri, and kakato otoshi geri, \
    Each kick targets different angles and ranges for offensive and defensive use, \
    The kata emphasizes balance, chambering, and hip rotation for power, \
    Movements are performed from stable stances like zenkutsu and kiba dachi, \
    Roppo Ho builds coordination, flexibility, and directional awareness, \
    It trains students to respond to attacks from multiple directions, \
    The form is often taught at intermediate levels to refine kicking technique, \
    Practicing Roppo Ho improves timing, posture, and reactive footwork, \
    It reflects Shito-Ryu’s blend of linear and circular motion principles, \
    Each kick is deliberate, reinforcing control and striking precision, \
    Roppo Ho prepares practitioners for dynamic sparring and kata application,"
  },
];

const OrangeBeltLessons = () => {
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

          const updatedUser = {
            ...userData,
            progressW: data.progressW,
            progressY: data.progressY,
            progressO: data.progressO,
            // rank: data.rank,
          };
          localStorage.setItem("user_data", JSON.stringify(updatedUser));
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
            progressW: userData.progressW,
            progressY: userData.progressY,
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
            <h2 className="belt-title">ORANGE BELT</h2>
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
                  className="h-full bg-orange-500 transition-all duration-300"
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

            {/* Video */}
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

            {/* Description & Button */}
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

export default OrangeBeltLessons;
