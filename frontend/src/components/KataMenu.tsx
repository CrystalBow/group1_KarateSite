import { useState } from "react";

const KataMenu = () => {
  const [expandedBelt, setExpandedBelt] = useState<string | null>("white");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleBelt = (belt: string) => {
    setExpandedBelt(expandedBelt === belt ? null : belt);
  };

  const beltData: Record<string, string[]> = {
    white: ["Go Ho No Uke", "Empi Roppo"],
    yellow: ["Gedan Barai", "Age Uke"],
    orange: ["Shuto Uke", "Mae Geri"],
  };

  const filteredBeltData: Record<string, string[]> = Object.entries(
    beltData
  ).reduce((acc, [belt, katas]) => {
    const filtered = katas.filter((kata) =>
      kata.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0 || searchTerm === "") {
      acc[belt] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: 'url("/assets/RearRedPaint.png")',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '155vh',
        backgroundPosition: 'center bottom',
        overflow: 'hidden',
      }}

    >
      <div className="w-[90vw] max-w-4xl mx-auto mt-16 p-4 rounded-3xl" style={{ 
        maxHeight: '80vh', 
        overflowY: 'auto', 
        backgroundColor:'transparent'
        }}>
        
        <div className="text-center text-2xl bebasFont underline mb-2 text-white">
          KATA
        </div>

        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg border border-gray-300 text-black"
        />

        {Object.entries(filteredBeltData).map(([belt, katas]) => (
          <div key={belt} className="mb-2">
            <button
              className={`w-full text-left px-4 py-2 font-bold text-white flex justify-between items-center bg-[#1f2a38] rounded`}
              onClick={() => toggleBelt(belt)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={`/assets/${belt}Belt.png`}
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
