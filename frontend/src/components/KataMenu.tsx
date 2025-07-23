import { useEffect, useState } from "react";
import axios from "axios";

const KataMenu = () => {
  const [expandedBelt, setExpandedBelt] = useState<string | null>("white");
  const [searchTerm, setSearchTerm] = useState("");
  const [kataData, setKataData] = useState<Record<string, string[]>>({
    white: [],
    yellow: [],
    orange: [],
  });

  const jwtToken = localStorage.getItem("jwtToken");

  const handleSearch = async () => {
    try {
      const response = await axios.post("/searchKata", {
        search: searchTerm,
        jwtToken,
      });

      const { results, jwtToken: newToken } = response.data;

      if (newToken) localStorage.setItem("jwtToken", newToken);

      // Group results by belt
      const newKataData: Record<string, string[]> = {
        white: [],
        yellow: [],
        orange: [],
      };

      results.forEach((kata: any) => {
        const belt = kata.Belt.toLowerCase();
        if (newKataData[belt]) {
          newKataData[belt].push(kata.Name);
        }
      });

      setKataData(newKataData);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  // 🔁 Search effect with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch();
    }, 300); // Wait 300ms after typing before firing search

    return () => clearTimeout(timeout); // Clear previous timeout
  }, [searchTerm]);

  const toggleBelt = (belt: string) => {
    setExpandedBelt(expandedBelt === belt ? null : belt);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search"
        className="border p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {["white", "yellow", "orange"].map((belt) => (
        <div key={belt} className="mb-4">
          <button
            onClick={() => toggleBelt(belt)}
            className="font-bold text-lg capitalize"
          >
            {belt} Belt
          </button>
          {expandedBelt === belt && (
            <ul className="ml-4 mt-2 list-disc">
              {kataData[belt].map((kataName, idx) => (
                <li key={idx}>{kataName}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default KataMenu;
