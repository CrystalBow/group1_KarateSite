import { useState, useEffect } from "react";

const KataMenu = () => {
  const [expandedBelt, setExpandedBelt] = useState<string | null>("white");
  const [searchTerm, setSearchTerm] = useState("");
  const [kataData, setKataData] = useState<Record<string, string[]>>({
    white: [],
    yellow: [],
    orange: [],
  });

  const toggleBelt = (belt: string) => {
    setExpandedBelt(expandedBelt === belt ? null : belt);
  };

  // Fetch data from server
  const handleSearch = async () => {
    const token = localStorage.getItem("token");

    const app_name = "karatemanager.xyz";
    function buildPath(route: string): string {
      if (process.env.NODE_ENV != "development") {
        return "http://" + app_name + ":5000/" + route;
      } else {
        return "http://localhost:5000/" + route;
      }
    }

    try {
      const res = await fetch(buildPath("api/searchKata"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: searchTerm,
          jwtToken: token,
        }),
      });

      const data = await res.json();

      // check for token expiration / errors
      if (data.error) {
        console.error("Error from server:", data.error);
        return;
      }

      const formatted: Record<string, string[]> = {
        white: [],
        yellow: [],
        orange: [],
      };

      data.results.forEach((item: { Name: string; Belt: string }) => {
        const belt = item.Belt.toLowerCase();
        if (formatted[belt]) {
          formatted[belt].push(item.Name);
        }
      });

      setKataData(formatted);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  // Optionally fetch all kata on first load
  useEffect(() => {
    handleSearch(); // initial load
  }, []);

  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: 'url("/assets/RearRedPaint.png")',
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "155vh",
        backgroundPosition: "center bottom",
        overflow: "hidden",
      }}
    >
      <div
        className="w-[90vw] max-w-4xl mx-auto mt-16 p-4 rounded-3xl"
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          backgroundColor: "transparent",
        }}
      >
        <div className="text-center text-2xl bebasFont underline mb-2 text-white">
          KATA
        </div>

        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(); // Trigger search on change
          }}
          className="w-full mb-4 p-2 rounded-lg border border-gray-300 text-black"
        />

        {Object.entries(kataData).map(([belt, katas]) => (
          <div key={belt} className="mb-2">
            <button
              className={`w-full text-left px-4 py-2 font-bold text-white flex justify-between items-center bg-[#1f2a38] rounded`}
              onClick={() => toggleBelt(belt)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={`/assets/${
                    belt.charAt(0).toUpperCase() + belt.slice(1)
                  }Belt.png`}
                  alt={`${belt} belt`}
                  className="h-6"
                />
                <span className="bebasFont text-xl uppercase">{belt} belt</span>
              </div>
              <span>{expandedBelt === belt ? "▲" : "▼"}</span>
            </button>

            {expandedBelt === belt && (
              <div className="bg-gray-300 text-black">
                {katas.length === 0 ? (
                  <div className="px-6 py-2 border-t border-black italic">
                    No matches
                  </div>
                ) : (
                  katas.map((kata, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-2 border-t border-black font-bold"
                    >
                      {kata}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KataMenu;
