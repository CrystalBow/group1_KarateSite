import { useEffect } from "react";
import Header2 from "../components/Header2.tsx";
import KataMenu from "../components/KataMenu.tsx";

const KatasPage = () => {
  
  useEffect(() => {
    const hash = location.hash;

    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    }
  }, [location]);

  return (
    <div>
      <Header2 />
      <div className="page-container">
        <div className="custom-card">
          <div className="card-scroll-content">
            
            <KataMenu/>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default KatasPage;
