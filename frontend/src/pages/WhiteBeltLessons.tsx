import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../components/Header2.tsx";

// import { storeToken } from "../tokenStorage";
// import { jwtDecode } from "jwt-decode";

const lessons = [
  {
    name: "BLOCKING",
    videoId: "FJPltl4Moag",
    description: "Basic karate blocks, or uke, are \
    essential defensive techniques designed to deflect or \
    neutralize attacks. Rather than absorbing force directly,  \
    these blocks focus on redirecting energy to protect key areas of the body. \
    For high attacks like punches to the face, practitioners use age uke, \
    a rising block that twists upward. For mid-level strikes, both chūdan soto uke \
    (outward block) and chūdan uchi uke (inward block) provide defense through lateral \
    motion across the torso, while morote uke reinforces the block with both arms for \
    added strength. Low attacks such as kicks are countered with gedan barai, a sweeping \
    downward block, or gedan juji uke, which uses crossed arms to trap incoming strikes—similar \
    in structure to jōdan juji uke but aimed at high-level threats. \
    Effective blocking hinges on rotating the forearm and hips for added power, \
    keeping the elbows close for control, and reacting with precise timing. \
    Practicing these through kata drills builds muscle memory and allows the \
    karateka to internalize the principle of “Karate ni sente nashi”—the idea \
    that karate is inherently defensive and never begins with an attack.",
  },
  {
    name: "PUNCHES",
    videoId: "2xN9JKTOWQQ",
    description: "Karate punches are linear, powerful strikes using fists. \
    Choku-zuki is a straight punch from a standing stance. \
    Oi-zuki adds forward motion for extra impact. \
    Gyaku-zuki uses a hip twist for power from the rear hand. \
    Kizami-zuki is a quick jab from the lead hand. \
    Age-zuki targets upward, like an uppercut. \
    Kage-zuki is a hook punch with a circular motion. \
    Mawashi-zuki is a roundhouse punch from the side. \
    Tate-zuki is a vertical punch with palm facing inward. \
    Morote-zuki uses both fists for a double punch. \
    Each punch relies on proper stance, rotation, and timing. \
    Power comes from hips, core, and precise technique. \
    Practice builds speed, accuracy, and muscle memory.",
  },
  {
    name: "KICKS",
    videoId: "8sKklkweXdU",
    description:  "Karate kicks use legs to strike with speed, power, and precision. \
    Mae Geri is a front kick aimed at midsection or head. \
    Yoko Geri is a side kick using the heel for powerful thrusts. \
    Mawashi Geri is a roundhouse kick with circular motion. \
    Ushiro Geri is a back kick delivered behind you. \
    Mikazuki Geri is a crescent kick sweeping in an arc. \
    Kakato Otoshi Geri is an axe kick dropping heel downward. \
    Tobi Geri is a jumping kick for added force and reach. \
    Kin Geri targets the groin with a quick upward snap. \
    Hiza Geri is a knee strike for close-range impact. \
    Each kick relies on balance, hip rotation, and chambering. \
    Practice builds control, flexibility, and explosive power.",
  },
  {
    name: "STANCES",
    videoId: "VIDEO_ID_4",
    description:  "Karate stances provide balance, power, and mobility in techniques, \
    Zenkutsu Dachi is a front stance with weight mostly on the front leg, \
    Kokutsu Dachi is a back stance with weight shifted to the rear leg, \
    Kiba Dachi is a horse stance with feet wide and parallel for stability, \
    Shiko Dachi is similar but with feet angled outward, \
    Neko Ashi Dachi is a cat stance with most weight on the back foot, \
    Sanchin Dachi is an hourglass stance used for rooting and tension, \
    Heiko Dachi is a parallel stance used for readiness and attention, \
    Musubi Dachi is a formal stance with heels together and toes angled out, \
    Fudo Dachi is an immovable stance combining front and horse stance traits, \
    Han Zenkutsu Dachi is a shorter front stance for mobility in sparring, \
    Each stance supports specific strikes, blocks, or evasions, \
    Proper posture, weight distribution, and foot alignment are key, \
    Training stances builds strength, control, and martial awareness",
  },
  {
    name: "GO HO NO UKE",
    videoId: "8vfnP-52X5A",
    description: "Go Ho No Uke means 'Five Blocks Form' in Shito-Ryu Karate, \
    It introduces five fundamental blocking techniques for beginners, \
    Each block teaches timing, positioning, and defensive strategy, \
    The form includes Age Uke for high attacks and Gedan Barai for low strikes, \
    Soto Uke and Uchi Uke cover middle-level defenses from outside and inside, \
    Shuto Uke uses the knife-hand for precise redirection and control, \
    The kata emphasizes fluid transitions and proper stance alignment, \
    It builds muscle memory, awareness, and foundational technique, \
    Practicing Go Ho No Uke develops confidence and defensive reflexes, \
    It serves as a gateway to more advanced katas and applications, \
    The form reflects Shito-Ryu’s blend of hard and soft blocking styles, \
    Each movement is deliberate, teaching control and energy redirection, \
    Go Ho No Uke is often taught early to instill core karate principles",
  },
  {
    name: "EMPI ROPPO",
    videoId: "W5DE-2QsgpI",
    description: "Empi Roppo is a Shito-Ryu kata focused on six distinct elbow strikes, \
    It teaches close-range combat using circular and linear elbow techniques, \
    Strikes include upward, downward, side, rear, spinning, and hooking elbows, \
    The kata emphasizes fluid transitions and strong hip rotation for power, \
    Each movement builds coordination, timing, and explosive energy, \
    Empi Roppo develops awareness of angles and body mechanics in defense, \
    It trains the practitioner to strike while maintaining balance and control, \
    The form is often taught at yellow belt level to build foundational skills, \
    Practicing Empi Roppo improves reaction speed and short-range effectiveness, \
    The kata reflects Shito-Ryu’s blend of precision and dynamic motion, \
    Empi Roppo is a gateway to mastering elbow strikes in advanced applications, \
    Each technique is deliberate, reinforcing posture and striking accuracy, \
    Empi Roppo builds confidence in using elbows for both offense and defense",
  },
  {
    name: "TEN NO KATA",
    videoId: "fxx9OWrROr8",
    description:
      "Ten no Kata means 'Form of Heaven' and was created by Gichin Funakoshi, \
      It introduces basic strikes and blocks in a symmetrical training pattern, \
      The kata is divided into Omote (solo) and Ura (partner) components, \
      Omote begins with four sets of punches: chudan and jodan oi-zuki and gyaku-zuki, \
      It continues with six block-counter combos for chudan and jodan attacks, \
      Techniques include gedan-barai, uchi-uke, shuto-uke, and age-uke with gyaku-zuki, \
      Each move starts from hachiji-dachi and is performed on both sides, \
      Kiai is used with every attack and often with blocks for spirit and focus, \
      Ura applies the same six combos in kihon-ippon-kumite with a partner, \
      The kata teaches timing, posture, and defensive application fundamentals, \
      It bridges kihon and kumite, preparing students for real combat scenarios, \
      Ten no Kata emphasizes balance, rhythm, and martial awareness, \
      It is often taught early to instill core Shotokan principles and discipline,"
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
                  className="h-full bg-white transition-all duration-300"
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

export default WhiteBeltLessons;
