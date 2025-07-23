import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header1 from "../components/Header1.tsx";

interface TeamMember {
  name: string;
  role: string;
  img: string;
}

const teamMembers: TeamMember[] = [
  { name: "Victor", role: "Front End (Web)", alt="Photo of Victor",    img: "/assets/Victor.jpg" },
  { name: "Taha",   role: "Front End (Web)", alt="Photo of Taha",    img: "/assets/taha.jpg" },
  { name: "Chris",  role: "Front End (Mobile)", alt="Photo of Chris", img: "/assets/chris.jpg" },
  { name: "Davage", role: "Database", alt="Photo of Davage",           img: "/assets/davage.jpg" },
  { name: "Yimer",  role: "API", alt="Photo of Yimer",                img: "/assets/yimer.jpg" },
  { name: "Elijah", role: "API", alt="Photo of Elijah",                img: "/assets/elijah.jpg" },
  { name: "Jereme", role: "API", alt="Photo of Jereme",                img: "/assets/jereme.jpg" },
];



// Sticky banner
const AboutHeader: React.FC<{ label: string }> = ({ label }) => (
  <div className="AboutHeader">
    <h2 className="AboutHeader-label">{label}</h2>
  </div>
);


// Team card
const TeamCard: React.FC<{ member: TeamMember }> = ({ member: m }) => (
  <div className="team-member">
    <div className="team-member-frame-with-belt">
      <div className="team-member-frame">
        <img src={m.img} alt={m.name} />
      </div>
      <div className="team-belt-wrapper">
        <img
          src={"/assets/BlackBelt.png"}
          alt=""                // decorative
          aria-hidden="true"
          className="team-belt-img"
        />
      </div>
    </div>
    <div className="team-member-name">{m.name.toUpperCase()}</div>
    <div className="team-member-role">{m.role}</div>
  </div>
);


// Team grid
const TeamGrid: React.FC = () => {
  const top = teamMembers.slice(0, 4);
  const bottom = teamMembers.slice(4);

  return (
    <div className="team-grid-rows">
      <div className="team-grid-top">
        {top.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </div>
      <div className="team-grid-bottom">
        {bottom.map((m) => (
          <TeamCard key={m.name} member={m} />
        ))}
      </div>
    </div>
  );
};


// Thanks section (RearRedPaint image centered)
const ThanksSection: React.FC = () => (
  <div className="thanks-section">
    <p className="thanks-heading">{
    "SPECIAL THANKS TO NORTHWIND MATERIAL ARTS ACADEMY AND SENSEI JAMES FOR PROVIDING THE CONTENT FOR THIS PROJECT"}</p>
    <img
      className="thanks-paint"
      src={"/assets/NorthWindLogo.png"}
      alt=""                // decorative
      aria-hidden="true"
    />

    <img
      className="thanks-extra-img"
      src={"/assets/SenseiPhoto.png"}
      alt="Kyoshi James Taylor"  // change alt text as needed
    />

  </div>
);


// About page
const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => navigate("/login");

  // Scrolling
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, []);

  return (
    <div>
      <Header1 action="LOG IN" onAction={handleLogin} />
      <div className="page-container">
        <div className="custom-card about-card">
          <div className="card-scroll-content about-scroll">
            <AboutHeader label="ABOUT US" />
            <section id="team" className="about-section">
              <TeamGrid />
            </section>
            <section id="thanks" className="about-section">
              <ThanksSection />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
