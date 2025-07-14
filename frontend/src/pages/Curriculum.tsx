import Header2 from "../components/Header2.tsx";

const Curriculum = () => {
  return (
    <div>
      <Header2 />
      <div className="page-container">
        <div className="custom-card custom-card-items-centered">
          <div id="redDivCurr" className="redDivLogin">
            <img src="/assets/RearRedPaint.png" id="rearImgCurr"></img>
            <h1 className="bebasFont" id="lessonText">
              SELECT A LESSON
            </h1>
            
            <nav className="lesson-nav" >
              <button className="lesson-btn">
                <a href = "/whitebeltlesson">
                <img src="/assets/WhiteLesson.png" alt="Lesson 1" />
                <span>Lesson 1</span>
                </a>
              </button>
              <button className="lesson-btn">
                <img src="/assets/YellowLesson.png" alt="Lesson 2" />
                <span>Lesson 2</span>
              </button>
              <button className="lesson-btn">
                <img src="/assets/OrangeLesson.png" alt="Lesson 3" />
                <span>Lesson 3</span>
              </button>
            </nav>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Curriculum;
