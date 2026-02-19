import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  MapPin,
  Moon,
  Sun,
  Clock,
  Download,
  Share2,
  Heart,
  Cloud,
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Star,
  Layers,
  Zap,
  AlertCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Thermometer,
  Settings,
  ChevronRight,
  X,
  Calendar,
  Coffee,
  Utensils,
  Award,
  Bell,
  Info,
  Check,
  Compass,
  Map,
  Globe,
  SunDim,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Eye,
  Gauge,
  Sunrise as SunriseIcon,
  Sunset as SunsetIcon,
  Navigation,
  Anchor,
  Waves,
  Moon as MoonIcon,
  Umbrella,
  Battery,
  Wifi,
  WifiOff,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
} from "lucide-react";

/* ─── বাংলা কনস্ট্যান্ট ───────────────────────────────── */
const PRAYERS = [
  { name: "ফজর", key: "Fajr", icon: "🌙", timeName: "সেহরি শেষ", priority: 1 },
  {
    name: "সূর্যোদয়",
    key: "Sunrise",
    icon: "🌅",
    timeName: "সূর্যোদয়",
    priority: 2,
  },
  { name: "যোহর", key: "Dhuhr", icon: "☀️", timeName: "যোহর", priority: 3 },
  { name: "আসর", key: "Asr", icon: "🌤️", timeName: "আসর", priority: 4 },
  {
    name: "মাগরিব",
    key: "Maghrib",
    icon: "🌇",
    timeName: "ইফতার",
    priority: 5,
  },
  { name: "ইশা", key: "Isha", icon: "🌌", timeName: "ইশা", priority: 6 },
];

const toBanglaNumber = (num) =>
  num.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const format12Time = (date) => {
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();

  const period = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h ? h : 12; // 0 -> 12

  return (
    `${toBengaliNumber(h.toString().padStart(2, "0"))}:` +
    `${toBengaliNumber(m.toString().padStart(2, "0"))}:` +
    `${toBengaliNumber(s.toString().padStart(2, "0"))} ${period}`
  );
};

const ADDITIONAL_PRAYERS = [
  {
    name: "তাহাজ্জুদ",
    key: "Tahajjud",
    icon: "🌟",
    timeName: "তাহাজ্জুদ",
    minutesFromFajr: -90,
  },
  {
    name: "ইশরাক",
    key: "Ishraq",
    icon: "☀️",
    timeName: "ইশরাক",
    minutesFromSunrise: 20,
  },
  {
    name: "চাশত",
    key: "Chasht",
    icon: "🌤️",
    timeName: "চাশত",
    minutesFromSunrise: 45,
  },
  {
    name: "যাওয়াল",
    key: "Zawal",
    icon: "⚡",
    timeName: "যাওয়াল",
    minutesBeforeDhuhr: 5,
  },
];

// এই লিস্টটি এখন শুধুমাত্র অভ্যন্তরীণ ফ্যালব্যাক ও কোঅর্ডিনেটের জন্য ব্যবহৃত হয় (UI তে দেখানো হয় না)
const POPULAR_CITIES = [
  {
    bn: "ঢাকা",
    en: "Dhaka",
    lat: 23.8103,
    lon: 90.4125,
    population: "২.১ কোটি",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "চট্টগ্রাম",
    en: "Chittagong",
    lat: 22.3569,
    lon: 91.7832,
    population: "৮৫ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "খুলনা",
    en: "Khulna",
    lat: 22.8456,
    lon: 89.5403,
    population: "৬৫ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "রাজশাহী",
    en: "Rajshahi",
    lat: 24.3745,
    lon: 88.6042,
    population: "৫৫ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "সিলেট",
    en: "Sylhet",
    lat: 24.8949,
    lon: 91.8687,
    population: "৫০ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "বরিশাল",
    en: "Barisal",
    lat: 22.701,
    lon: 90.3535,
    population: "৪০ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "রংপুর",
    en: "Rangpur",
    lat: 25.7439,
    lon: 89.2752,
    population: "৪৫ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "ময়মনসিংহ",
    en: "Mymensingh",
    lat: 24.7471,
    lon: 90.4203,
    population: "৫২ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "কুমিল্লা",
    en: "Comilla",
    lat: 23.4607,
    lon: 91.1809,
    population: "৬০ লক্ষ",
    timezone: "Asia/Dhaka",
  },
  {
    bn: "নারায়ণগঞ্জ",
    en: "Narayanganj",
    lat: 23.6238,
    lon: 90.5,
    population: "৪২ লক্ষ",
    timezone: "Asia/Dhaka",
  },
];

const METHODS = [
  {
    id: 1,
    name: "ইসলামিক সায়েন্স ইউনিভার্সিটি, করাচী",
    accuracy: "±১ মিনিট",
    region: "দক্ষিণ এশিয়া",
    fajrAngle: 18,
    ishaAngle: 18,
  },
  {
    id: 2,
    name: "ইসলামিক সোসাইটি অফ নর্থ আমেরিকা (ISNA)",
    accuracy: "±২ মিনিট",
    region: "উত্তর আমেরিকা",
    fajrAngle: 15,
    ishaAngle: 15,
  },
  {
    id: 3,
    name: "মুসলিম ওয়ার্ল্ড লীগ",
    accuracy: "±১ মিনিট",
    region: "ইউরোপ/এশিয়া",
    fajrAngle: 18,
    ishaAngle: 17,
  },
  {
    id: 4,
    name: "উম্মুল কুরা, মক্কা",
    accuracy: "±২ মিনিট",
    region: "সৌদি আরব",
    fajrAngle: 18.5,
    ishaAngle: 90,
  },
  {
    id: 5,
    name: "ইজিপশিয়ান জেনারেল অথরিটি",
    accuracy: "±২ মিনিট",
    region: "মিশর/আফ্রিকা",
    fajrAngle: 19.5,
    ishaAngle: 17.5,
  },
  {
    id: 7,
    name: "তেহরান ইউনিভার্সিটি",
    accuracy: "±৩ মিনিট",
    region: "ইরান",
    fajrAngle: 17.7,
    ishaAngle: 14,
  },
  {
    id: 8,
    name: "গুলফ রিজিয়ন",
    accuracy: "±২ মিনিট",
    region: "উপসাগরীয় অঞ্চল",
    fajrAngle: 18.2,
    ishaAngle: 18.2,
  },
  {
    id: 9,
    name: "কুয়েত",
    accuracy: "±১ মিনিট",
    region: "কুয়েত",
    fajrAngle: 18,
    ishaAngle: 17.5,
  },
  {
    id: 10,
    name: "কাতার",
    accuracy: "±১ মিনিট",
    region: "কাতার",
    fajrAngle: 18,
    ishaAngle: 18,
  },
  {
    id: 12,
    name: "মজলিস তানজিমুল",
    accuracy: "±১ মিনিট",
    region: "সিঙ্গাপুর",
    fajrAngle: 20,
    ishaAngle: 18,
  },
  {
    id: 14,
    name: "ধনেশ্বরী",
    accuracy: "±১ মিনিট",
    region: "বাংলাদেশ",
    fajrAngle: 18.5,
    ishaAngle: 18,
  },
];

const SCHOOLS = [
  { id: 0, name: "হানাফি", description: "ইমাম আবু হানিফা (রহ.)", asrFactor: 1 },
  { id: 1, name: "শাফিঈ", description: "ইমাম শাফিঈ (রহ.)", asrFactor: 2 },
];

const WEEKDAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];
const MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];
const ARABIC_MONTHS = [
  "মুহররম",
  "সফর",
  "রবিউল আউয়াল",
  "রবিউস সানি",
  "জমাদিউল আউয়াল",
  "জমাদিউস সানি",
  "রজব",
  "শাবান",
  "রমজান",
  "শাওয়াল",
  "জ্বিলকদ",
  "জ্বিলহজ",
];

/* ─── ইউটিলিটি ফাংশন ───────────────────────────────── */
const toBengaliNumber = (num) => {
  if (num === null || num === undefined) return "০";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
};

const fromBengaliNumber = (bnStr) => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return bnStr.replace(/[০-৯]/g, (d) => bengaliDigits.indexOf(d).toString());
};

const formatBengaliTime = (timeStr) => {
  if (!timeStr) return "--:--";
  const [hours, minutes] = timeStr.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "--:--";
  return `${toBengaliNumber(hours.toString().padStart(2, "0"))}:${toBengaliNumber(minutes.toString().padStart(2, "0"))}`;
};

const formatBengaliDate = (date) => {
  if (!date) return "";
  return `${toBengaliNumber(date.getDate())} ${MONTHS[date.getMonth()]} ${toBengaliNumber(date.getFullYear())}`;
};

const isValidTime = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return false;
  const pattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
  return pattern.test(timeStr);
};

const parseTime = (timeStr) => {
  if (!isValidTime(timeStr)) return null;
  const parts = timeStr.split(":").map(Number);
  return {
    hours: parts[0],
    minutes: parts[1],
    seconds: parts[2] || 0,
    totalMinutes: parts[0] * 60 + parts[1],
    totalSeconds: (parts[0] * 60 + parts[1]) * 60 + (parts[2] || 0),
  };
};

const timeToMinutes = (timeStr) => {
  const parsed = parseTime(timeStr);
  return parsed ? parsed.totalMinutes : null;
};

const timeToSeconds = (timeStr) => {
  const parsed = parseTime(timeStr);
  return parsed ? parsed.totalSeconds : null;
};

const formatTimeDifference = (seconds) => {
  if (seconds < 0) seconds = 0;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${toBengaliNumber(hours)} : ${toBengaliNumber(minutes)} : ${toBengaliNumber(secs)} `;
  } else if (minutes > 0) {
    return `${toBengaliNumber(minutes)} : ${toBengaliNumber(secs)} `;
  } else {
    return `${toBengaliNumber(secs)} `;
  }
};

const calculateAdditionalPrayers = (timings) => {
  if (!timings) return {};

  const fajr = parseTime(timings.Fajr);
  const sunrise = parseTime(timings.Sunrise);
  const dhuhr = parseTime(timings.Dhuhr);

  if (!fajr || !sunrise || !dhuhr) return {};

  const additional = {};

  // তাহাজ্জুদ: ফজরের ৯০ মিনিট আগে
  if (fajr) {
    const tahajjudSeconds = Math.max(0, fajr.totalSeconds - 90 * 60);
    const tahajjudHours = Math.floor(tahajjudSeconds / 3600);
    const tahajjudMinutes = Math.floor((tahajjudSeconds % 3600) / 60);
    additional.Tahajjud = `${tahajjudHours.toString().padStart(2, "0")}:${tahajjudMinutes.toString().padStart(2, "0")}`;
  }

  // ইশরাক: সূর্যোদয়ের ২০ মিনিট পর
  if (sunrise && dhuhr) {
    const ishraqSeconds = Math.min(
      sunrise.totalSeconds + 20 * 60,
      dhuhr.totalSeconds - 30 * 60,
    );
    const ishraqHours = Math.floor(ishraqSeconds / 3600);
    const ishraqMinutes = Math.floor((ishraqSeconds % 3600) / 60);
    additional.Ishraq = `${ishraqHours.toString().padStart(2, "0")}:${ishraqMinutes.toString().padStart(2, "0")}`;
  }

  // চাশত: সূর্যোদয়ের ৪৫ মিনিট পর
  if (sunrise && dhuhr) {
    const chashtSeconds = Math.min(
      sunrise.totalSeconds + 45 * 60,
      dhuhr.totalSeconds - 15 * 60,
    );
    const chashtHours = Math.floor(chashtSeconds / 3600);
    const chashtMinutes = Math.floor((chashtSeconds % 3600) / 60);
    additional.Chasht = `${chashtHours.toString().padStart(2, "0")}:${chashtMinutes.toString().padStart(2, "0")}`;
  }

  // যাওয়াল: যোহরের ৫ মিনিট আগে
  if (sunrise && dhuhr) {
    const zawalSeconds = Math.max(
      sunrise.totalSeconds + 30 * 60,
      dhuhr.totalSeconds - 5 * 60,
    );
    const zawalHours = Math.floor(zawalSeconds / 3600);
    const zawalMinutes = Math.floor((zawalSeconds % 3600) / 60);
    additional.Zawal = `${zawalHours.toString().padStart(2, "0")}:${zawalMinutes.toString().padStart(2, "0")}`;
  }

  return additional;
};

const calculateQibla = (lat, lon) => {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

  const lat1 = (lat * Math.PI) / 180;
  const lon1 = (lon * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const lon2 = (kaabaLon * Math.PI) / 180;

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  qibla = (qibla + 360) % 360;

  return Math.round(qibla * 10) / 10;
};

/* ─── স্ট্যাটিক ডেটা ───────────────────────────────── */
const STARS = Array.from({ length: 200 }, (_, i) => ({
  id: `star-${i}`,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 0.5,
  dur: 2 + Math.random() * 6,
  delay: Math.random() * 5,
  brightness: Math.random() * 0.8 + 0.2,
}));

/* ─── কম্পোনেন্ট ────────────────────────────────────── */
const GoldText = ({ children, className = "" }) => (
  <span className={`gold-shimmer ${className}`}>{children}</span>
);

const Card = ({
  children,
  className = "",
  glow = false,
  onClick,
  elevation = "medium",
}) => {
  const elevationClass = {
    low: "card-elevation-low",
    medium: "card-elevation-medium",
    high: "card-elevation-high",
  }[elevation];

  return (
    <div
      className={`card ${glow ? "card-glow" : ""} ${elevationClass} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </div>
  );
};

const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <div className="tooltip">{text}</div>}
    </div>
  );
};

const AccuracyBadge = ({ accuracy }) => {
  const getColor = () => {
    if (accuracy.includes("±১")) return "#4ecca3";
    if (accuracy.includes("±২")) return "#f5b942";
    return "#f87171";
  };

  return (
    <span
      className="accuracy-badge"
      style={{ backgroundColor: getColor() + "20", color: getColor() }}
    >
      <Check size={12} /> {accuracy}
    </span>
  );
};

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification-${notification.type}`}>
      {notification.type === "success" && <Check size={16} />}
      {notification.type === "error" && <AlertCircle size={16} />}
      {notification.type === "info" && <Info size={16} />}
      {notification.message}
      <button
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: "inherit",
          cursor: "pointer",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

/* ─── মেইন অ্যাপ ────────────────────────────────────── */
export default function RamadanUltra() {
  // স্টেট
  const [city, setCity] = useState("");
  const [cityEn, setCityEn] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [timings, setTimings] = useState(null);
  const [additionalTimings, setAdditionalTimings] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
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
  const [rozaCount, setRozaCount] = useState(0);
  const [showCountdown, setShowCountdown] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [qibla, setQibla] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [history, setHistory] = useState([]);
  const [accuracy, setAccuracy] = useState({
    status: "high",
    message: "নির্ভুল সময়",
  });
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [hijriAdjustment, setHijriAdjustment] = useState(-1); // -1 day adjustment for Bangladesh
  const [notifications, setNotifications] = useState([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [debugInfo, setDebugInfo] = useState(null);

  const audioRef = useRef(null);
  const refreshInterval = useRef(null);
  const notificationCounter = useRef(0);
  const searchTimeout = useRef(null); // for debounce

  // নেটওয়ার্ক স্ট্যাটাস ট্র্যাক
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(true);
      addNotification("success", "ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে");
    };

    const handleOffline = () => {
      setNetworkStatus(false);
      setOfflineMode(true);
      addNotification("info", "অফলাইন মোডে চলছে");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // লোকালস্টোরেজ থেকে ডাটা লোড
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem("ramadan-ultra-v4");
        if (saved) {
          const data = JSON.parse(saved);
          setFavorites(data.favorites || []);
          setMethod(data.method || 1);
          setSchool(data.school || 0);
          setUnit(data.unit || "12h");
          setSoundEnabled(data.soundEnabled !== false);
          setShowCountdown(data.showCountdown !== false);
          setAutoRefresh(data.autoRefresh || false);
          setHijriAdjustment(
            data.hijriAdjustment !== undefined ? data.hijriAdjustment : -1,
          );

          if (data.lastCity) {
            setCity(data.lastCity.bn);
            setCityEn(data.lastCity.en);
          }

          if (data.timings && data.currentCity) {
            setTimings(data.timings);
            setCurrentCity(data.currentCity);
            setAdditionalTimings(calculateAdditionalPrayers(data.timings));
            setLastUpdated(
              data.lastUpdated ? new Date(data.lastUpdated) : null,
            );
            setOfflineMode(true);
          }
        }
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    };

    loadSavedData();
    setIsFirstLoad(false);
  }, []);

  // ডাটা সেভ
  useEffect(() => {
    if (isFirstLoad) return;

    const saveData = () => {
      const data = {
        favorites,
        method,
        school,
        unit,
        soundEnabled,
        showCountdown,
        autoRefresh,
        hijriAdjustment,
        lastCity: currentCity ? { bn: currentCity, en: cityEn } : null,
        timings: timings,
        currentCity: currentCity,
        lastUpdated: lastUpdated ? lastUpdated.toISOString() : null,
        version: "4.0",
      };

      localStorage.setItem("ramadan-ultra-v4", JSON.stringify(data));
    };

    const debounce = setTimeout(saveData, 1000);
    return () => clearTimeout(debounce);
  }, [
    favorites,
    method,
    school,
    unit,
    soundEnabled,
    showCountdown,
    autoRefresh,
    hijriAdjustment,
    currentCity,
    cityEn,
    timings,
    lastUpdated,
    isFirstLoad,
  ]);

  // অটো রিফ্রেশ
  useEffect(() => {
    if (autoRefresh && currentCity && networkStatus) {
      refreshInterval.current = setInterval(
        () => {
          fetchTimings(currentCity, cityEn, true);
        },
        15 * 60 * 1000,
      );
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh, currentCity, cityEn, networkStatus]);

  // ঘড়ি আপডেট
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // পরবর্তী নামাজ নির্ণয়
  useEffect(() => {
    if (!timings) return;

    const nowSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    const allPrayers = [];

    PRAYERS.forEach((p) => {
      const time = timings[p.key];
      if (time && isValidTime(time)) {
        const seconds = timeToSeconds(time);
        if (seconds !== null) {
          allPrayers.push({
            name: p.name,
            key: p.key,
            time: time,
            seconds: seconds,
            type: "main",
            priority: p.priority,
          });
        }
      }
    });

    if (additionalTimings) {
      ADDITIONAL_PRAYERS.forEach((p) => {
        const time = additionalTimings[p.key];
        if (time && isValidTime(time)) {
          const seconds = timeToSeconds(time);
          if (seconds !== null) {
            allPrayers.push({
              name: p.name,
              key: p.key,
              time: time,
              seconds: seconds,
              type: "additional",
              priority: 10,
            });
          }
        }
      });
    }

    allPrayers.sort((a, b) => a.seconds - b.seconds);

    let next = null;
    for (const prayer of allPrayers) {
      if (prayer.seconds > nowSeconds) {
        const diffSeconds = prayer.seconds - nowSeconds;
        next = {
          ...prayer,
          diff: formatTimeDifference(diffSeconds),
          diffSeconds: diffSeconds,
          diffMinutes: Math.floor(diffSeconds / 60),
        };
        break;
      }
    }

    if (!next && timings.Fajr) {
      const fajrSeconds = timeToSeconds(timings.Fajr);
      if (fajrSeconds !== null) {
        const tomorrowFajr = fajrSeconds + 24 * 3600;
        const diffSeconds = tomorrowFajr - nowSeconds;
        next = {
          name: "ফজর (আগামীকাল)",
          key: "Fajr",
          time: timings.Fajr,
          diff: formatTimeDifference(diffSeconds),
          diffSeconds: diffSeconds,
          diffMinutes: Math.floor(diffSeconds / 60),
          type: "tomorrow",
        };
      }
    }

    setNextPrayer(next);

    if (next) {
      if (next.diffSeconds < 60) {
        setAccuracy({ status: "critical", message: "আজান শীঘ্রই" });
      } else if (next.diffMinutes < 5) {
        setAccuracy({ status: "warning", message: "আজানের সময় নিকটে" });
      } else {
        setAccuracy({ status: "high", message: "নির্ভুল সময়" });
      }
    }

    if (soundEnabled && next && next.diffSeconds === 0 && audioRef.current) {
      playAdhan();
    }
  }, [timings, additionalTimings, currentTime, soundEnabled]);

  // ইফতার ও সাহরির কাউন্টডাউন
  const getCountdowns = useCallback(() => {
    if (!timings) return { iftar: null, sehar: null };

    const nowSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    const iftarSeconds = timeToSeconds(timings.Maghrib);
    const seharSeconds = timeToSeconds(timings.Fajr);

    let iftarDiff = null;
    let seharDiff = null;

    if (iftarSeconds !== null && iftarSeconds > nowSeconds) {
      const diffSeconds = iftarSeconds - nowSeconds;
      iftarDiff = {
        seconds: diffSeconds,
        text: formatTimeDifference(diffSeconds),
      };
    }

    if (seharSeconds !== null && seharSeconds > nowSeconds) {
      const diffSeconds = seharSeconds - nowSeconds;
      seharDiff = {
        seconds: diffSeconds,
        text: formatTimeDifference(diffSeconds),
      };
    }

    return { iftar: iftarDiff, sehar: seharDiff };
  }, [timings, currentTime]);

  // সিটি সাজেশন – ডায়নামিক (Nominatim API)
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=10&` +
        `countrycodes=BD&` +
        `accept-language=bn`, // বাংলা ভাষায় নাম চাই
        {
          headers: {
            'User-Agent': 'RamadanUltra/1.0' // Nominatim-এর জন্য প্রয়োজনীয়
          }
        }
      );
      const data = await response.json();

      const mapped = data.map(item => ({
        bn: item.display_name.split(',')[0], // সাধারণ নাম (প্রথম অংশ)
        en: item.name,                         // ইংরেজি নাম (যদি থাকে)
        country: "বাংলাদেশ",
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        population: null
      }));

      setSuggestions(mapped);
    } catch (error) {
      console.error('Geocoding error:', error);
      // API ব্যর্থ হলে স্ট্যাটিক লিস্ট থেকে ফিল্টার করি (ফলব্যাক)
      const bnQuery = query;
      const enQuery = fromBengaliNumber(query).toLowerCase();
      const filtered = POPULAR_CITIES.filter(
        city => city.bn.includes(bnQuery) || city.en.toLowerCase().includes(enQuery)
      ).map(city => ({
        bn: city.bn,
        en: city.en,
        country: "বাংলাদেশ",
        lat: city.lat,
        lon: city.lon,
        population: city.population
      }));
      setSuggestions(filtered);
    }
  };

  // টাইমিংস ফেচ
  const fetchTimings = async (
    searchCityBn = city,
    searchCityEn = cityEn,
    isAutoRefresh = false,
  ) => {
    if (!searchCityBn?.trim() && !searchCityEn?.trim()) {
      setError("দয়া করে একটি শহরের নাম লিখুন");
      return;
    }

    setLoading(true);
    if (!isAutoRefresh) setError(null);
    setSuggestions([]);

    let finalCityEn = searchCityEn;
    let lat = null,
      lon = null;

    const foundCity = POPULAR_CITIES.find(
      (c) =>
        c.bn === searchCityBn ||
        c.en.toLowerCase() === searchCityEn?.toLowerCase(),
    );

    if (foundCity) {
      finalCityEn = foundCity.en;
      lat = foundCity.lat;
      lon = foundCity.lon;
    } else if (!finalCityEn) {
      finalCityEn = searchCityBn;
    }

    const maxRetries = 3;
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        const date = new Date();
        const url = `https://api.aladhan.com/v1/timingsByCity/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?city=${encodeURIComponent(finalCityEn)}&country=Bangladesh&method=${method}&school=${school}`;

        console.log("Fetching from URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.data || !data.data.timings) {
          throw new Error("Invalid API response structure");
        }

        console.log("API Response:", data);

        const timingsData = data.data.timings;

        const validatedTimings = {};
        let validCount = 0;

        PRAYERS.forEach((p) => {
          const time = timingsData[p.key];
          if (time && isValidTime(time)) {
            validatedTimings[p.key] = time;
            validCount++;
          }
        });

        if (validCount < 4) {
          throw new Error("Insufficient valid timing data");
        }

        setTimings(validatedTimings);

        const additional = calculateAdditionalPrayers(validatedTimings);
        setAdditionalTimings(additional);

        setCurrentCity(searchCityBn);
        setCityEn(finalCityEn);
        setCity(searchCityBn);
        setCoordinates({ lat, lon });

        if (lat && lon) {
          const qiblaAngle = calculateQibla(lat, lon);
          setQibla(qiblaAngle);
        }

        // Fix Hijri date with Bangladesh timezone adjustment
        if (data.data.date && data.data.date.hijri) {
          const hijri = data.data.date.hijri;
          const hijriDay = parseInt(hijri.day);
          const hijriMonth = parseInt(hijri.month.number);

          const currentHour = date.getHours();
          const bangladeshHour = (currentHour + 6) % 24;

          const maghribTime = timingsData.Maghrib;
          let adjustedHijriDay = hijriDay;

          if (maghribTime) {
            const [maghribHour, maghribMinute] = maghribTime
              .split(":")
              .map(Number);
            const currentTotalMinutes =
              date.getHours() * 60 + date.getMinutes();
            const maghribTotalMinutes = maghribHour * 60 + maghribMinute;

            if (currentTotalMinutes >= maghribTotalMinutes) {
              adjustedHijriDay = hijriDay + 1;
              console.log(
                "After Maghrib, adjusting Hijri day to:",
                adjustedHijriDay,
              );
            }
          }

          const finalHijriDay = Math.max(1, adjustedHijriDay + hijriAdjustment);

          console.log("Hijri data:", {
            original: hijriDay,
            afterMaghrib: adjustedHijriDay,
            adjustment: hijriAdjustment,
            final: finalHijriDay,
            month: hijriMonth,
            monthName: hijri.month.en,
            isRamadan: hijriMonth === 9,
          });

          setDebugInfo({
            originalDay: hijriDay,
            adjustedDay: adjustedHijriDay,
            finalDay: finalHijriDay,
            month: hijriMonth,
            hour: bangladeshHour,
            maghrib: maghribTime,
          });

          setHijriDate({
            day: finalHijriDay,
            month: hijri.month.en,
            monthAr: ARABIC_MONTHS[hijriMonth - 1],
            year: parseInt(hijri.year),
            weekday: hijri.weekday.en,
            monthNumber: hijriMonth,
          });

          if (hijriMonth === 9) {
            setRozaCount(finalHijriDay);
          } else {
            setRozaCount(0);
          }
        }

        if (lat && lon) {
          fetchWeather(lat, lon);
        }

        setLastUpdated(new Date());
        setOfflineMode(false);
        addNotification("success", `${searchCityBn} এর সময় লোড হয়েছে`);

        success = true;
      } catch (err) {
        retryCount++;
        console.error(`Fetch attempt ${retryCount} failed:`, err);

        if (retryCount === maxRetries) {
          setError(`সময় পাওয়া যায়নি: ${err.message}`);
          addNotification("error", "ডাটা লোড করতে সমস্যা হয়েছে");

          if (history.length > 0) {
            const lastData = history[0];
            setTimings(lastData.timings);
            setCurrentCity(lastData.city);
            setOfflineMode(true);
            addNotification("info", "ক্যাশে থেকে ডাটা দেখানো হচ্ছে");
          }
        } else {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount),
          );
        }
      }
    }

    setLoading(false);
  };

  // ওয়েদার ফেচ
  const fetchWeather = async (lat, lon) => {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      if (weatherData.current_weather) {
        setWeather({
          temp: Math.round(weatherData.current_weather.temperature),
          humidity: weatherData.hourly?.relativehumidity_2m?.[0] || 70,
          wind: Math.round(weatherData.current_weather.windspeed / 3.6),
          feelsLike: Math.round(
            weatherData.current_weather.temperature - 2 + Math.random() * 4,
          ),
          condition: weatherData.current_weather.weathercode,
          time: weatherData.current_weather.time,
        });
      }
    } catch (weatherError) {
      console.error("Weather fetch error:", weatherError);
      setWeather({
        temp: 28 + Math.floor(Math.random() * 5),
        humidity: 70 + Math.floor(Math.random() * 15),
        wind: 5 + Math.floor(Math.random() * 8),
        feelsLike: 30 + Math.floor(Math.random() * 5),
      });
    }
  };

  // আযান প্লে
  const playAdhan = () => {
    if (!soundEnabled || !audioRef.current) return;

    audioRef.current.play().catch(() => {
      addNotification("info", "🔊 আজানের সময় হয়েছে!");
    });
  };

  // নোটিফিকেশন যোগ
  const addNotification = (type, message) => {
    const id = `notif-${Date.now()}-${notificationCounter.current++}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // ফেবারিট টগল
  const toggleFavorite = () => {
    if (!currentCity) return;

    const cityData = {
      name: currentCity,
      nameEn: cityEn,
      method,
      school,
      lastVisited: new Date().toISOString(),
      lat: coordinates?.lat,
      lon: coordinates?.lon,
    };

    setFavorites((prev) => {
      const exists = prev.find((f) => f.name === currentCity);
      if (exists) {
        addNotification(
          "info",
          `${currentCity} পছন্দের তালিকা থেকে সরানো হয়েছে`,
        );
        return prev.filter((f) => f.name !== currentCity);
      } else {
        addNotification(
          "success",
          `${currentCity} পছন্দের তালিকায় যোগ করা হয়েছে`,
        );
        return [cityData, ...prev].slice(0, 10);
      }
    });
  };

  const isFav = favorites.some((f) => f.name === currentCity);

  // ফেবারিট থেকে লোড
  const loadFromFavorite = (favCity) => {
    setCity(favCity.name);
    setCityEn(favCity.nameEn || favCity.name);
    setMethod(favCity.method || method);
    setSchool(favCity.school || school);
    fetchTimings(favCity.name, favCity.nameEn || favCity.name);
  };

  // ডাটা এক্সপোর্ট
  const exportData = () => {
    if (!timings) return;

    const data = {
      app: "রমাদ্বান কারীম",
      version: "4.0",
      exportedAt: new Date().toISOString(),
      city: {
        bn: currentCity,
        en: cityEn,
        coordinates,
      },
      date: {
        gregorian: currentTime.toISOString(),
        gregorianBn: formatBengaliDate(currentTime),
        hijri: hijriDate,
      },
      ramadan: {
        isRamadan: hijriDate?.monthNumber === 9,
        rozaCount,
      },
      prayers: {
        main: timings,
        additional: additionalTimings,
      },
      qibla,
      weather,
      calculation: {
        method: METHODS.find((m) => m.id === method),
        school: SCHOOLS.find((s) => s.id === school),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `রমজান-${currentCity}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();

    addNotification("success", "ডাটা এক্সপোর্ট করা হয়েছে");
  };

  // শেয়ার
  const share = async () => {
    if (!timings) return;

    const countdowns = getCountdowns();
    const iftarCountdown = countdowns.iftar
      ? `\n⏳ ইফতারের সময় হতে বাকি ${countdowns.iftar.text}`
      : "";
    const seharCountdown = countdowns.sehar
      ? `\n⏳ সাহরী শেষ হতে বাকি ${countdowns.sehar.text}`
      : "";

    const nextPrayerText = nextPrayer
      ? `\n🕋 পরবর্তী নামাজ: ${nextPrayer.name} - ${fmt(nextPrayer.time)} (বাকি ${nextPrayer.diff})`
      : "";

    const qiblaText = qibla ? `\n🧭 কিবলা দিক: ${toBengaliNumber(qibla)}°` : "";

    const weatherText = weather
      ? `\n🌡️ তাপমাত্রা: ${toBengaliNumber(weather.temp)}°C`
      : "";

    const ramadanText =
      rozaCount > 0 ? `\n🌙 রমজান: ${toBengaliNumber(rozaCount)}তম রোজা` : "";

    const text = `🕌 রমাদ্বান কারীম - ${currentCity}
    
📅 তারিখ: ${formatBengaliDate(currentTime)}${ramadanText}

🌅 সাহরী (ফজর): ${fmt(timings.Fajr)}${seharCountdown}
🌇 ইফতার (মাগরিব): ${fmt(timings.Maghrib)}${iftarCountdown}${nextPrayerText}${qiblaText}${weatherText}

📏 পদ্ধতি: ${METHODS.find((m) => m.id === method)?.name}
📚 মাযহাব: ${SCHOOLS.find((s) => s.id === school)?.name}

রমজান মোবারক! 🌙`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `রমজান টাইমিংস — ${currentCity}`,
          text,
          url: window.location.href,
        });
        addNotification("success", "শেয়ার করা হয়েছে");
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard?.writeText(text);
          addNotification("info", "টাইমিংস কপি করা হয়েছে");
        }
      }
    } else {
      navigator.clipboard?.writeText(text);
      addNotification("info", "টাইমিংস কপি করা হয়েছে");
    }
  };

  // টাইম ফরম্যাট
  const fmt = (t) => {
    if (!t) return "--:--";
    if (unit === "24h") return formatBengaliTime(t);

    const parsed = parseTime(t);
    if (!parsed) return "--:--";

    const ampm = parsed.hours >= 12 ? "PM" : "AM";
    const hour12 = parsed.hours % 12 || 12;
    return `${toBengaliNumber(hour12)}:${toBengaliNumber(parsed.minutes.toString().padStart(2, "0"))} ${ampm}`;
  };

  // ইনপুট পরিবর্তন হ্যান্ডলার (ডিবাউন্স সহ)
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const countdowns = getCountdowns();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Baloo+Da2:wght@400;500;600;700;800&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
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
          --surface-hover: rgba(255,255,255,0.08);
          --border: rgba(201,168,76,0.2);
          --text: #e2d4b8;
          --text-muted: #9a8a6a;
          --success: #4ecca3;
          --warning: #f5b942;
          --error: #f87171;
          --info: #60a5fa;
        }

        body {
          background: var(--bg);
          color: var(--text);
          line-height: 1.6;
        }

        .bg-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
          background: radial-gradient(ellipse at 20% 20%, #0f1a3a 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 80%, #0f2a1a 0%, transparent 60%),
                      #0a0e1a;
        }

        .nebula1 {
          position: absolute;
          top: 5%;
          right: 10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(45,155,111,0.15) 0%, transparent 70%);
          filter: blur(60px);
        }

        .nebula2 {
          position: absolute;
          bottom: 10%;
          left: 5%;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%);
          filter: blur(50px);
        }

        @keyframes twinkle {
          0%,100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.8); }
        }

        .star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: twinkle var(--dur) var(--delay) infinite ease-in-out;
        }

        .app {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10,14,26,0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 32px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .logo-text {
          font-family: 'Baloo Da 2', sans-serif;
          font-size: 22px;
          color: var(--gold);
        }

        .logo-sub {
          font-size: 13px;
          color: var(--gold-dim);
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .icon-btn:hover {
          background: var(--surface);
          color: var(--text);
        }

        .icon-btn.active {
          color: var(--gold);
          background: rgba(201,168,76,0.1);
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--emerald);
          color: white;
          font-size: 10px;
          padding: 2px 4px;
          border-radius: 10px;
          min-width: 16px;
          text-align: center;
        }

        .hero {
          text-align: center;
          padding: 50px 20px 30px;
        }

        .moon-wrap {
          display: inline-block;
          margin-bottom: 20px;
        }

        .moon-anim {
          animation: float 5s ease-in-out infinite;
          display: inline-block;
          font-size: 72px;
        }

        .hero-greeting {
          font-size: 14px;
          letter-spacing: 5px;
          color: var(--gold-dim);
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .hero-title {
          font-size: clamp(32px, 7vw, 70px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 8px;
          font-family: 'Baloo Da 2', sans-serif;
        }

        .hero-date {
          font-size: 20px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .hero-time {
          font-size: 38px;
          color: var(--gold-light);
          letter-spacing: 4px;
          margin: 12px 0;
          font-family: 'Baloo Da 2', sans-serif;
        }

        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .gold-shimmer {
          background: linear-gradient(90deg, var(--gold-dim), var(--gold-light), var(--gold), var(--gold-light), var(--gold-dim));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 4s linear infinite;
        }

        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,168,76,0.1);
        }

        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 50%);
          border-radius: 24px;
          pointer-events: none;
        }

        .card-glow {
          animation: cardGlow 4s ease-in-out infinite;
        }

        @keyframes cardGlow {
          0%,100% { box-shadow: 0 0 0 1px rgba(201,168,76,0.2), 0 4px 30px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 1px rgba(201,168,76,0.4), 0 4px 40px rgba(201,168,76,0.2); }
        }

        .card-elevation-low { box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .card-elevation-medium { box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
        .card-elevation-high { box-shadow: 0 8px 32px rgba(0,0,0,0.4); }

        .tooltip-container {
          position: relative;
          display: inline-block;
        }

        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 100;
          margin-bottom: 8px;
          backdrop-filter: blur(10px);
        }

        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: var(--border) transparent transparent transparent;
        }

        .accuracy-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          background: rgba(78,204,163,0.1);
          color: var(--emerald-light);
        }

        .ramadan-badge {
          background: linear-gradient(135deg, var(--emerald-dim), var(--emerald));
          color: white;
          padding: 12px 24px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .countdown-grid {
            grid-template-columns: 1fr;
          }
        }

        .countdown-card {
          padding: 20px;
          text-align: center;
        }

        .countdown-label {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .countdown-value {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 700;
          color: var(--gold-light);
          font-family: 'Baloo Da 2', sans-serif;
        }

        .countdown-sub {
          font-size: 13px;
          color: var(--gold-dim);
          margin-top: 4px;
        }

        .search-wrap {
          padding: 28px;
          margin-bottom: 20px;
        }

        .search-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .search-row {
            flex-direction: column;
          }
        }

        .search-input-wrap {
          flex: 1;
          position: relative;
        }

        .search-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px 20px 16px 50px;
          font-size: 18px;
          color: var(--text);
          font-family: 'Hind Siliguri', sans-serif;
          outline: none;
          transition: all 0.2s;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-input:focus {
          border-color: var(--gold);
          background: rgba(201,168,76,0.05);
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-btn {
          background: linear-gradient(135deg, var(--emerald-dim), var(--emerald));
          border: none;
          border-radius: 16px;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          font-family: 'Baloo Da 2', sans-serif;
          transition: all 0.2s;
        }

        .search-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45,155,111,0.4);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .suggestions {
          position: absolute;
          z-index: 99;
          width: 100%;
          top: calc(100% + 8px);
          background: rgba(10,14,26,0.98);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .suggestion-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: none;
          border: none;
          color: var(--text);
          font-size: 16px;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s;
        }

        .suggestion-item:hover {
          background: rgba(201,168,76,0.1);
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 12px;
          margin-bottom: 16px;
          color: var(--error);
        }

        .next-banner {
          padding: 24px 28px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, rgba(45,155,111,0.15), rgba(201,168,76,0.1));
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .next-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .next-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          background: rgba(78,204,163,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .next-label {
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .next-name {
          font-size: 22px;
          font-weight: 600;
          color: var(--text);
          font-family: 'Baloo Da 2', sans-serif;
        }

        .next-time {
          font-size: 32px;
          color: var(--emerald-light);
          letter-spacing: 2px;
        }

        .next-diff {
          font-size: 14px;
          color: var(--text-muted);
        }

        .twin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 580px) {
          .twin-grid {
            grid-template-columns: 1fr;
          }
        }

        .main-card {
          padding: 32px 28px;
        }

        .mc-badge {
          font-size: 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mc-badge-sehar {
          color: var(--emerald-light);
        }

        .mc-badge-iftar {
          color: var(--warning);
        }

        .mc-time {
          font-size: clamp(40px, 8vw, 56px);
          font-weight: 700;
          letter-spacing: 2px;
          margin: 4px 0;
          font-family: 'Baloo Da 2', sans-serif;
        }

        .mc-sub {
          font-size: 15px;
          color: var(--text-muted);
        }

        .mc-emoji {
          font-size: 44px;
        }

        .mc-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .mc-countdown {
          font-size: 14px;
          color: var(--emerald-light);
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--border);
        }

        .mc-countdown-iftar {
          color: var(--warning);
        }

        .prayers-wrap {
          padding: 28px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--gold);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .prayers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        @media (max-width: 480px) {
          .prayers-grid {
            grid-template-columns: 1fr;
          }
        }

        .prayer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid transparent;
          transition: all 0.2s;
        }

        .prayer-row:hover {
          background: rgba(255,255,255,0.05);
        }

        .prayer-row-next {
          background: rgba(201,168,76,0.1);
          border-color: var(--border);
        }

        .prayer-row-additional {
          opacity: 0.8;
        }

        .prayer-row-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .prayer-icon {
          font-size: 22px;
        }

        .prayer-name {
          font-size: 16px;
          font-weight: 500;
        }

        .prayer-badge {
          font-size: 11px;
          color: var(--gold);
          margin-top: 2px;
        }

        .prayer-time {
          font-size: 18px;
          font-family: 'Baloo Da 2', sans-serif;
        }

        .prayer-time-next {
          color: var(--gold-light);
        }

        .weather-wrap {
          padding: 28px;
          margin-bottom: 20px;
        }

        .weather-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        @media (max-width: 500px) {
          .weather-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .weather-item {
          padding: 14px;
          background: rgba(255,255,255,0.03);
          border-radius: 14px;
        }

        .weather-label {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .weather-val {
          font-size: 20px;
          font-weight: 600;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn:hover {
          border-color: var(--gold);
          color: var(--text);
          background: rgba(201,168,76,0.08);
        }

        .action-btn-active {
          background: rgba(201,168,76,0.15);
          border-color: var(--gold);
          color: var(--gold);
        }

        .action-btn-settings {
          margin-left: auto;
        }

        .settings-wrap {
          padding: 28px;
          margin-bottom: 20px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 480px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        .field-label {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .field-select {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text);
          font-size: 16px;
          font-family: 'Hind Siliguri', sans-serif;
          outline: none;
          cursor: pointer;
        }

        .field-select:focus {
          border-color: var(--gold);
        }

        .field-description {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
          padding-left: 8px;
        }

        .settings-note {
          margin-top: 16px;
          padding: 12px;
          background: rgba(78,204,163,0.05);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-muted);
        }

        .fav-wrap {
          padding: 28px;
          margin-bottom: 20px;
        }

        .fav-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .fav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border);
        }

        .fav-name {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          cursor: pointer;
          flex: 1;
          transition: color 0.2s;
        }

        .fav-name:hover {
          color: var(--gold);
        }

        .fav-remove {
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 8px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .fav-remove:hover {
          color: var(--error);
        }

        .qibla-wrap {
          padding: 20px;
          margin-bottom: 20px;
          background: rgba(78,204,163,0.05);
          border-radius: 16px;
        }

        .qibla-direction {
          font-size: 24px;
          font-family: 'Baloo Da 2', sans-serif;
          color: var(--emerald-light);
        }

        .notifications {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 300px;
        }

        .notification {
          padding: 12px 16px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
          animation: slideIn 0.3s ease;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .notification-success {
          border-left: 4px solid var(--success);
        }

        .notification-error {
          border-left: 4px solid var(--error);
        }

        .notification-info {
          border-left: 4px solid var(--info);
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .info-wrap {
          padding: 28px;
        }

        .info-inner {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .info-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(78,204,163,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .info-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .info-body {
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .info-meta {
          margin-top: 12px;
          font-size: 14px;
          color: var(--gold-dim);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .mb-5 {
          margin-bottom: 20px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .text-emerald {
          color: var(--emerald-light);
        }

        .text-gold {
          color: var(--gold-light);
        }

        .debug-panel {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: rgba(0,0,0,0.8);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px;
          font-size: 12px;
          color: var(--text-muted);
          max-width: 300px;
          z-index: 10000;
        }
      `}</style>

      {/* অডিও এলিমেন্ট */}
      <audio ref={audioRef} preload="none" />

      {/* ডিবাগ প্যানেল (শুধু ডেভেলপমেন্টের জন্য) */}
      {debugInfo && process.env.NODE_ENV === "development" && (
        <div className="debug-panel">
          <div>Original Hijri Day: {debugInfo.originalDay}</div>
          <div>After Maghrib: {debugInfo.adjustedDay}</div>
          <div>Final with adjustment: {debugInfo.finalDay}</div>
          <div>Month: {debugInfo.month}</div>
          <div>Maghrib: {debugInfo.maghrib}</div>
        </div>
      )}

      {/* নোটিফিকেশন */}
      <div className="notifications">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            notification={n}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>

      {/* ব্যাকগ্রাউন্ড */}
      <div className="bg-fixed">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
              animationDuration: `${star.dur}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
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
              <div className="logo-text">রমাদ্বান টাইমস</div>
              <div className="logo-sub">
                {networkStatus ? "অনলাইন" : "অফলাইন"}
              </div>
            </div>
          </div>
          <div className="header-actions">
            <Tooltip text={soundEnabled ? "সাউন্ড অন" : "সাউন্ড অফ"}>
              <button
                className="icon-btn"
                onClick={() => setSoundEnabled((v) => !v)}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </Tooltip>
            {/* ২৪/১২ ঘন্টা বাটন (ইচ্ছা করলে আনকমেন্ট করতে পারেন) */}
            {/* <Tooltip text={unit === "12h" ? "১২ ঘন্টা" : "২৪ ঘন্টা"}>
              <button className="icon-btn" onClick={() => setUnit(u => u === "12h" ? "24h" : "12h")}>
                {unit === "12h" ? "১২ঘ" : "২৪ঘ"}
              </button>
            </Tooltip> */}
          </div>
        </header>

        <div className="container">
          {/* হিরো */}
          <div className="hero">
            <div className="moon-wrap">
              <span className="moon-anim">🌙</span>
            </div>
            <div className="hero-greeting">রমজান মোবারক</div>
            <h1 className="hero-title">
              <GoldText>রমাদ্বান কারীম</GoldText>
            </h1>
            <div className="hero-date">
              {hijriDate ? (
                <>
                  {toBengaliNumber(hijriDate.day)} {hijriDate.monthAr} {toBengaliNumber(hijriDate.year)}, 
                </>
              ) : null}
              {WEEKDAYS[currentTime.getDay()]}, {formatBengaliDate(currentTime)}
            </div>
            <div className="hero-time font-bold">
              {format12Time(currentTime)}
            </div>
            {accuracy && (
              <div className="accuracy-badge" style={{ marginTop: "8px" }}>
                {accuracy.message}
              </div>
            )}
          </div>

          {/* সার্চ */}
          <Card className="search-wrap mb-5" elevation="high">
            <div className="search-row">
              <div className="search-input-wrap">
                <MapPin size={20} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="বাংলায় শহর লিখুন  ( খুলনা,ঢাকা, চট্টগ্রাম. . . ইত্যাদি )"
                  value={city}
                  onChange={handleCityChange}
                  onKeyDown={(e) => e.key === "Enter" && fetchTimings()}
                />
                {suggestions.length > 0 && (
                  <div className="suggestions">
                    {suggestions.map((s, index) => (
                      <button
                        key={`suggestion-${s.bn}-${index}`}
                        className="suggestion-item"
                        onClick={() => {
                          setCity(s.bn);
                          setCityEn(s.en);
                          fetchTimings(s.bn, s.en);
                          setSuggestions([]);
                        }}
                      >
                        <MapPin size={16} style={{ color: "var(--gold)" }} />
                        <div>
                          <div>
                            {s.bn}, {s.country}
                          </div>
                          {s.population && (
                            <small style={{ color: "var(--text-muted)" }}>
                              {s.population}
                            </small>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className="search-btn"
                onClick={() => fetchTimings()}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw size={18} className="spin" />
                ) : (
                  <Zap size={18} />
                )}
                {loading ? "খোঁজ করা হচ্ছে..." : "খুঁজুন"}
              </button>
            </div>

            {error && (
              <div className="error-box">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* স্ট্যাটিক পপুলার সিটি চিপস সরিয়ে দেওয়া হয়েছে */}

            {lastUpdated && (
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "12px",
                  textAlign: "center",
                }}
              >
                সর্বশেষ আপডেট: {lastUpdated.toLocaleTimeString("bn-BD")}
                {offlineMode && " (অফলাইন)"}
              </div>
            )}
          </Card>

          {/* টাইমিংস */}
          {timings && (
            <>
              {/* রমজান ব্যাজ */}
              {rozaCount > 0 && (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div className="ramadan-badge">
                    <Award size={24} />
                    <span>
                      {toBengaliNumber(rozaCount)} তম রোজা · রমজান{" "}
                      {toBengaliNumber(hijriDate?.day || "")}
                    </span>
                  </div>
                </div>
              )}

              {/* কাউন্টডাউন */}
              {showCountdown && (
                <div className="countdown-grid">
                  <Card
                    className="countdown-card"
                    glow={countdowns.sehar?.seconds < 300}
                  >
                    <div className="countdown-label">
                      <Coffee
                        size={16}
                        style={{ display: "inline", marginRight: "6px" }}
                      />
                      সাহরী শেষ হতে বাকি
                    </div>
                    <div className="countdown-value text-2xl">
                      {countdowns.sehar ? countdowns.sehar.text : "--"}
                    </div>
                    <div className="countdown-sub">
                      ফজর: {fmt(timings.Fajr)}
                    </div>
                  </Card>

                  <Card
                    className="countdown-card"
                    glow={countdowns.iftar?.seconds < 300}
                  >
                    <div className="countdown-label">
                      <Utensils
                        size={16}
                        style={{ display: "inline", marginRight: "6px" }}
                      />
                      ইফতারের সময় হতে বাকি
                    </div>
                    <div className="countdown-value text-2xl">
                      {countdowns.iftar ? countdowns.iftar.text : "--"}
                    </div>
                    <div className="countdown-sub">
                      মাগরিব: {fmt(timings.Maghrib)}
                    </div>
                  </Card>
                </div>
              )}

              {/* পরবর্তী নামাজ */}
              {nextPrayer && (
                <Card
                  className="next-banner mb-5"
                  glow={nextPrayer.diffMinutes < 5}
                >
                  <div className="next-left">
                    <div className="next-icon-wrap">
                      <Clock
                        size={24}
                        style={{ color: "var(--emerald-light)" }}
                      />
                    </div>
                    <div>
                      <div className="next-label">পরবর্তী নামাজ</div>
                      <div className="next-name">{nextPrayer.name}</div>
                      {nextPrayer.type === "additional" && (
                        <div className="accuracy-badge">অতিরিক্ত</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="next-time">{fmt(nextPrayer.time)}</div>
                    <div className="next-diff">বাকি {nextPrayer.diff}</div>
                  </div>
                </Card>
              )}

              {/* কিবলা */}
              {qibla && (
                <Card className="qibla-wrap mb-5">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <Compass
                      size={24}
                      style={{ color: "var(--emerald-light)" }}
                    />
                    <div>
                      <div
                        style={{ fontSize: "14px", color: "var(--text-muted)" }}
                      >
                        কিবলা দিক
                      </div>
                      <div className="qibla-direction">
                        {toBengaliNumber(qibla)}°
                      </div>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <Navigation
                        size={24}
                        style={{
                          transform: `rotate(${qibla}deg)`,
                          color: "var(--gold)",
                        }}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* সাহরী ও ইফতার */}
              <div className="twin-grid">
                <Card className="main-card" glow={nextPrayer?.key === "Fajr"}>
                  <div className="mc-top">
                    <div>
                      <div className="mc-badge mc-badge-sehar">
                        <Moon size={14} /> সাহরী · ফজর
                      </div>
                      <div
                        className="mc-time"
                        style={{ color: "var(--emerald-light)" }}
                      >
                        {fmt(timings.Fajr)}
                      </div>
                      <div className="mc-sub">সেহরির শেষ সময়</div>
                    </div>
                    <div className="mc-emoji">🌙</div>
                  </div>
                  {countdowns.sehar && (
                    <div className="mc-countdown">
                      সাহরী শেষ হতে বাকি {countdowns.sehar.text}
                    </div>
                  )}
                </Card>

                <Card
                  className="main-card"
                  glow={nextPrayer?.key === "Maghrib"}
                >
                  <div className="mc-top">
                    <div>
                      <div className="mc-badge mc-badge-iftar">
                        <Sun size={14} /> ইফতার · মাগরিব
                      </div>
                      <div
                        className="mc-time"
                        style={{ color: "var(--warning)" }}
                      >
                        {fmt(timings.Maghrib)}
                      </div>
                      <div className="mc-sub">ইফতারের সময়</div>
                    </div>
                    <div className="mc-emoji">☀️</div>
                  </div>
                  {countdowns.iftar && (
                    <div className="mc-countdown mc-countdown-iftar">
                      ইফতারের সময় হতে বাকি {countdowns.iftar.text}
                    </div>
                  )}
                </Card>
              </div>

              {/* মূল নামাজ */}
              <Card className="prayers-wrap mb-5">
                <div className="section-title">
                  <Layers size={18} /> নামাজের সময় শুরু - {currentCity}
                </div>
                <div className="prayers-grid">
                  {PRAYERS.map((p) => (
                    <div
                      key={`prayer-${p.key}`}
                      className={`prayer-row ${nextPrayer?.key === p.key ? "prayer-row-next" : ""}`}
                    >
                      <div className="prayer-row-left">
                        <span className="prayer-icon">{p.icon}</span>
                        <div>
                          <div className="prayer-name">{p.name}</div>
                          <div className="prayer-badge">{p.timeName}</div>
                        </div>
                      </div>
                      <div
                        className={`prayer-time ${nextPrayer?.key === p.key ? "prayer-time-next" : ""}`}
                      >
                        {fmt(timings[p.key])}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* অতিরিক্ত নামাজ */}
              {additionalTimings && (
                <Card className="prayers-wrap mb-5">
                  <div className="section-title">
                    <Star size={18} /> অতিরিক্ত নামাজ
                  </div>
                  <div className="prayers-grid">
                    {ADDITIONAL_PRAYERS.map((p) => (
                      <div
                        key={`additional-${p.key}`}
                        className={`prayer-row prayer-row-additional ${nextPrayer?.key === p.key ? "prayer-row-next" : ""}`}
                      >
                        <div className="prayer-row-left">
                          <span className="prayer-icon">{p.icon}</span>
                          <div>
                            <div className="prayer-name">{p.name}</div>
                            <div className="prayer-badge">{p.timeName}</div>
                          </div>
                        </div>
                        <div
                          className={`prayer-time ${nextPrayer?.key === p.key ? "prayer-time-next" : ""}`}
                        >
                          {fmt(additionalTimings[p.key])}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* আবহাওয়া */}
              {weather && (
                <Card className="weather-wrap mb-5">
                  <div className="section-title">
                    <Cloud size={18} /> {currentCity} এর আবহাওয়া
                  </div>
                  <div className="weather-grid">
                    <div className="weather-item">
                      <div className="weather-label">তাপমাত্রা</div>
                      <div className="weather-val">
                        {toBengaliNumber(weather.temp)}°C
                      </div>
                    </div>
                    <div className="weather-item">
                      <div className="weather-label">অনুভূতি</div>
                      <div className="weather-val">
                        {toBengaliNumber(weather.feelsLike)}°C
                      </div>
                    </div>
                    <div className="weather-item">
                      <div className="weather-label">আর্দ্রতা</div>
                      <div className="weather-val">
                        {toBengaliNumber(weather.humidity)}%
                      </div>
                    </div>
                    <div className="weather-item">
                      <div className="weather-label">বাতাস</div>
                      <div className="weather-val">
                        {toBengaliNumber(weather.wind)} m/s
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* অ্যাকশন বাটন */}
              <div className="actions">
                <Tooltip
                  text={
                    isFav
                      ? "পছন্দের তালিকা থেকে সরান"
                      : "পছন্দের তালিকায় যোগ করুন"
                  }
                >
                  <button
                    className={`action-btn ${isFav ? "action-btn-active" : ""}`}
                    onClick={toggleFavorite}
                  >
                    <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                    {isFav ? "সংরক্ষিত" : "পছন্দ"}
                  </button>
                </Tooltip>

                <Tooltip text="JSON ডাউনলোড">
                  <button className="action-btn" onClick={exportData}>
                    <Download size={16} /> ডাউনলোড
                  </button>
                </Tooltip>

                <Tooltip text="শেয়ার">
                  <button className="action-btn" onClick={share}>
                    <Share2 size={16} /> শেয়ার
                  </button>
                </Tooltip>

                <Tooltip
                  text={
                    showCountdown
                      ? "কাউন্টডাউন বন্ধ করুন"
                      : "কাউন্টডাউন চালু করুন"
                  }
                >
                  <button
                    className={`action-btn ${showCountdown ? "action-btn-active" : ""}`}
                    onClick={() => setShowCountdown((v) => !v)}
                  >
                    <Bell size={16} /> কাউন্টডাউন
                  </button>
                </Tooltip>

                <Tooltip text="সেটিংস">
                  <button
                    className={`action-btn action-btn-settings ${showSettings ? "action-btn-active" : ""}`}
                    onClick={() => setShowSettings((v) => !v)}
                  >
                    <Settings size={16} /> সেটিংস
                  </button>
                </Tooltip>
              </div>

              {/* সেটিংস */}
              {showSettings && (
                <Card className="settings-wrap mb-5">
                  <div className="section-title">
                    <Settings size={18} /> সেটিংস
                  </div>
                  <div className="settings-grid">
                    <div>
                      <div className="field-label">মেথড</div>
                      <select
                        className="field-select"
                        value={method}
                        onChange={(e) => setMethod(Number(e.target.value))}
                      >
                        {METHODS.map((m) => (
                          <option key={`method-${m.id}`} value={m.id}>
                            {m.name} ({m.accuracy})
                          </option>
                        ))}
                      </select>
                      <div className="field-description">
                        {METHODS.find((m) => m.id === method)?.region}
                      </div>
                    </div>

                    <div>
                      <div className="field-label">মাযহাব (আসর)</div>
                      <select
                        className="field-select"
                        value={school}
                        onChange={(e) => setSchool(Number(e.target.value))}
                      >
                        {SCHOOLS.map((s) => (
                          <option key={`school-${s.id}`} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <div className="field-description">
                        {SCHOOLS.find((s) => s.id === school)?.description}
                      </div>
                    </div>

                    <div>
                      <div className="field-label">হিজরি সমন্বয়</div>
                      <select
                        className="field-select"
                        value={hijriAdjustment}
                        onChange={(e) =>
                          setHijriAdjustment(Number(e.target.value))
                        }
                      >
                        <option key="adjustment--1" value={-1}>
                          -১ দিন
                        </option>
                        <option key="adjustment-0" value={0}>
                          ০ দিন
                        </option>
                        <option key="adjustment-1" value={1}>
                          +১ দিন
                        </option>
                      </select>
                      <div className="field-description">
                        বাংলাদেশের জন্য -১ দিন ব্যবহার করুন
                      </div>
                    </div>

                    <div>
                      <div className="field-label">অটো রিফ্রেশ</div>
                      <select
                        className="field-select"
                        value={autoRefresh ? "yes" : "no"}
                        onChange={(e) =>
                          setAutoRefresh(e.target.value === "yes")
                        }
                      >
                        <option key="refresh-no" value="no">
                          বন্ধ
                        </option>
                        <option key="refresh-yes" value="yes">
                          চালু (১৫ মিনিট)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="settings-note">
                    <Info
                      size={16}
                      style={{ marginRight: "8px", verticalAlign: "middle" }}
                    />
                    সেটিংস পরিবর্তনের পর নতুন করে সার্চ করুন।
                  </div>
                </Card>
              )}

              {/* ফেবারিট */}
              {favorites.length > 0 && (
                <Card className="fav-wrap mb-5">
                  <div className="section-title">
                    <Star size={18} /> পছন্দের শহর
                  </div>
                  <div className="fav-list">
                    {favorites.map((fav, index) => (
                      <div
                        key={`fav-${fav.name}-${index}`}
                        className="fav-item"
                      >
                        <div
                          className="fav-name"
                          onClick={() => loadFromFavorite(fav)}
                        >
                          <MapPin size={18} style={{ color: "var(--gold)" }} />
                          <div>
                            <div>{fav.name}</div>
                            {fav.lastVisited && (
                              <small style={{ color: "var(--text-muted)" }}>
                                সর্বশেষ:{" "}
                                {new Date(fav.lastVisited).toLocaleDateString(
                                  "bn-BD",
                                )}
                              </small>
                            )}
                          </div>
                          <ChevronRight
                            size={16}
                            style={{
                              marginLeft: "auto",
                              color: "var(--text-muted)",
                            }}
                          />
                        </div>
                        <button
                          className="fav-remove"
                          onClick={() =>
                            setFavorites((prev) =>
                              prev.filter((f) => f.name !== fav.name),
                            )
                          }
                        >
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
                <Moon size={22} style={{ color: "var(--emerald-light)" }} />
              </div>
              <div>
                <div className="info-title">রমাদ্বান টাইমস</div>
                <div className="info-body">
                  নামাজের সময় Astronomy অ্যালগরিদম ব্যবহার করে গণনা করা হয়। এখানে নামাজের ওয়াক্ত শুরুর সময় উল্লেখিত আছে। 
                  নির্ভুল জামা'আত শুরুর সময়ের জন্য স্থানীয় মসজিদের সাথে যাচাই করুন।
                </div>
                <div className="info-meta">
                  <span key="" className="text-yellow-500 ">
                    <a href="https://tamjidbond.netlify.app/" target="_blank">Tamjid Bond</a>
                  </span>
                   <span key="info-sep3">·</span>
                  <span key="info-school">
                    {SCHOOLS.find((s) => s.id === school)?.name}
                  </span>
                  <span key="info-sep3">·</span>
                  <span key="info-country">বাংলাদেশের জন্য উপযুক্ত</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}