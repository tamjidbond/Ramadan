import React, { useState, useEffect } from 'react';

const divisions = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];

function App() {
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [data, setData] = useState(null);

  const fetchTimings = async (city) => {
    // method=1 (Karachi/Islamic Foundation style) | school=1 (Hanafi)
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=1&school=1`;
    const res = await fetch(url);
    const json = await res.json();
    setData(json.data.timings);
  };

  useEffect(() => {
    fetchTimings(selectedCity);
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-[#050a14] text-gray-100 flex flex-col items-center p-6">
      <header className="text-center my-10">
        <h1 className="text-4xl font-bold text-emerald-500 mb-2">Ramadan 2026</h1>
        <p className="text-gray-400">Official Bangladesh Timings</p>
      </header>

      {/* Division Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {divisions.map(city => (
          <button 
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-2 rounded-full border ${selectedCity === city ? 'bg-emerald-600 border-emerald-500' : 'border-gray-700 hover:border-emerald-500'} transition-all text-sm`}
          >
            {city}
          </button>
        ))}
      </div>

      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Sehar Card */}
          <div className="bg-gray-900 border border-emerald-500/30 p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🌙</div>
            <h3 className="text-emerald-500 font-bold tracking-tighter uppercase text-sm">Sehri Last Time</h3>
            <p className="text-6xl font-black mt-2">{data.Fajr}</p>
            <p className="text-gray-500 mt-4 text-xs italic">* Times may vary by 1-2 mins per Islamic Foundation</p>
          </div>

          {/* Iftar Card */}
          <div className="bg-gray-900 border border-orange-500/30 p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">☀️</div>
            <h3 className="text-orange-500 font-bold tracking-tighter uppercase text-sm">Iftar / Maghrib</h3>
            <p className="text-6xl font-black mt-2">{data.Maghrib}</p>
            <p className="text-gray-500 mt-4 text-xs italic">* Based on local sun setting in {selectedCity}</p>
          </div>
        </div>
      ) : (
        <div className="animate-pulse text-emerald-500">Loading Timings...</div>
      )}
    </div>
  );
}

export default App;