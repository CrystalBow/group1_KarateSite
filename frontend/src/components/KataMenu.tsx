import { useState } from 'react';

const KataMenu = () => {
  const [expandedBelt, setExpandedBelt] = useState<string | null>('white');

  const toggleBelt = (belt: string) => {
    setExpandedBelt(expandedBelt === belt ? null : belt);
  };

  const beltData = {
    white: ['Go Ho No Uke', 'Empi Roppo'],
    yellow: [],
    orange: [],
  };

  return (
    <div className="rounded-3xl bg-[#f7dec4] w-[90vw] max-w-4xl mx-auto mt-8 p-4 shadow-lg">
      <div className="text-center text-2xl bebasFont underline mb-2">KATA</div>
      <input
        type="text"
        placeholder="Search"
        className="w-full mb-4 p-2 rounded-lg border border-gray-300 text-black"
      />

      {/* Belt Sections */}
      {Object.entries(beltData).map(([belt, katas]) => (
        <div key={belt} className="mb-2">
          <button
            className={`w-full text-left px-4 py-2 font-bold text-white flex justify-between items-center ${
              belt === 'white'
                ? 'bg-[#1f2a38]'
                : belt === 'yellow'
                ? 'bg-[#1f2a38]'
                : 'bg-[#1f2a38]'
            } rounded`}
            onClick={() => toggleBelt(belt)}
          >
            <div className="flex items-center gap-2">
              <img
                src={`/assets/${belt}-belt.png`} // Make sure these belt images exist
                alt={`${belt} belt`}
                className="h-6"
              />
              <span className="bebasFont text-xl uppercase">{belt} belt</span>
            </div>
            <span>{expandedBelt === belt ? '▲' : '▼'}</span>
          </button>

          {expandedBelt === belt && katas.length > 0 && (
            <div className="bg-gray-300 text-black">
              {katas.map((kata, idx) => (
                <div key={idx} className="px-6 py-2 border-t border-black font-bold">
                  {kata}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KataMenu;
