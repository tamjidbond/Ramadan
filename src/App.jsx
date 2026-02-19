import { useState, useEffect } from "react";
import {
  MapPin, Moon, Sun, Clock, Download, Share2, Heart,
  Cloud, Wind, Droplets, Sunrise, Sunset, Star, Layers,
  Zap, AlertCircle, RefreshCw, Volume2, VolumeX,
  Thermometer, Settings, ChevronRight, X, Calendar,
  Coffee, Utensils, Award, Bell, Info
} from "lucide-react";

/* ─── বাংলা কনস্ট্যান্ট ───────────────────────────────── */
const PRAYERS = [
  { name: "ফজর", key: "Fajr", icon: "🌙" },
  { name: "সূর্যোদয়", key: "Sunrise", icon: "🌅" },
  { name: "যোহর", key: "Dhuhr", icon: "☀️" },
  { name: "আসর", key: "Asr", icon: "🌤️" },
  { name: "মাগরিব", key: "Maghrib", icon: "🌇" },
  { name: "ইশা", key: "Isha", icon: "🌌" }
];

const POPULAR_CITIES = [
  "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", 
  "বরিশাল", "রংপুর", "ময়মনসিংহ", "কুমিল্লা", "নারায়ণগঞ্জ"
];

const METHODS = [
  { id: 1, name: "ইসলামিক সায়েন্স ইউনিভার্সিটি, করাচী" },
  { id: 2, name: "ইসলামিক সোসাইটি অফ নর্থ আমেরিকা (ISNA)" },
  { id: 3, name: "মুসলিম ওয়ার্ল্ড লীগ" },
  { id: 4, name: "উম্মুল কুরা, মক্কা" },
  { id: 5, name: "ইজিপশিয়ান জেনারেল অথরিটি" },
  { id: 7, name: "তেহরান ইউনিভার্সিটি" },
];

const WEEKDAYS = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const MONTHS = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

/* ─── বাংলা সংখ্যা রূপান্তর ─────────────────────────── */
const toBengaliNumber = (num) => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, d => bengaliDigits[parseInt(d)]);
};

const formatBengaliTime = (timeStr) => {
  if (!timeStr) return '--:--';
  return timeStr.split(':').map(toBengaliNumber).join(':');
};

/* ─── স্টার ফিল্ড ───────────────────────────────────── */
const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

/* ─── কম্পোনেন্ট ────────────────────────────────────── */
const GoldText = ({ children, className = "" }) => (
  <span className={`gold-shimmer ${className}`}>{children}</span>
);

const Card = ({ children, className = "", glow = false, onClick }) => (
  <div
    className={`card ${glow ? "card-glow" : ""} ${className}`}
    onClick={onClick}
    style={onClick ? { cursor: "pointer" } : undefined}
  >
    {children}
  </div>
);

/* ─── মেইন অ্যাপ ────────────────────────────────────── */
export default function RamadanUltra() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [timings, setTimings] = useState(null);
  const [ramadanData, setRamadanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState(1);
  const [school, setSchool] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unit, setUnit] = useState("12h");
  const [currentCity, setCurrentCity] = useState("");
  const [rozaCount, setRozaCount] = useState(1);
  const [showCountdown, setShowCountdown] = useState(true);

  // লোকালস্টোরেজ থেকে ফেবারিট লোড
  useEffect(() => {
    const saved = localStorage.getItem('ramadan-favorites-bd');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // ফেবারিট সেভ
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('ramadan-favorites-bd', JSON.stringify(favorites));
    }
  }, [favorites]);

  // ঘড়ি আপডেট
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // পরবর্তী নামাজ নির্ণয়
  useEffect(() => {
    if (!timings) return;
    
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const prayerList = PRAYERS.map(p => p.key);
    
    for (const p of prayerList) {
      if (!timings[p]) continue;
      const [h, m] = timings[p].split(":").map(Number);
      const pt = h * 60 + m;
      
      if (pt > now) {
        const diff = pt - now;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        
        let diffText = '';
        if (hours > 0) {
          diffText = `${toBengaliNumber(hours)} ঘন্টা ${toBengaliNumber(minutes)} মিনিট`;
        } else {
          diffText = `${toBengaliNumber(minutes)} মিনিট`;
        }
        
        const bengaliName = PRAYERS.find(pr => pr.key === p)?.name || p;
        setNextPrayer({ 
          name: bengaliName, 
          originalName: p,
          time: timings[p], 
          diff: diffText,
          diffMinutes: diff
        });
        return;
      }
    }
    
    // আগামীকালের ফজর
    const fajrName = PRAYERS.find(p => p.key === 'Fajr')?.name || 'ফজর';
    setNextPrayer({ 
      name: `${fajrName} (আগামীকাল)`, 
      originalName: 'Fajr',
      time: timings?.Fajr, 
      diff: 'আগামীকাল',
      diffMinutes: 24 * 60
    });
  }, [timings, currentTime]);

  // ইফতার ও সাহরির কাউন্টডাউন
  const getCountdowns = () => {
    if (!timings || !nextPrayer) return { iftar: null, sehar: null };
    
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const iftarTime = timings.Maghrib?.split(':').map(Number);
    const seharTime = timings.Fajr?.split(':').map(Number);
    
    let iftarDiff = null;
    let seharDiff = null;
    
    if (iftarTime) {
      const iftarMins = iftarTime[0] * 60 + iftarTime[1];
      if (iftarMins > now) {
        const diff = iftarMins - now;
        iftarDiff = {
          hours: Math.floor(diff / 60),
          minutes: diff % 60,
          text: diff >= 60 ? 
            `${toBengaliNumber(Math.floor(diff/60))} ঘন্টা ${toBengaliNumber(diff%60)} মিনিট` : 
            `${toBengaliNumber(diff)} মিনিট`
        };
      }
    }
    
    if (seharTime) {
      const seharMins = seharTime[0] * 60 + seharTime[1];
      if (seharMins > now) {
        const diff = seharMins - now;
        seharDiff = {
          hours: Math.floor(diff / 60),
          minutes: diff % 60,
          text: diff >= 60 ? 
            `${toBengaliNumber(Math.floor(diff/60))} ঘন্টা ${toBengaliNumber(diff%60)} মিনিট` : 
            `${toBengaliNumber(diff)} মিনিট`
        };
      }
    }
    
    return { iftar: iftarDiff, sehar: seharDiff };
  };

  // সিটি সাজেশন
  const fetchSuggestions = async (q) => {
    if (q.length < 2) { setSuggestions([]); return; }
    
    // বাংলা সিটির জন্য ফিল্টার
    const filtered = POPULAR_CITIES
      .filter(city => city.includes(q))
      .map(city => ({ city, country: "বাংলাদেশ" }));
    
    setSuggestions(filtered);
  };

  // টাইমিংস ফেচ
  const fetchTimings = async (searchCity = city) => {
    if (!searchCity.trim()) { 
      setError("দয়া করে একটি শহরের নাম লিখুন"); 
      return; 
    }
    
    setLoading(true); 
    setError(null); 
    setSuggestions([]);
    
    // ইংরেজিতে সিটি নাম ম্যাপিং
    const cityMap = {
      "ঢাকা": "Dhaka",
      "চট্টগ্রাম": "Chittagong",
      "খুলনা": "Khulna",
      "রাজশাহী": "Rajshahi",
      "সিলেট": "Sylhet",
      "বরিশাল": "Barisal",
      "রংপুর": "Rangpur",
      "ময়মনসিংহ": "Mymensingh",
      "কুমিল্লা": "Comilla",
      "নারায়ণগঞ্জ": "Narayanganj"
    };
    
    const cityEn = cityMap[searchCity] || searchCity;
    
    try {
      // আজকের টাইমিংস
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityEn)}&country=Bangladesh&method=${method}&school=${school}`;
      
      const r = await fetch(url);
      if (!r.ok) throw new Error();
      const j = await r.json();
      
      setTimings(j.data.timings);
      setCurrentCity(searchCity);
      setCity(searchCity);
      
      // হিজরি তারিখ
      const date = new Date();
      const hijriUrl = `https://api.aladhan.com/v1/gToH?date=${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
      const hijriRes = await fetch(hijriUrl);
      const hijriData = await hijriRes.json();
      
      if (hijriData.data) {
        setRamadanData({
          hijriDay: hijriData.data.hijri.day,
          hijriMonth: hijriData.data.hijri.month.en,
          hijriYear: hijriData.data.hijri.year,
          weekday: hijriData.data.hijri.weekday.en
        });
      }
      
      // রোজা সংখ্যা হিসাব (আনুমানিক)
      const hijriDay = parseInt(hijriData.data?.hijri.day || '1');
      if (hijriData.data?.hijri.month.en === 'Ramadan') {
        setRozaCount(hijriDay);
      } else {
        setRozaCount(1);
      }
      
      // ওয়েদার ডাটা (ডেমো)
      setWeather({
        temp: 28 + Math.floor(Math.random() * 5),
        humidity: 70 + Math.floor(Math.random() * 15),
        wind: 5 + Math.floor(Math.random() * 8),
        feelsLike: 30 + Math.floor(Math.random() * 5)
      });
      
    } catch {
      setError("সময় পাওয়া যায়নি। দয়া করে শহরের নাম চেক করুন।");
    } finally { 
      setLoading(false); 
    }
  };

  // ফেবারিট টগল
  const toggleFavorite = () => {
    if (!currentCity) return;
    
    const cityData = {
      name: currentCity,
      method,
      school,
      lastVisited: new Date().toISOString()
    };
    
    setFavorites(prev => {
      const exists = prev.find(f => f.name === currentCity);
      if (exists) {
        return prev.filter(f => f.name !== currentCity);
      } else {
        return [cityData, ...prev].slice(0, 10);
      }
    });
  };

  const isFav = favorites.some(f => f.name === currentCity);

  // ফেবারিট থেকে লোড
  const loadFromFavorite = (favCity) => {
    setCity(favCity.name);
    setMethod(favCity.method || 1);
    setSchool(favCity.school || 0);
    fetchTimings(favCity.name);
  };

  // ডাটা এক্সপোর্ট
  const exportData = () => {
    if (!timings) return;
    
    const data = {
      city: currentCity,
      date: currentTime.toLocaleDateString('bn-BD'),
      hijriDate: ramadanData ? `${ramadanData.hijriDay} ${ramadanData.hijriMonth} ${ramadanData.hijriYear}` : '',
      roza: toBengaliNumber(rozaCount),
      timings: {
        sehar: timings.Fajr,
        iftar: timings.Maghrib,
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha
      },
      method: METHODS.find(m => m.id === method)?.name,
      school: school === 0 ? 'হানাফি' : 'শাফিঈ',
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `রমজান-${currentCity}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // শেয়ার
  const share = async () => {
    if (!timings) return;
    
    const countdowns = getCountdowns();
    const iftarCountdown = countdowns.iftar ? `\n⏳ ইফতার হতে ${countdowns.iftar.text}` : '';
    
    const text = `🕌 রমজান টাইমিংস - ${currentCity}
    
📅 তারিখ: ${currentTime.toLocaleDateString('bn-BD')}
🌙 রমজান: ${toBengaliNumber(rozaCount)}তম রোজা

🌅 সাহরী (ফজর): ${formatBengaliTime(timings.Fajr)}
🌇 ইফতার (মাগরিব): ${formatBengaliTime(timings.Maghrib)}${iftarCountdown}

🕋 পরবর্তী নামাজ: ${nextPrayer?.name} - ${formatBengaliTime(nextPrayer?.time)}

রমজান মোবারক! 🌙`;
    
    if (navigator.share) {
      try { 
        await navigator.share({ 
          title: `রমজান টাইমিংস — ${currentCity}`, 
          text, 
          url: window.location.href 
        }); 
      } catch {}
    } else {
      navigator.clipboard?.writeText(text);
      alert('টাইমিংস কপি করা হয়েছে!');
    }
  };

  // টাইম ফরম্যাট
  const fmt = (t) => {
    if (!t) return "--:--";
    if (unit === "24h") return t;
    
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${toBengaliNumber(hour12)}:${toBengaliNumber(m)} ${ampm}`;
  };

  const countdowns = getCountdowns();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Baloo+Da2:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: 'Hind Siliguri', 'Baloo Da 2', sans-serif; 
          background: #0a0e1a; 
          color: #e2d4b8; 
        }

        :root {
          --gold: #c9a84c;
          --gold-light: #f5d78e;
          --gold-dim: #7a6030;
          --emerald: #2d9b6f;
          --emerald-light: #4ecca3;
          --emerald-dim: #1a5c40;
          --bg: #0a0e1a;
          --surface: rgba(255,255,255,0.04);
          --border: rgba(201,168,76,0.2);
          --text: #e2d4b8;
          --muted: #9a8a6a;
        }

        /* ব্যাকগ্রাউন্ড */
        .bg-fixed {
          position: fixed; inset: 0; z-index: 0; overflow: hidden;
          background: radial-gradient(ellipse at 20% 20%, #0f1a3a 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 80%, #0f2a1a 0%, transparent 60%),
                      #0a0e1a;
        }
        .nebula1 { position:absolute; top:5%; right:10%; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle, rgba(45,155,111,0.15) 0%, transparent 70%); filter:blur(60px); }
        .nebula2 { position:absolute; bottom:10%; left:5%; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%); filter:blur(50px); }

        @keyframes twinkle {
          0%,100% { opacity:0.1; transform:scale(1); }
          50% { opacity:1; transform:scale(1.8); }
        }
        .star { position:absolute; border-radius:50%; background:white; animation:twinkle var(--dur) var(--delay) infinite ease-in-out; }

        /* লেআউট */
        .app { position:relative; z-index:1; min-height:100vh; }
        .container { max-width:900px; margin:0 auto; padding:0 20px 80px; }

        /* হেডার */
        .header {
          position:sticky; top:0; z-index:50;
          background:rgba(10,14,26,0.8); backdrop-filter:blur(20px);
          border-bottom:1px solid var(--border);
          padding:16px 24px;
          display:flex; align-items:center; justify-content:space-between;
        }
        .logo { display:flex; align-items:center; gap:12px; }
        .logo-icon { font-size:32px; }
        .logo-text { font-family:'Baloo Da 2',sans-serif; font-size:22px; color:var(--gold); letter-spacing:1px; }
        .logo-sub { font-size:13px; color:var(--gold-dim); }
        .header-actions { display:flex; gap:8px; }
        .icon-btn {
          background:none; border:none; cursor:pointer; color:var(--muted);
          padding:8px; border-radius:10px; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center;
        }
        .icon-btn:hover { background:var(--surface); color:var(--text); }

        /* হিরো */
        .hero { text-align:center; padding:50px 20px 30px; }
        .moon-wrap { display:inline-block; margin-bottom:20px; }
        @keyframes float {
          0%,100%{transform:translateY(0) rotate(-5deg);}
          50%{transform:translateY(-15px) rotate(5deg);}
        }
        .moon-anim { animation:float 5s ease-in-out infinite; display:inline-block; font-size:72px; }
        .hero-greeting { font-size:14px; letter-spacing:5px; color:var(--gold-dim); margin-bottom:8px; text-transform:uppercase; }
        .hero-title { font-size:clamp(32px,7vw,70px); font-weight:800; line-height:1.1; margin-bottom:8px; font-family:'Baloo Da 2',sans-serif; }
        .hero-date { font-size:20px; color:var(--muted); margin-bottom:8px; }
        .hero-time { font-size:38px; color:var(--gold-light); letter-spacing:4px; margin:12px 0; font-family:'Baloo Da 2',sans-serif; }

        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, var(--gold-dim), var(--gold-light), var(--gold), var(--gold-light), var(--gold-dim));
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: goldShimmer 4s linear infinite;
        }

        /* কার্ড */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 50%);
          border-radius: 24px;
          pointer-events: none;
        }
        .card-glow { animation: cardGlow 4s ease-in-out infinite; }
        @keyframes cardGlow {
          0%,100% { box-shadow: 0 0 0 1px rgba(201,168,76,0.2), 0 4px 30px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 1px rgba(201,168,76,0.4), 0 4px 40px rgba(201,168,76,0.2); }
        }

        /* রমজান ইনফো */
        .ramadan-badge {
          background: linear-gradient(135deg, var(--emerald-dim), var(--emerald));
          color: white; padding:12px 24px; border-radius:100px;
          display:inline-flex; align-items:center; gap:12px;
          font-size:18px; font-weight:600; margin-bottom:20px;
        }

        /* কাউন্টডাউন গ্রিড */
        .countdown-grid {
          display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;
        }
        .countdown-card {
          padding:20px; text-align:center;
        }
        .countdown-label {
          font-size:14px; color:var(--muted); margin-bottom:8px;
        }
        .countdown-value {
          font-size:28px; font-weight:700; color:var(--gold-light);
          font-family:'Baloo Da 2',sans-serif;
        }
        .countdown-sub {
          font-size:13px; color:var(--gold-dim); margin-top:4px;
        }

        /* সার্চ */
        .search-wrap { padding:28px; margin-bottom:20px; }
        .search-row { display:flex; gap:12px; margin-bottom:20px; }
        .search-input-wrap { flex:1; position:relative; }
        .search-input {
          width:100%; background:rgba(255,255,255,0.05);
          border:1px solid var(--border); border-radius:16px;
          padding:16px 20px 16px 50px;
          font-size:18px; color:var(--text); font-family:'Hind Siliguri',sans-serif;
          outline:none; transition:all 0.2s;
        }
        .search-input::placeholder { color:var(--muted); }
        .search-input:focus { border-color:var(--gold); background:rgba(201,168,76,0.05); }
        .search-icon { position:absolute; left:18px; top:50%; transform:translateY(-50%); color:var(--muted); }
        .search-btn {
          background:linear-gradient(135deg, var(--emerald-dim), var(--emerald));
          border:none; border-radius:16px; padding:16px 32px;
          font-size:16px; font-weight:600; color:#fff; cursor:pointer;
          display:flex; align-items:center; gap:8px; white-space:nowrap;
          font-family:'Baloo Da 2',sans-serif;
        }
        .search-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(45,155,111,0.4); }

        .suggestions {
          position:absolute; z-index:99; width:100%; top:calc(100% + 8px);
          background:rgba(10,14,26,0.98); backdrop-filter:blur(20px);
          border:1px solid var(--border); border-radius:16px; overflow:hidden;
        }
        .suggestion-item {
          display:flex; align-items:center; gap:12px;
          padding:14px 20px; cursor:pointer; transition:background 0.15s;
          font-size:16px; color:var(--text); width:100%; text-align:left;
          background:none; border:none;
        }
        .suggestion-item:hover { background:rgba(201,168,76,0.1); }

        .error-box {
          display:flex; align-items:center; gap:10px; padding:14px 18px;
          background:rgba(200,50,50,0.1); border:1px solid rgba(200,50,50,0.3);
          border-radius:12px; margin-bottom:16px; color:#f9a0a0;
        }

        .popular-label { font-size:14px; color:var(--gold-dim); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
        .popular-chips { display:flex; flex-wrap:wrap; gap:8px; }
        .chip {
          padding:8px 20px; background:rgba(255,255,255,0.05);
          border:1px solid var(--border); border-radius:100px;
          font-size:16px; color:var(--muted); cursor:pointer;
          transition:all 0.2s; font-family:'Hind Siliguri',sans-serif;
        }
        .chip:hover { color:var(--text); border-color:var(--gold); background:rgba(201,168,76,0.1); }

        /* নেক্সট প্রেয়ার */
        .next-banner {
          padding:24px 28px; margin-bottom:20px;
          background:linear-gradient(135deg, rgba(45,155,111,0.15), rgba(201,168,76,0.1));
          display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
        }
        .next-left { display:flex; align-items:center; gap:16px; }
        .next-icon-wrap { width:50px; height:50px; border-radius:16px; background:rgba(78,204,163,0.2); display:flex; align-items:center; justify-content:center; }
        .next-label { font-size:13px; color:var(--muted); text-transform:uppercase; }
        .next-name { font-size:22px; font-weight:600; color:var(--text); font-family:'Baloo Da 2',sans-serif; }
        .next-time { font-size:32px; color:var(--emerald-light); letter-spacing:2px; }
        .next-diff { font-size:14px; color:var(--muted); }

        /* মেইন কার্ড */
        .twin-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
        @media(max-width:580px) { .twin-grid { grid-template-columns:1fr; } }

        .main-card { padding:32px 28px; }
        .mc-badge { font-size:14px; margin-bottom:8px; display:flex; align-items:center; gap:8px; }
        .mc-badge-sehar { color:var(--emerald-light); }
        .mc-badge-iftar { color:#f5b942; }
        .mc-time { font-size:clamp(40px,8vw,56px); font-weight:700; letter-spacing:2px; margin:4px 0; font-family:'Baloo Da 2',sans-serif; }
        .mc-sub { font-size:15px; color:var(--muted); }
        .mc-emoji { font-size:44px; }
        .mc-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }

        /* প্রেয়ার রো */
        .prayers-wrap { padding:28px; margin-bottom:20px; }
        .section-title { font-size:18px; font-weight:600; color:var(--gold); margin-bottom:20px; display:flex; align-items:center; gap:10px; }
        .prayers-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media(max-width:480px) { .prayers-grid { grid-template-columns:1fr; } }

        .prayer-row {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 18px; border-radius:14px; background:rgba(255,255,255,0.03);
          border:1px solid transparent; transition:all 0.2s;
        }
        .prayer-row-next { background:rgba(201,168,76,0.1); border-color:var(--border); }
        .prayer-row-left { display:flex; align-items:center; gap:12px; }
        .prayer-icon { font-size:22px; }
        .prayer-name { font-size:16px; font-weight:500; }
        .prayer-badge { font-size:11px; color:var(--gold); margin-top:2px; }
        .prayer-time { font-size:18px; font-family:'Baloo Da 2',sans-serif; }
        .prayer-time-next { color:var(--gold-light); }

        /* ওয়েদার */
        .weather-wrap { padding:28px; margin-bottom:20px; }
        .weather-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
        @media(max-width:500px) { .weather-grid { grid-template-columns:1fr 1fr; } }
        .weather-item { padding:14px; background:rgba(255,255,255,0.03); border-radius:14px; }
        .weather-label { font-size:13px; color:var(--muted); margin-bottom:4px; }
        .weather-val { font-size:20px; font-weight:600; }

        /* অ্যাকশন */
        .actions { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px; }
        .action-btn {
          display:flex; align-items:center; gap:8px;
          padding:12px 24px; border-radius:14px; cursor:pointer;
          font-size:15px; font-weight:500;
          background:var(--surface); border:1px solid var(--border); color:var(--muted);
        }
        .action-btn:hover { border-color:var(--gold); color:var(--text); background:rgba(201,168,76,0.08); }
        .action-btn-active { background:rgba(201,168,76,0.15); border-color:var(--gold); color:var(--gold); }
        .action-btn-settings { margin-left:auto; }

        /* সেটিংস */
        .settings-wrap { padding:28px; margin-bottom:20px; }
        .settings-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .field-label { font-size:14px; color:var(--muted); margin-bottom:8px; }
        .field-select {
          width:100%; background:rgba(255,255,255,0.05); border:1px solid var(--border);
          border-radius:12px; padding:12px 16px; color:var(--text);
          font-size:16px; font-family:'Hind Siliguri',sans-serif; outline:none;
        }

        /* ফেবারিট */
        .fav-wrap { padding:28px; margin-bottom:20px; }
        .fav-list { display:flex; flex-direction:column; gap:8px; }
        .fav-item {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 18px; border-radius:14px; background:rgba(255,255,255,0.03);
          border:1px solid var(--border);
        }
        .fav-name { display:flex; align-items:center; gap:12px; font-size:18px; cursor:pointer; flex:1; }
        .fav-name:hover { color:var(--gold); }
        .fav-remove { background:none; border:none; cursor:pointer; color:var(--muted); padding:8px; }
        .fav-remove:hover { color:#f87171; }

        /* ফুটার */
        .info-wrap { padding:28px; }
        .info-inner { display:flex; gap:20px; align-items:flex-start; }
        .info-icon { width:48px; height:48px; border-radius:14px; background:rgba(78,204,163,0.1); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .info-title { font-size:16px; font-weight:600; color:var(--gold); margin-bottom:8px; }
        .info-body { font-size:16px; color:var(--muted); line-height:1.7; }
        .info-meta { margin-top:12px; font-size:14px; color:var(--gold-dim); display:flex; gap:12px; }

        .mb-5 { margin-bottom:20px; }
        .spin { animation:spin 1s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .text-emerald { color:var(--emerald-light); }
        .text-gold { color:var(--gold-light); }
      `}</style>

      {/* ব্যাকগ্রাউন্ড */}
      <div className="bg-fixed" aria-hidden="true">
        {STARS.map(s => (
          <div key={s.id} className="star" style={{
            top: `${s.y}%`, left: `${s.x}%`,
            width: s.size, height: s.size,
            "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
          }} />
        ))}
        <div className="nebula1" />
        <div className="nebula2" />
      </div>

      <div className="app">
        {/* হেডার */}
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🌙</span>
            <div>
              <div className="logo-text">রমজান আল্ট্রা</div>
              <div className="logo-sub">বাংলাদেশ · হানাফি</div>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setSoundEnabled(v => !v)}>
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button className="icon-btn" onClick={() => setUnit(u => u === "12h" ? "24h" : "12h")}>
              {unit === "12h" ? "১২ঘ" : "২৪ঘ"}
            </button>
          </div>
        </header>

        <div className="container">
          {/* হিরো সেকশন */}
          <div className="hero">
            <div className="moon-wrap">
              <span className="moon-anim">🌙</span>
            </div>
            <div className="hero-greeting">রমজান মোবারক</div>
            <h1 className="hero-title"><GoldText>রমাদ্বান কারীম</GoldText></h1>
            <div className="hero-date">
              {WEEKDAYS[currentTime.getDay()]}, {toBengaliNumber(currentTime.getDate())} {MONTHS[currentTime.getMonth()]} {toBengaliNumber(currentTime.getFullYear())}
            </div>
            <div className="hero-time">
              {toBengaliNumber(currentTime.getHours().toString().padStart(2, '0'))}:{toBengaliNumber(currentTime.getMinutes().toString().padStart(2, '0'))}:{toBengaliNumber(currentTime.getSeconds().toString().padStart(2, '0'))}
            </div>
          </div>

          {/* সার্চ */}
          <Card className="search-wrap mb-5" glow>
            <div className="search-row">
              <div className="search-input-wrap">
                <MapPin size={20} className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="শহরের নাম লিখুন — ঢাকা, চট্টগ্রাম, খুলনা..."
                  value={city}
                  onChange={e => { setCity(e.target.value); fetchSuggestions(e.target.value); }}
                  onKeyDown={e => e.key === "Enter" && fetchTimings()}
                />
                {suggestions.length > 0 && (
                  <div className="suggestions">
                    {suggestions.map((s, i) => (
                      <button key={i} className="suggestion-item" onClick={() => { setCity(s.city); fetchTimings(s.city); setSuggestions([]); }}>
                        <MapPin size={16} style={{ color:"var(--gold)" }} />
                        {s.city}, {s.country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="search-btn" onClick={() => fetchTimings()} disabled={loading}>
                {loading ? <RefreshCw size={18} className="spin" /> : <Zap size={18} />}
                {loading ? "লোডিং..." : "খুঁজুন"}
              </button>
            </div>

            {error && (
              <div className="error-box">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="popular-label">
              <Star size={14} /> জনপ্রিয় শহর
            </div>
            <div className="popular-chips">
              {POPULAR_CITIES.map(c => (
                <button key={c} className="chip" onClick={() => { setCity(c); fetchTimings(c); }}>{c}</button>
              ))}
            </div>
          </Card>

          {timings && (
            <>
              {/* রমজান ইনফো */}
              {ramadanData && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div className="ramadan-badge">
                    <Award size={24} />
                    <span>{toBengaliNumber(rozaCount)} তম রোজা · রমজান {toBengaliNumber(ramadanData.hijriDay)}</span>
                  </div>
                </div>
              )}

              {/* কাউন্টডাউন */}
              {showCountdown && (
                <div className="countdown-grid">
                  <Card className="countdown-card">
                    <div className="countdown-label">
                      <Coffee size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      সাহরী শেষ হতে
                    </div>
                    <div className="countdown-value">
                      {countdowns.sehar ? countdowns.sehar.text : '--'}
                    </div>
                    <div className="countdown-sub">ফজর: {fmt(timings.Fajr)}</div>
                  </Card>

                  <Card className="countdown-card">
                    <div className="countdown-label">
                      <Utensils size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      ইফতার হতে
                    </div>
                    <div className="countdown-value">
                      {countdowns.iftar ? countdowns.iftar.text : '--'}
                    </div>
                    <div className="countdown-sub">মাগরিব: {fmt(timings.Maghrib)}</div>
                  </Card>
                </div>
              )}

              {/* পরবর্তী নামাজ */}
              {nextPrayer && (
                <Card className="next-banner mb-5">
                  <div className="next-left">
                    <div className="next-icon-wrap">
                      <Clock size={24} style={{ color:"var(--emerald-light)" }} />
                    </div>
                    <div>
                      <div className="next-label">পরবর্তী নামাজ</div>
                      <div className="next-name">{nextPrayer.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="next-time">{fmt(nextPrayer.time)}</div>
                    <div className="next-diff">বাকি {nextPrayer.diff}</div>
                  </div>
                </Card>
              )}

              {/* সাহরী ও ইফতার */}
              <div className="twin-grid">
                <Card className="main-card" glow>
                  <div className="mc-top">
                    <div>
                      <div className="mc-badge mc-badge-sehar">
                        <Moon size={14} /> সাহরী · ফজর
                      </div>
                      <div className="mc-time" style={{ color:"var(--emerald-light)" }}>
                        {fmt(timings.Fajr)}
                      </div>
                      <div className="mc-sub">সেহরির শেষ সময়</div>
                    </div>
                    <div className="mc-emoji">🌙</div>
                  </div>
                  {nextPrayer?.originalName === "Fajr" && (
                    <div className="mc-countdown">সাহরী শেষ হতে {nextPrayer.diff}</div>
                  )}
                </Card>

                <Card className="main-card" glow>
                  <div className="mc-top">
                    <div>
                      <div className="mc-badge mc-badge-iftar">
                        <Sun size={14} /> ইফতার · মাগরিব
                      </div>
                      <div className="mc-time" style={{ color:"#f5b942" }}>
                        {fmt(timings.Maghrib)}
                      </div>
                      <div className="mc-sub">ইফতারের সময়</div>
                    </div>
                    <div className="mc-emoji">☀️</div>
                  </div>
                  {nextPrayer?.originalName === "Maghrib" && (
                    <div className="mc-countdown mc-countdown-iftar">ইফতার হতে {nextPrayer.diff}</div>
                  )}
                </Card>
              </div>

              {/* সব নামাজ */}
              <Card className="prayers-wrap mb-5">
                <div className="section-title">
                  <Layers size={18} /> সকল নামাজের সময় — {currentCity}
                </div>
                <div className="prayers-grid">
                  {PRAYERS.map(p => (
                    <div 
                      key={p.key} 
                      className={`prayer-row ${nextPrayer?.originalName === p.key ? 'prayer-row-next' : ''}`}
                    >
                      <div className="prayer-row-left">
                        <span className="prayer-icon">{p.icon}</span>
                        <div>
                          <div className="prayer-name">{p.name}</div>
                          {nextPrayer?.originalName === p.key && (
                            <div className="prayer-badge">পরবর্তী</div>
                          )}
                        </div>
                      </div>
                      <div className={`prayer-time ${nextPrayer?.originalName === p.key ? 'prayer-time-next' : ''}`}>
                        {fmt(timings[p.key])}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* আবহাওয়া */}
              {weather && (
                <Card className="weather-wrap mb-5">
                  <div className="section-title">
                    <Cloud size={18} /> {currentCity} এর আবহাওয়া
                  </div>
                  <div className="weather-grid">
                    <div className="weather-item">
                      <div className="weather-label">তাপমাত্রা</div>
                      <div className="weather-val">{toBengaliNumber(weather.temp)}°C</div>
                    </div>
                    <div className="weather-item">
                      <div className="weather-label">আর্দ্রতা</div>
                      <div className="weather-val">{toBengaliNumber(weather.humidity)}%</div>
                    </div>
                    <div className="weather-item">
                      <div className="weather-label">বাতাস</div>
                      <div className="weather-val">{toBengaliNumber(weather.wind)} m/s</div>
                    </div>
                    <div className="weather-item">
                      <div className="weather-label">অনুভূতি</div>
                      <div className="weather-val">{toBengaliNumber(weather.feelsLike)}°C</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* অ্যাকশন বাটন */}
              <div className="actions">
                <button className={`action-btn ${isFav ? "action-btn-active" : ""}`} onClick={toggleFavorite}>
                  <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                  {isFav ? "সংরক্ষিত" : "পছন্দের তালিকায়"}
                </button>
                <button className="action-btn" onClick={exportData}>
                  <Download size={16} /> JSON ডাউনলোড
                </button>
                <button className="action-btn" onClick={share}>
                  <Share2 size={16} /> শেয়ার
                </button>
                <button className="action-btn" onClick={() => setShowCountdown(v => !v)}>
                  <Bell size={16} /> {showCountdown ? 'কাউন্টডাউন অন' : 'কাউন্টডাউন অফ'}
                </button>
                <button className={`action-btn action-btn-settings ${showSettings ? "action-btn-active" : ""}`} onClick={() => setShowSettings(v => !v)}>
                  <Settings size={16} /> সেটিংস
                </button>
              </div>

              {/* সেটিংস */}
              {showSettings && (
                <Card className="settings-wrap mb-5">
                  <div className="section-title"><Settings size={18} /> ক্যালকুলেশন সেটিংস</div>
                  <div className="settings-grid">
                    <div>
                      <div className="field-label">মেথড</div>
                      <select className="field-select" value={method} onChange={e => setMethod(Number(e.target.value))}>
                        {METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="field-label">মাযহাব (আসর)</div>
                      <select className="field-select" value={school} onChange={e => setSchool(Number(e.target.value))}>
                        <option value={0}>হানাফি</option>
                        <option value={1}>শাফিঈ</option>
                      </select>
                    </div>
                  </div>
                  <div className="settings-note">পরবর্তী সার্চে পরিবর্তনগুলি প্রয়োগ হবে।</div>
                </Card>
              )}

              {/* ফেবারিট */}
              {favorites.length > 0 && (
                <Card className="fav-wrap mb-5">
                  <div className="section-title"><Star size={18} /> সংরক্ষিত শহর</div>
                  <div className="fav-list">
                    {favorites.map(f => (
                      <div key={f.name} className="fav-item">
                        <div className="fav-name" onClick={() => loadFromFavorite(f)}>
                          <MapPin size={18} style={{ color:"var(--gold)" }} /> {f.name}
                          <ChevronRight size={16} style={{ marginLeft:"auto", color:"var(--muted)" }} />
                        </div>
                        <button className="fav-remove" onClick={() => setFavorites(p => p.filter(x => x.name !== f.name))}>
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}

          {/* ফুটার */}
          <Card className="info-wrap">
            <div className="info-inner">
              <div className="info-icon">
                <Moon size={22} style={{ color:"var(--emerald-light)" }} />
              </div>
              <div>
                <div className="info-title">সময় সম্পর্কে</div>
                <div className="info-body">
                  নামাজের সময় জ্যোতির্বিজ্ঞান অ্যালগরিদম ব্যবহার করে গণনা করা হয়। 
                  নির্ভুল সময়ের জন্য স্থানীয় মসজিদের সাথে যাচাই করুন।
                </div>
                <div className="info-meta">
                  <span>Aladhan API</span>
                  <span>·</span>
                  <span>হানাফি মাযহাব</span>
                  <span>·</span>
                  <span>রমজান মোবারক 🌙</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}