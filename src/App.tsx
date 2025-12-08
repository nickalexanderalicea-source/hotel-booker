import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  ChevronLeft,
  Check,
  Menu,
  User,
  Home,
  Bookmark,
  Settings,
  Filter,
  X,
  
} from "lucide-react";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const translations = {
  es: {
    login: "Iniciar Sesión",
    signup: "Crear Cuenta",
    email: "Correo",
    password: "Contraseña",
    enter: "Entrar",
    noAccount: "¿No tienes cuenta?",
    yesAccount: "¿Ya tienes cuenta?",
    register: "Registrarse",
    changeLang: "Cambiar idioma",
    destination: "Destino",
    searchHotels: "Buscar Hoteles",
    filters: "Filtros",
    priceRange: "Rango de Precio",
    min: "Min",
    max: "Max",
    rating: "Calificación Mínima",
    services: "Servicios",
    clean: "Limpiar",
    results: "Resultados",
    guests: "Huéspedes",
    home: "Inicio",
    favorites: "Favoritos",
    saved: "Mis Reservas",
    menu: "Menú",
    settings: "Configuración",
    language: "Idioma",
    moreOptions: "Más Opciones",
    comingSoon: "Próximamente",
    homeTitle: "¿A dónde viajas?",
    destinationPlaceholder: "Destino",
    nights: "Noches",
    perNight: "por noche",
    bestOffer: "Mejor Oferta",
    selectRoom: "Seleccionar",
    availableRooms: "Habitaciones disponibles",
    confirmed: "Confirmada",
  },

  en: {
    login: "Login",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    enter: "Log In",
    noAccount: "Don’t have an account?",
    yesAccount: "Already have an account?",
    register: "Sign Up",
    changeLang: "Change language",
    destination: "Destination",
    searchHotels: "Search Hotels",
    filters: "Filters",
    priceRange: "Price Range",
    min: "Min",
    max: "Max",
    rating: "Minimum Rating",
    services: "Amenities",
    clean: "Clear",
    results: "Results",
    guests: "Guests",
    home: "Home",
    favorites: "Favorites",
    saved: "My Bookings",
    menu: "Menu",
    settings: "Settings",
    language: "Language",
    moreOptions: "More Options",
    comingSoon: "Coming soon",
    homeTitle: "Where are you traveling?",
    destinationPlaceholder: "Destination",
    nights: "Nights",
    perNight: "per night",
    bestOffer: "Best Offer",
    selectRoom: "Select",
    availableRooms: "Available rooms",
    confirmed: "Confirmed",

  }
};

function t(language, key) {
  return translations[language][key] || key;
}


const CURRENCY = new Intl.NumberFormat("es-PR", { style: "currency", currency: "USD" });


function LoginScreen({ goSignup, login, language, setLanguage }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  return (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
    <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-xl flex flex-col relative">

      {/* Botón para cambiar idioma (arriba izquierda) */}
      <div className="absolute left-4 top-4 overflow-visible">
        <Tooltip text={language === "es" ? "Cambiar idioma" : "Change language"}>
          <button
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="text-xl border-2 border-black px-3 py-1 rounded-xl shadow-sm bg-white"
            aria-label={language === "es" ? "Cambiar idioma" : "Change language"}
          >
            {language === "es" ? "🇺🇸" : "🇵🇷"}
          </button>
        </Tooltip>
      </div>

      {/* Título */}
      <h1 className="text-2xl font-bold text-center mb-6 mt-10">
        {t(language, "login")}
      </h1>

      {/* Email */}
      <input
        className="w-full p-3 border rounded-xl mb-3"
        placeholder={t(language, "email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <input
        type="password"
        className="w-full p-3 border rounded-xl mb-3"
        placeholder={t(language, "password")}
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={() => login(email, pass, setError)}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
      >
        {t(language, "enter")}
      </button>

      <p className="mt-4 text-center text-sm">
        {t(language, "noAccount")}
        <button onClick={goSignup} className="text-blue-600 ml-1 underline">
          {t(language, "signup")}
        </button>
      </p>
    </div>
  </div>
);
}
 

function SignUpScreen({ goLogin, registerUser, language, setLanguage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const t = {
    es: {
      title: "Crear Cuenta",
      name: "Nombre completo",
      email: "Correo",
      password: "Contraseña",
      button: "Registrarse",
      haveAccount: "¿Ya tienes cuenta?",
      login: "Iniciar Sesión",
    },
    en: {
      title: "Create Account",
      name: "Full name",
      email: "Email",
      password: "Password",
      button: "Sign up",
      haveAccount: "Already have an account?",
      login: "Sign in",
    },
  }[language || "es"];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-blue-500 p-6">
      <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-xl flex flex-col relative">

        {/* Botón idioma arriba izquierda */}
        <div className="absolute left-4 top-4 overflow-visible">
          <Tooltip text={language === "es" ? "Cambiar idioma" : "Change language"}>
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="text-xl border-2 border-black px-3 py-1 rounded-xl shadow-sm bg-white"
              aria-label={language === "es" ? "Cambiar idioma" : "Change language"}
            >
              {language === "es" ? "🇺🇸" : "🇵🇷"}
            </button>
          </Tooltip>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6 mt-10">{t.title}</h1>

        <input
          className="w-full p-3 border rounded-xl mb-3"
          placeholder={t.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-xl mb-3"
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded-xl mb-3"
          placeholder={t.password}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button
          onClick={() => registerUser({ name, email, pass }, setError)}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
        >
          {t.button}
        </button>

        <p className="mt-4 text-center text-sm">
          {t.haveAccount}
          <button onClick={goLogin} className="text-purple-600 ml-1 underline">
            {t.login}
          </button>
        </p>
      </div>
    </div>
  );
}



interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute left-1/2 -translate-x-1/2 -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg pointer-events-none shadow-lg whitespace-nowrap z-50">
      {text}
    </div>
  </div>
);



const SettingsScreen = ({ language, setLanguage, setCurrentScreen }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 🔹 HEADER */}
      <HeaderBar
        title={language === "es" ? "Configuración" : "Settings"}
        onBack={() => setCurrentScreen("home")}
      />

      <div className="p-6 space-y-8">

        {/* 🌐 LANGUAGE */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {language === "es" ? "Idioma" : "Language"}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            {language === "es"
              ? "Selecciona el idioma de la aplicación."
              : "Select the application language."}
          </p>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "es" | "en")}
            className="w-full px-4 py-3 border-2 bg-gray-50 border-gray-200 rounded-xl text-gray-800 focus:border-blue-500 outline-none"
          >
            <option value="es">🇵🇷 Español</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>

        {/* 🔔 PREFERENCES */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {language === "es" ? "Preferencias" : "Preferences"}
          </h3>

          <div className="space-y-3">
            {[
              language === "es" ? "Notificaciones" : "Notifications",
              language === "es" ? "Tema Oscuro" : "Dark Mode",
              language === "es" ? "Moneda Preferida" : "Preferred Currency",
              language === "es" ? "Recordatorios de Viaje" : "Travel Reminders",
              language === "es" ? "Alertas de Precios" : "Price Alerts",
            ].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <span className="text-gray-700 text-sm">
                  {item} (
                  {language === "es" ? "Próximamente" : "Coming Soon"})
                </span>
                <span className="text-gray-400 text-xs">🔒</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🧪 EXPERIMENTAL */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {language === "es"
              ? "Funciones Experimentales"
              : "Experimental Features"}
          </h3>

          <div className="space-y-3">
            {[
              language === "es" ? "Vista 3D de Hoteles" : "3D Hotel View",
              language === "es" ? "Modo Viaje Inteligente" : "Smart Travel Mode",
              language === "es" ? "Asistente de Itinerario AI" : "AI Itinerary Assistant",
              language === "es" ? "Filtrado Predictivo" : "Predictive Filtering",
              language === "es" ? "Modo Offline" : "Offline Mode",
            ].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >
                <span className="text-gray-700 text-sm">
                  {item} (
                  {language === "es" ? "Próximamente" : "Coming Soon"})
                </span>
                <span className="text-gray-400 text-xs">🧪</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};


function cx(...list) {
  return list.filter(Boolean).join(" ");
}

function safeParseInt(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function dateDiffInNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 3; // default UX
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const ms = outD.getTime() - inD.getTime();
  const nights = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
  return nights;
}

function makeConfirmationNumber() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint32Array(2);
    window.crypto.getRandomValues(arr);
    return (
      "HB" +
      Array.from(arr)
        .map((n) => n.toString(36).toUpperCase().slice(0, 5))
        .join("")
        .slice(0, 9)
    );
  }
  return "HB" + Math.random().toString(36).replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 9);
}

function downloadICS({ title, location, start, end, description }) {
  const dt = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    const dt = new Date(d);
    return (
      dt.getUTCFullYear().toString() +
      pad(dt.getUTCMonth() + 1) +
      pad(dt.getUTCDate()) +
      "T" +
      pad(dt.getUTCHours()) +
      pad(dt.getUTCMinutes()) +
      pad(dt.getUTCSeconds()) +
      "Z"
    );
  };
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HotelBooker//ES",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reserva.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type CardProps = React.PropsWithChildren<{ className?: string }>;

const Card: React.FC<CardProps> = ({ className, children }) => (
  <div className={["bg-white rounded-2xl shadow-md", className].filter(Boolean).join(" ")}>
    {children}
  </div>
);


const HeaderBar: React.FC<{
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}> = ({ title, onBack, right }) => (
  <div className="bg-white p-4 pt-8 shadow-sm sticky top-0 z-40">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {onBack ? (
          <button aria-label="Regresar" onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <span className="w-10" />
        )}
        <h2 className="text-lg font-semibold ml-1">{title}</h2>
      </div>
      <div>{right}</div>
    </div>
  </div>
);


const BottomNav = ({ active, go, language }) => {
  // Textos traducidos
  const t = {
    home: language === "es" ? "Inicio" : "Home",
    results: language === "es" ? "Buscar" : "Search",
    saved: language === "es" ? "Mis reservas" : "My bookings",
    menu: language === "es" ? "Menú" : "Menu",
  };

  const items = [
    { id: "home", icon: Home, label: t.home },
    { id: "results", icon: Search, label: t.results },
    { id: "saved", icon: Bookmark, label: t.saved },
    { id: "menu", icon: User, label: t.menu },
  ];

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around"
      aria-label={language === "es" ? "Navegación inferior" : "Bottom navigation"}
    >
      {items.map((item) => (
        <Tooltip key={item.id} text={item.label}>
          <button
            onClick={() => (item.id === "menu" ? go("menu") : go(item.id))}
            className={cx(
              "flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-2",
              active === item.id ? "text-blue-600" : "text-gray-400"
            )}
            aria-current={active === item.id ? "page" : undefined}
            aria-label={item.label}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        </Tooltip>
      ))}
    </nav>
  );
};


// Reutilizable: lógica de coincidencia para tests y para Resultados
export function matchesHotel(hotel, query, guests) {
  const q = (query || "").trim().toLowerCase();
  const g = Number(guests) || 0;
  const matchText = !q || hotel.name.toLowerCase().includes(q) || hotel.location.toLowerCase().includes(q);
  const capacityOk = g === 0 || hotel.rooms?.some((r) => r.capacity >= g);
  return Boolean(matchText && capacityOk);
}

// Pequeños "tests" de desarrollo (no rompen producción)
function runDevTests() {
  try {
    console.assert(dateDiffInNights("2025-11-15", "2025-11-18") === 3, "dateDiffInNights básico falla");
    console.assert(dateDiffInNights("2025-11-15", "2025-11-15") === 1, "mínimo 1 noche");

    const h1 = { name: "Hotel Test", location: "San Juan", rooms: [{ capacity: 2 }] };
    console.assert(matchesHotel(h1, "san", 2) === true, "match por ubicación/capacidad");
    console.assert(matchesHotel(h1, "ponce", 2) === false, "no match ubicación");
    console.assert(matchesHotel(h1, "", 3) === false, "capacidad insuficiente");
    // eslint-disable-next-line no-console
    console.log("✅ Tests dev OK");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("⚠️ Tests dev: ", e);
  }
}
// ---- Reutilizable: input memoizado
const InputField = React.memo(function InputField({
  id,
  type = "text",
  inputMode,
  label,
  placeholder,
  value = "",
  onChange,
  error,
  maxLength,
}: {
  id: string;
  type?: string;
  inputMode?: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (val: string) => void;
  error?: string;
  maxLength?: number;
}) {
  const cx = (...list: string[]) => list.filter(Boolean).join(" ");
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-label={label}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cx(
          "w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:outline-none",
          error ? "border-red-400" : "border-gray-200"
        )}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
});

// ---- Formulario de datos personales + pago + solicitudes
const PersonalForm = React.memo(function PersonalForm({
  bookingData,
  setBookingData,
  errors,
  language,
}: {
  bookingData: {
    name: string;
    email: string;
    phone: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
    specialRequests: string;
  };
  setBookingData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  language: "es" | "en";   // 👈 AGREGADO
}) {

  const handleChange = React.useCallback(
    (field: string, value: string) => {
      setBookingData((prev: any) => ({ ...prev, [field]: value }));
    },
    [setBookingData]
  );

return (
  <>
    {/* ----- DATOS PERSONALES ----- */}
    <Card className="p-4">
      <h3 className="font-semibold mb-4">
        {language === "es" ? "Datos Personales" : "Personal Information"}
      </h3>

      <div className="space-y-3">
        <InputField
          id="nombre"
          type="text"
          label={language === "es" ? "Nombre Completo" : "Full Name"}
          placeholder={language === "es" ? "Nombre Completo" : "Full Name"}
          value={bookingData.name}
          onChange={(v) => handleChange("name", v)}
          error={errors.name}
        />

        <InputField
          id="email"
          type="email"
          label={language === "es" ? "Correo Electrónico" : "Email"}
          placeholder={language === "es" ? "Correo Electrónico" : "Email"}
          value={bookingData.email}
          onChange={(v) => handleChange("email", v)}
          error={errors.email}
        />

        <InputField
          id="telefono"
          type="tel"
          label={language === "es" ? "Teléfono" : "Phone Number"}
          placeholder={language === "es" ? "Teléfono" : "Phone Number"}
          value={bookingData.phone}
          onChange={(v) => handleChange("phone", v)}
          error={errors.phone}
        />
      </div>
    </Card>

    {/* ----- MÉTODO DE PAGO ----- */}
    <Card className="p-4">
      <h3 className="font-semibold mb-4">
        {language === "es" ? "Método de Pago" : "Payment Method"}
      </h3>

      <InputField
        id="cardNumber"
        type="text"
        inputMode="numeric"
        label={language === "es" ? "Número de Tarjeta" : "Card Number"}
        placeholder={language === "es" ? "Número de Tarjeta" : "Card Number"}
        value={bookingData.cardNumber}
        onChange={(v) => handleChange("cardNumber", v)}
        error={errors.cardNumber}
      />

      <div className="grid grid-cols-2 gap-3 mt-3">
        <InputField
          id="expDate"
          type="text"
          inputMode="numeric"
          label={language === "es" ? "Fecha de Expiración" : "Expiration Date"}
          placeholder={language === "es" ? "MM/AA" : "MM/YY"}
          value={bookingData.expDate}
          onChange={(v) => handleChange("expDate", v)}
          error={errors.expDate}
          maxLength={5}
        />

        <InputField
          id="cvv"
          type="text"
          inputMode="numeric"
          label="CVV"
          placeholder="CVV"
          value={bookingData.cvv}
          onChange={(v) => handleChange("cvv", v)}
          error={errors.cvv}
          maxLength={4}
        />
      </div>
    </Card>

    {/* ----- SOLICITUDES ESPECIALES ----- */}
    <Card className="p-4">
      <h3 className="font-semibold mb-4">
        {language === "es" ? "Solicitudes Especiales" : "Special Requests"}
      </h3>

      <label htmlFor="solicitudes" className="sr-only">
        {language === "es" ? "Solicitudes Especiales" : "Special Requests"}
      </label>

      <textarea
        id="solicitudes"
        placeholder={
          language === "es"
            ? "Ej: Cama extra, piso alto, vista al mar..."
            : "E.g.: Extra bed, high floor, ocean view..."
        }
        aria-label={
          language === "es" ? "Solicitudes especiales" : "Special requests"
        }
        value={bookingData.specialRequests}
        onChange={(e) => handleChange("specialRequests", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-24 resize-none"
      />
    </Card>
  </>
);
});


function BookingScreen({
  language,
  selectedHotel,
  selectedRoom,
  searchData,
  bookingData,
  setBookingData,
  errors,
  setCurrentScreen,
  setSearchData,
  handleConfirmBooking,
}) {
  if (!selectedRoom || !selectedHotel) return null;

  // Helpers
  const dayDiff = (a, b) => {
    const da = new Date(a + "T00:00:00");
    const db = new Date(b + "T00:00:00");
    return Math.max(1, Math.ceil((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24)));
  };
  const addDays = (dateStr, days) => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  };

  const [checkIn, setCheckIn] = useState(searchData.checkIn || "2025-11-15");
  const [checkOut, setCheckOut] = useState(searchData.checkOut || "2025-11-18");
  const [nights, setNights] = useState(dayDiff(checkIn, checkOut));

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

  const handleChangeCheckIn = (val) => {
    setCheckIn(val);
    const newNights = Math.max(1, nights);
    const minOut = addDays(val, newNights);
    if (checkOut <= val) setCheckOut(minOut);
    else setNights(dayDiff(val, checkOut));
  };

  const handleChangeCheckOut = (val) => {
    setCheckOut(val);
    setNights(dayDiff(checkIn, val));
  };

  const handleChangeNights = (val) => {
    const n = Math.max(1, val || 1);
    setNights(n);
    setCheckOut(addDays(checkIn, n));
  };

  const total = selectedRoom.price * nights;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <HeaderBar
        title={language === "es" ? "Completar Reserva" : "Complete Booking"}
        onBack={() => setCurrentScreen("rooms")}
      />

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            {language === "es" ? "Resumen de Reserva" : "Booking Summary"}
          </h3>

          <p className="text-sm text-gray-600">{selectedHotel.name}</p>
          <p className="text-sm text-gray-600">{selectedRoom.name}</p>

          {/* FECHAS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                {language === "es" ? "Check-in" : "Check-in"}
              </label>
              <input
                ref={checkInRef}
                type="date"
                value={checkIn}
                onChange={(e) => handleChangeCheckIn(e.target.value)}
                className="w-full h-9 rounded-lg px-2 border border-gray-300"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 block mb-1">
                {language === "es" ? "Check-out" : "Check-out"}
              </label>
              <input
                ref={checkOutRef}
                type="date"
                value={checkOut}
                onChange={(e) => handleChangeCheckOut(e.target.value)}
                className="w-full h-9 rounded-lg px-2 border border-gray-300"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600 block mb-1">
                {language === "es" ? "Noches" : "Nights"}
              </label>
              <input
                type="number"
                min={1}
                value={nights}
                onChange={(e) => handleChangeNights(Number(e.target.value))}
                className="w-full h-9 rounded-lg px-3 border border-gray-300"
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {language === "es"
                  ? `Total (${nights} ${nights === 1 ? "noche" : "noches"})`
                  : `Total (${nights} ${nights === 1 ? "night" : "nights"})`}
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {CURRENCY.format(total)}
              </span>
            </div>
          </div>
        </Card>

        <PersonalForm
          bookingData={bookingData}
          setBookingData={setBookingData}
          errors={errors}
          language={language}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t">
        <button
          onClick={() => {
            setSearchData((prev) => ({ ...prev, checkIn, checkOut }));
            handleConfirmBooking();
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg"
        >
          {language === "es"
            ? `Confirmar Reserva - ${CURRENCY.format(total)}`
            : `Confirm Booking - ${CURRENCY.format(total)}`}
        </button>
      </div>
    </div>
  );
}



export default function HotelBookerApp() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const [searchData, setSearchData] = useState({ destination: "", checkIn: "", checkOut: "", guests: 2 });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({ name: "", email: "", phone: "", cardNumber: "", expDate: "", cvv: "", specialRequests: "" });
  const [showMenu, setShowMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [savedBookings, setSavedBookings] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [language, setLanguage] = useState<"es" | "en">("es");

const HOTELS = (language === "es"
  ? [
      {
        id: 1,
        name: "Gran Hotel Paradise",
        location: "San Juan, Puerto Rico",
        rating: 4.8,
        reviews: 342,
        price: 189,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        distance: "0.5 km del centro",
        amenities: ["Wifi", "Piscina", "Estacionamiento", "Gimnasio", "Restaurante"],
        description:
          "Hotel de lujo en el corazón de San Juan con vistas espectaculares al mar y servicio excepcional.",
        rooms: [
          {
            id: 1,
            name: "Habitación Estándar",
            capacity: 2,
            size: 25,
            price: 189,
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
          },
          {
            id: 2,
            name: "Suite Deluxe",
            capacity: 3,
            size: 45,
            price: 289,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          },
          {
            id: 3,
            name: "Suite Presidencial",
            capacity: 4,
            size: 80,
            price: 489,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          },
        ],
      },
      {
        id: 2,
        name: "Tropical Beach Resort",
        location: "Dorado, Puerto Rico",
        rating: 4.6,
        reviews: 218,
        price: 159,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        distance: "1.2 km del centro",
        amenities: ["Wifi", "Playa privada", "Spa", "Bar", "Piscina"],
        description: "Resort frente al mar con todas las comodidades para unas vacaciones inolvidables.",
        rooms: [
          {
            id: 1,
            name: "Habitación Vista Jardín",
            capacity: 2,
            size: 30,
            price: 159,
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          },
          {
            id: 2,
            name: "Habitación Vista Mar",
            capacity: 2,
            size: 35,
            price: 229,
            image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          },
        ],
      },
      {
        id: 3,
        name: "City Center Hotel",
        location: "Ponce, Puerto Rico",
        rating: 4.5,
        reviews: 156,
        price: 129,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        distance: "Centro de la ciudad",
        amenities: ["Wifi", "Desayuno incluido", "Estacionamiento", "Business center"],
        description: "Hotel moderno ideal para viajeros de negocios y turistas que buscan comodidad.",
        rooms: [
          {
            id: 1,
            name: "Habitación Doble",
            capacity: 2,
            size: 22,
            price: 129,
            image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800",
          },
        ],
      },
    ]
  : [
      {
        id: 1,
        name: "Grand Paradise Hotel",
        location: "San Juan, Puerto Rico",
        rating: 4.8,
        reviews: 342,
        price: 189,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        distance: "0.5 km from downtown",
        amenities: ["WiFi", "Pool", "Parking", "Gym", "Restaurant"],
        description:
          "Luxury hotel in the heart of San Juan with stunning ocean views and exceptional service.",
        rooms: [
          {
            id: 1,
            name: "Standard Room",
            capacity: 2,
            size: 25,
            price: 189,
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
          },
          {
            id: 2,
            name: "Deluxe Suite",
            capacity: 3,
            size: 45,
            price: 289,
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
          },
          {
            id: 3,
            name: "Presidential Suite",
            capacity: 4,
            size: 80,
            price: 489,
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
          },
        ],
      },
      {
        id: 2,
        name: "Tropical Beach Resort",
        location: "Dorado, Puerto Rico",
        rating: 4.6,
        reviews: 218,
        price: 159,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        distance: "1.2 km from downtown",
        amenities: ["WiFi", "Private Beach", "Spa", "Bar", "Pool"],
        description: "Beachfront resort with all the amenities for an unforgettable vacation.",
        rooms: [
          {
            id: 1,
            name: "Garden View Room",
            capacity: 2,
            size: 30,
            price: 159,
            image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
          },
          {
            id: 2,
            name: "Ocean View Room",
            capacity: 2,
            size: 35,
            price: 229,
            image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
          },
        ],
      },
      {
        id: 3,
        name: "City Center Hotel",
        location: "Ponce, Puerto Rico",
        rating: 4.5,
        reviews: 156,
        price: 129,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
        distance: "City Center",
        amenities: ["WiFi", "Breakfast Included", "Parking", "Business Center"],
        description: "Modern hotel ideal for business travelers and tourists seeking comfort.",
        rooms: [
          {
            id: 1,
            name: "Double Room",
            capacity: 2,
            size: 22,
            price: 129,
            image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800",
          },
        ],
      },
    ]
);


  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  const [currentUser, setCurrentUser] = useState(null);


  const [isLogged, setIsLogged] = useState(false);
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hb_users")) || [];
    } catch {
      return [];
    }
  });

  const registerUser = (newUser, setError) => {
  if (!newUser.email.includes("@")) {
    setError("Email inválido");
    return;
  }
  if (users.some((u) => u.email === newUser.email)) {
    setError("Este correo ya está registrado");
    return;
  }
  setUsers((prev) => [...prev, newUser]);
  setError("");
  alert("Usuario registrado con éxito");
  setCurrentScreen("login");
};

const login = (email, pass, setError) => {
  const user = users.find((u) => u.email === email && u.pass === pass);
  
  if (!user) {
    setError("Correo o contraseña incorrectos");
    return;
  }

  setError("");
  setIsLogged(true);
  setCurrentUser(user);
  setCurrentScreen("home");
};

  const getInitial = (name) => name?.trim()?.charAt(0)?.toUpperCase() || "";




  useEffect(() => {
  localStorage.setItem("hb_users", JSON.stringify(users));
  }, [users]);


  const [filters, setFilters] = useState({
  minPrice: "",
  maxPrice: "",
  minRating: "any",
  amenities: [],
  });
  const minRef = useRef(null);
  const maxRef = useRef(null);


  // persistencia
  useEffect(() => {
    try {
      const f = localStorage.getItem("hb_favorites");
      const b = localStorage.getItem("hb_bookings");
      if (f) setFavorites(JSON.parse(f));
      if (b) setSavedBookings(JSON.parse(b));
    } catch {}
    runDevTests();
  }, []);
  useEffect(() => localStorage.setItem("hb_favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("hb_bookings", JSON.stringify(savedBookings)), [savedBookings]);

  const hotels = HOTELS; // En real, podría venir de fetch

  const nights = useMemo(() => dateDiffInNights(searchData.checkIn, searchData.checkOut), [searchData.checkIn, searchData.checkOut]);

  const toggleFavorite = (hotelId) => {
    setFavorites((prev) => (prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]));
  };

  const handleSearch = () => {
    if (searchData.destination.trim()) setCurrentScreen("results");
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentScreen("detail");
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setCurrentScreen("booking");
  };

  const validateBooking = () => {
    const e: Record<string, string> = {};
    if (!bookingData.name.trim()) e.name = "Requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) e.email = "Email inválido";
    if (!/^[0-9\-\s()+]{7,}$/.test(bookingData.phone)) e.phone = "Teléfono inválido";
    if (!/^[0-9]{12,19}$/.test(bookingData.cardNumber.replace(/\s/g, ""))) e.cardNumber = "Tarjeta inválida";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(bookingData.expDate)) e.expDate = "Formato MM/AA";
    if (!/^\d{3,4}$/.test(bookingData.cvv)) e.cvv = "CVV inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };


  const handleConfirmBooking = () => {
    if (!selectedHotel || !selectedRoom) return;
    if (!validateBooking()) return;

    const confNumber = makeConfirmationNumber();
    setConfirmationNumber(confNumber);

    const newBooking = {
      id: Date.now(),
      confirmationNumber: confNumber,
      hotel: selectedHotel,
      room: selectedRoom,
      checkIn: searchData.checkIn || "2025-11-15",
      checkOut: searchData.checkOut || "2025-11-18",
      guestName: bookingData.name || "Usuario",
      totalNights: nights,
      totalPrice: selectedRoom.price * nights,
      createdAt: new Date().toISOString(),
    };
    setSavedBookings((prev) => [newBooking, ...prev]);
    setCurrentScreen("confirmation");
  };

  // Navegación inferior y menú
  const go = (screen) => {
    if (screen === "menu") setShowMenu(true);
    else setCurrentScreen(screen);
  };

  const ResultsScreen = () => {
    const inputRef = useRef(null);

    useEffect(() => {
  if (showFilters) {
    setTimeout(() => {
      minRef.current?.focus();
      maxRef.current?.focus();
    }, 50);
  }
}, [currentScreen, showFilters, showMenu]);

    useEffect(() => {
      localStorage.setItem("hb_language", language);
    }, [language]);

    useEffect(() => {
      const saved = localStorage.getItem("hb_language");
      if (saved) setLanguage(saved);
    }, []);


    const filteredHotels = useMemo(() => {
      return hotels
        .filter((h) => matchesHotel(h, searchData.destination, searchData.guests))
        .filter((h) => {
          // Filtro: precio mínimo
          if (filters.minPrice && h.price < Number(filters.minPrice)) return false;

          // Filtro: precio máximo
          if (filters.maxPrice && h.price > Number(filters.maxPrice)) return false;

          // Filtro: rating mínimo
          if (filters.minRating !== "any" && h.rating < Number(filters.minRating)) return false;

          // Filtro: servicios
          if (filters.amenities.length > 0) {
            const hasAll = filters.amenities.every((a) => h.amenities.includes(a));
            if (!hasAll) return false;
          }

          return true;
        });
    }, [hotels, searchData.destination, searchData.guests, filters]);

    return (
  <div className="min-h-screen bg-gray-50 pb-20">

    {/* HEADER */}
    <HeaderBar
      title={language === "es" ? "Resultados" : "Results"}
      onBack={() => setCurrentScreen("home")}
      right={
        <Tooltip text={language === "es" ? "Filtros" : "Filters"}>
          <button
            aria-label={language === "es" ? "Filtros" : "Filters"}
            onClick={() => setShowFilters(true)}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter size={24} />
          </button>
        </Tooltip>
      }

    />

    {/* SEARCH BAR */}
    <div className="px-4 pt-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={searchData.destination}
          onChange={(e) =>
            setSearchData((prev) => ({ ...prev, destination: e.target.value }))
          }
          placeholder={
            language === "es"
              ? "Buscar destino u hotel"
              : "Search destination or hotel"
          }
          className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
          aria-label={
            language === "es"
              ? "Buscar destino u hotel"
              : "Search destination or hotel"
          }
          autoFocus
        />
      </div>

      {/* COUNT */}
      <div className="py-2 text-sm text-gray-600">
        {filteredHotels.length}{" "}
        {language === "es" ? "hoteles encontrados" : "hotels found"}
      </div>
    </div>

    {/* HOTEL LIST */}
    <div className="p-4 space-y-4">
      {filteredHotels.length === 0 ? (
        <Card className="p-6 text-center text-gray-600">
          {language === "es"
            ? `No encontramos hoteles para "${searchData.destination}". Prueba otro destino o reduce filtros.`
            : `We couldn't find hotels for "${searchData.destination}". Try another destination or loosen filters.`}
        </Card>
      ) : (
        filteredHotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <button
              onClick={() => handleHotelSelect(hotel)}
              className="text-left w-full"
            >
              <div className="relative">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />

                {/* FAVORITE BUTTON */}
                <button
                  aria-label={
                    favorites.includes(hotel.id)
                      ? language === "es"
                        ? "Quitar de favoritos"
                        : "Remove from favorites"
                      : language === "es"
                        ? "Agregar a favoritos"
                        : "Add to favorites"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(hotel.id);
                  }}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Heart
                    size={20}
                    fill={favorites.includes(hotel.id) ? "#FF6B6B" : "none"}
                    color={favorites.includes(hotel.id) ? "#FF6B6B" : "#000"}
                  />
                </button>

                {/* SPECIAL TAG */}
                {hotel.id === 1 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {language === "es" ? "Mejor Oferta" : "Best Deal"}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>

                {/* LOCATION */}
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin size={14} className="mr-1" />
                  {hotel.location}
                </p>

                {/* RATING */}
                <div className="flex items-center mt-2">
                  <div className="flex items-center bg-blue-100 px-2 py-1 rounded-lg">
                    <Star size={14} fill="#FFD700" color="#FFD700" />
                    <span className="ml-1 text-sm font-semibold">
                      {hotel.rating}
                    </span>
                  </div>

                  <span className="ml-2 text-sm text-gray-600">
                    ({hotel.reviews}{" "}
                    {language === "es" ? "reseñas" : "reviews"})
                  </span>
                </div>

                {/* PRICE */}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">
                    {hotel.distance}
                  </span>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {CURRENCY.format(hotel.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === "es" ? "por noche" : "per night"}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </Card>
        ))
      )}
    </div>

    <BottomNav active="results" go={go} language={language}/>
  </div>
);

  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">HotelBooker</h1>
          <Tooltip text={language === "es" ? "Menú" : "Menu"}>
            <button
              aria-label={language === "es" ? "Menú" : "Menu"}
              onClick={() => setShowMenu(true)}
              className="text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              <Menu size={28} />
            </button>
          </Tooltip>

        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t(language, "destination")}
          </h2>

          <div className="space-y-4">
            {/* DESTINO */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
              <input
                id="destino"
                aria-label={t(language, "destination")}
                type="text"
                placeholder={t(language, "destination")}
                autoFocus
                value={searchData.destination}
                onChange={(e) => setSearchData((prev) => ({ ...prev, destination: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* FECHAS */}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1 ml-1">
                  {language === "es" ? "Desde" : "From"}
                </label>
                <div className="relative">
                  <Calendar
                    onClick={() => checkInRef.current?.showPicker()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                  />
                  <input
                    ref={checkInRef}
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData((prev) => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1 ml-1">
                  {language === "es" ? "Hasta" : "To"}
                </label>
                <div className="relative">
                  <Calendar
                    onClick={() => checkOutRef.current?.showPicker()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                  />
                  <input
                    ref={checkOutRef}
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData((prev) => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* HUESPEDES */}
            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
              <select
                value={String(searchData.guests)}
                onChange={(e) => setSearchData((prev) => ({ ...prev, guests: safeParseInt(e.target.value, 2) }))}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="1">{language === "es" ? "1 Huésped" : "1 Guest"}</option>
                <option value="2">{language === "es" ? "2 Huéspedes" : "2 Guests"}</option>
                <option value="3">{language === "es" ? "3 Huéspedes" : "3 Guests"}</option>
                <option value="4">{language === "es" ? "4+ Huéspedes" : "4+ Guests"}</option>
              </select>
            </div>

            {/* BOTÓN BUSCAR */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
            >
              {t(language, "searchHotels")}
            </button>
          </div>
        </Card>

        {/* DESTINOS POPULARES */}
        <div className="mt-8">
          <h3 className="text-white text-xl font-semibold mb-4">
            {language === "es" ? "Destinos Populares" : "Popular Destinations"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {hotels.slice(0, 2).map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <button onClick={() => handleHotelSelect(hotel)} className="text-left w-full">
                  <img src={hotel.image} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm">{hotel.name}</h4>
                    <p className="text-xs text-gray-600">{hotel.location}</p>
                    <p className="text-blue-600 font-bold mt-1">
                      {CURRENCY.format(hotel.price)}/{language === "es" ? "noche" : "night"}
                    </p>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" go={go} language={language} />
    </div>
  );


const DetailScreen = () => { 
  if (!selectedHotel) return null;
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* IMAGEN + BOTONES */}
      <div className="relative">
        <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-72 object-cover" />

        {/* BOTÓN VOLVER */}
        <button
          aria-label={language === "es" ? "Regresar a resultados" : "Back to results"}
          onClick={() => setCurrentScreen("results")}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeft size={24} />
        </button>

        {/* FAVORITOS */}
        <button
          aria-label={
            favorites.includes(selectedHotel.id)
              ? language === "es" ? "Quitar de favoritos" : "Remove from favorites"
              : language === "es" ? "Agregar a favoritos" : "Add to favorites"
          }
          onClick={() => toggleFavorite(selectedHotel.id)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Heart
            size={24}
            fill={favorites.includes(selectedHotel.id) ? "#FF6B6B" : "none"}
            color={favorites.includes(selectedHotel.id) ? "#FF6B6B" : "#000"}
          />
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">{selectedHotel.name}</h1>

        {/* UBICACIÓN */}
        <p className="text-gray-600 flex items-center mt-2">
          <MapPin size={16} className="mr-1" />
          {selectedHotel.location}
        </p>

        {/* RATING */}
        <div className="flex items-center mt-3">
          <div className="flex items-center bg-blue-100 px-3 py-2 rounded-xl">
            <Star size={18} fill="#FFD700" color="#FFD700" />
            <span className="ml-1 text-lg font-bold">{selectedHotel.rating}</span>
          </div>

          <span className="ml-3 text-gray-600">
            ({selectedHotel.reviews}{" "}
            {language === "es" ? "reseñas" : "reviews"})
          </span>
        </div>

        {/* SERVICIOS */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {language === "es" ? "Servicios" : "Amenities"}
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {selectedHotel.amenities.map((amenity, idx) => (
              <div key={idx} className="bg-white rounded-xl p-3 text-center shadow-sm">
                <div className="text-2xl mb-1">✓</div>
                <p className="text-xs text-gray-700">{amenity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPCION */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            {language === "es" ? "Descripción" : "Description"}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {selectedHotel.description}
          </p>
        </div>

        {/* PRECIO */}
        <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90">
            {language === "es" ? "Desde" : "From"}
          </p>
          <p className="text-4xl font-bold">{CURRENCY.format(selectedHotel.price)}</p>
          <p className="text-sm opacity-90">
            {language === "es" ? "por noche" : "per night"}
          </p>
        </div>
      </div>

      {/* BOTÓN HABITACIONES */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
        <button
          onClick={() => setCurrentScreen("rooms")}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {language === "es" 
            ? "Ver Habitaciones Disponibles" 
            : "View Available Rooms"}
        </button>
      </div>
    </div>
  );
};



/* ============================
      ROOMS SCREEN
============================ */
const RoomsScreen = () => {
  if (!selectedHotel) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar
        title={language === "es" ? "Selecciona tu Habitación" : "Select Your Room"}
        onBack={() => setCurrentScreen("detail")}
      />

      <div className="p-4 space-y-4">
        {selectedHotel.rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>

              <div className="flex items-center mt-2 text-sm text-gray-600 space-x-4">
                <span>
                  👤 {room.capacity}{" "}
                  {language === "es" ? "personas" : room.capacity === 1 ? "guest" : "guests"}
                </span>
                <span>📏 {room.size} m²</span>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {CURRENCY.format(room.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {language === "es" ? "por noche" : "per night"}
                  </p>
                </div>

                <button
                  onClick={() => handleRoomSelect(room)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {language === "es" ? "Seleccionar" : "Select"}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};



/* ============================
    CONFIRMATION SCREEN
============================ */
const ConfirmationScreen = ({ language }) => {
  if (!selectedRoom || !selectedHotel) return null;

  const inDate = searchData.checkIn || "2025-11-15";
  const outDate = searchData.checkOut || "2025-11-18";

  const handleDownload = () => window.print();

  const handleCalendar = () => {
    const start = new Date(inDate);
    start.setHours(15, 0, 0, 0);
    const end = new Date(outDate);
    end.setHours(11, 0, 0, 0);

    downloadICS({
      title: `${language === "es" ? "Check-in" : "Check-in"}: ${selectedHotel.name}`,
      location: selectedHotel.location,
      start,
      end,
      description: `${language === "es" ? "Reserva" : "Reservation"} ${confirmationNumber} - ${selectedRoom.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center">
          <div
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
            aria-hidden
          >
            <Check size={48} color="white" strokeWidth={3} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {language === "es" ? "¡Reserva Confirmada!" : "Reservation Confirmed!"}
          </h1>

          <p className="text-gray-600 mb-6">
            {language === "es"
              ? "Tu reservación ha sido procesada exitosamente"
              : "Your booking has been successfully completed"}
          </p>

          {/* Número de confirmación */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">
              {language === "es" ? "Número de Confirmación" : "Confirmation Number"}
            </p>
            <p className="text-2xl font-bold text-blue-600">{confirmationNumber}</p>
          </div>

          {/* Datos */}
          <div className="text-left bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
            <div>
              <p className="text-xs text-gray-500">{language === "es" ? "Hotel" : "Hotel"}</p>
              <p className="font-semibold">{selectedHotel.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">{language === "es" ? "Habitación" : "Room"}</p>
              <p className="font-semibold">{selectedRoom.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Check-in</p>
                <p className="font-semibold">{inDate}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Check-out</p>
                <p className="font-semibold">{outDate}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                {language === "es" ? "Huésped" : "Guest"}
              </p>
              <p className="font-semibold">{bookingData.name || (language === "es" ? "Usuario" : "User")}</p>
            </div>
          </div>

          {/* BOTONES */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
            >
              {language === "es" ? "Descargar Confirmación" : "Download Confirmation"}
            </button>

            <button
              onClick={handleCalendar}
              className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold"
            >
              {language === "es" ? "Añadir al Calendario" : "Add to Calendar"}
            </button>

            <button
              onClick={() => {
                setCurrentScreen("home");
                setSelectedHotel(null);
                setSelectedRoom(null);
                setBookingData({
                  name: "",
                  email: "",
                  phone: "",
                  cardNumber: "",
                  specialRequests: "",
                });
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
            >
              {language === "es" ? "Volver al Inicio" : "Return to Home"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ============================
   SAVED BOOKINGS SCREEN
============================ */
const SavedBookingsScreen = () => (
  <div className="min-h-screen bg-gray-50 pb-20">
    <HeaderBar
      title={language === "es" ? "Mis Reservas" : "My Bookings"}
      right={
        <span className="text-sm text-gray-600">
          {savedBookings.length}{" "}
          {language === "es" ? "reservas" : savedBookings.length === 1 ? "booking" : "bookings"}
        </span>
      }
    />

    {savedBookings.length === 0 ? (
      <div className="flex flex-col items-center justify-center p-8 mt-10">
        <div
          className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4"
          aria-hidden
        >
          <Bookmark size={48} className="text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {language === "es" ? "No tienes reservas" : "You have no bookings"}
        </h3>

        <p className="text-gray-600 text-center mb-6">
          {language === "es"
            ? "Cuando hagas una reserva, aparecerá aquí"
            : "When you make a booking, it will appear here"}
        </p>

        <button
          onClick={() => setCurrentScreen("home")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {language === "es" ? "Buscar Hoteles" : "Search Hotels"}
        </button>
      </div>
    ) : (
      <div className="p-4 space-y-4">
        {savedBookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <img
              src={booking.hotel.image}
              alt={booking.hotel.name}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{booking.hotel.name}</h3>
                  <p className="text-sm text-gray-600">{booking.room.name}</p>
                </div>

                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {language === "es" ? "Confirmada" : "Confirmed"}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === "es" ? "Confirmación:" : "Confirmation:"}
                  </span>
                  <span className="font-semibold">{booking.confirmationNumber}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold">{booking.checkIn}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold">{booking.checkOut}</span>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="text-gray-600">
                    {language === "es" ? "Total:" : "Total:"}
                  </span>
                  <span className="font-bold text-blue-600">
                    {CURRENCY.format(booking.totalPrice)}
                  </span>
                </div>
              </div>

              <button
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-xl font-semibold"
                onClick={() => {
                  // Cargar hotel y habitación seleccionada
                  setSelectedHotel(booking.hotel);
                  setSelectedRoom(booking.room);

                  // Cargar fechas
                  setSearchData((prev) => ({
                    ...prev,
                    checkIn: booking.checkIn,
                    checkOut: booking.checkOut,
                  }));

                setBookingData((prev) => ({
                  ...prev,
                  name: booking.name,  // ⬅️ EXTRAER EL NOMBRE REAL DE LA RESERVA
                }));


                  // Ir al recibo reutilizando ConfirmationScreen
                  setCurrentScreen("confirmation");
                }}
              >
                Ver Detalles
              </button>
 
            </div>
          </Card>
        ))}
      </div>
    )}

    <BottomNav active="saved" go={go} language={language} />
  </div>
);



/* ============================
      FAVORITES SCREEN
============================ */
const FavoritesScreen = () => {
  const favHotels = hotels.filter((h) => favorites.includes(h.id));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar
        title={language === "es" ? "Favoritos" : "Favorites"}
        onBack={() => setCurrentScreen("home")}
      />

      {favHotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-10">
          <div
            className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4"
            aria-hidden
          >
            <Heart size={48} className="text-gray-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {language === "es" ? "Sin favoritos todavía" : "No favorites yet"}
          </h3>

          <p className="text-gray-600 text-center mb-6">
            {language === "es"
              ? "Marca hoteles con el corazón para verlos aquí"
              : "Tap the heart icon to save hotels here"}
          </p>

          <button
            onClick={() => setCurrentScreen("results")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            {language === "es" ? "Ver Hoteles" : "View Hotels"}
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {favHotels.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <button onClick={() => handleHotelSelect(hotel)} className="text-left w-full">
                <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>

                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {hotel.location}
                  </p>

                  <div className="flex items-center mt-2">
                    <div className="flex items-center bg-blue-100 px-2 py-1 rounded-lg">
                      <Star size={14} fill="#FFD700" color="#FFD700" />
                      <span className="ml-1 text-sm font-semibold">{hotel.rating}</span>
                    </div>

                    <span className="ml-2 text-sm text-gray-600">
                      ({hotel.reviews}{" "}
                      {language === "es" ? "reseñas" : hotel.reviews === 1 ? "review" : "reviews"})
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">{hotel.distance}</span>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {CURRENCY.format(hotel.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === "es" ? "por noche" : "per night"}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}

      <BottomNav active="results" go={go} language={language}/>
    </div>
  );
};


const SideMenu = () => (
  <div
    className={cx(
      "absolute inset-0 bg-black/50 z-50 transition-opacity",
      showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
    )}
    onClick={() => setShowMenu(false)}
    role="dialog"
    aria-modal="true"
    aria-label={language === "es" ? "Menú lateral" : "Side Menu"}
  >
    <div
      className={cx(
        "absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform",
        showMenu ? "translate-x-0" : "translate-x-full"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6 h-full flex flex-col">

        {/* TÍTULO DEL MENÚ */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {language === "es" ? "Menú" : "Menu"}
          </h2>
          <Tooltip text= {language === "es" ? "Atrás" : "Back"}>
          <button
            aria-label={language === "es" ? "Atrás" : "Back"}
            onClick={() => setShowMenu(false)}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={24} />
          </button>
          </Tooltip>
        </div>

        {/* PERFIL */}
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {getInitial(currentUser?.name)}
          </div>

          <div>
            <p className="font-semibold text-lg">
              {currentUser?.name || (language === "es" ? "Invitado" : "Guest")}
            </p>
            <p className="text-sm text-gray-600">
              {currentUser?.email || (language === "es" ? "Sin correo" : "No email")}
            </p>
          </div>
        </div>

        {/* OPCIONES DEL MENÚ */}
        <div className="space-y-2">
          {/* Inicio */}
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => { setCurrentScreen("home"); setShowMenu(false); }}
          >
            <Home size={22} />
            <span className="font-medium">
              {language === "es" ? "Inicio" : "Home"}
            </span>
          </button>

          {/* Reservas */}
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => { setCurrentScreen("saved"); setShowMenu(false); }}
          >
            <Bookmark size={22} />
            <span className="font-medium">
              {language === "es" ? "Mis Reservas" : "My Bookings"} ({savedBookings.length})
            </span>
          </button>

          {/* Favoritos */}
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => { setCurrentScreen("favorites"); setShowMenu(false); }}
          >
            <Heart size={22} />
            <span className="font-medium">
              {language === "es" ? "Favoritos" : "Favorites"} ({favorites.length})
            </span>
          </button>

          {/* Configuración */}
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => { setCurrentScreen("settings"); setShowMenu(false); }}
          >
            <Settings size={22} />
            <span className="font-medium">
              {language === "es" ? "Configuración" : "Settings"}
            </span>
          </button>
        </div>

        {/* CERRAR SESIÓN */}
        <div className="mt-auto pt-8">
          <button
            onClick={() => {
              setIsLogged(false);
              setCurrentUser(null);
              setShowMenu(false);
              setCurrentScreen("login");
            }}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors"
          >
            {language === "es" ? "Cerrar Sesión" : "Log Out"}
          </button>
        </div>

      </div>
    </div>
  </div>
);


 const FiltersModal = React.memo(function FiltersModal({
  showFilters,
  setShowFilters,
  filters,
  setFilters
}) {
  return (
    <div
      className={cx(
        "absolute inset-0 bg-black/50 z-50 flex items-end transition-opacity",
        showFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setShowFilters(false)}
      role="dialog"
      aria-modal="true"
      aria-label={language === "es" ? "Filtros" : "Filters"}
    >
      <div
        className={cx(
          "bg-white w-full rounded-t-3xl p-6 transition-transform",
          showFilters ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {language === "es" ? "Filtros" : "Filters"}
          </h2>

          <button
            aria-label={language === "es" ? "Filtros" : "Filters"}
            onClick={() => setShowFilters(false)}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">

          {/* RANGO DE PRECIOS */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {language === "es" ? "Rango de Precio" : "Price Range"}
            </label>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, minPrice: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="">
                  {language === "es" ? "Min" : "Min"}
                </option>
                <option value="50">$50</option>
                <option value="100">$100</option>
                <option value="150">$150</option>
                <option value="200">$200</option>
                <option value="250">$250</option>
                <option value="300">$300</option>
              </select>

              <select
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, maxPrice: e.target.value }))
                }
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none"
              >
                <option value="">
                  {language === "es" ? "Max" : "Max"}
                </option>
                <option value="100">$100</option>
                <option value="150">$150</option>
                <option value="200">$200</option>
                <option value="250">$250</option>
                <option value="300">$300</option>
                <option value="400">$400</option>
                <option value="500">$500</option>
              </select>
            </div>
          </div>

          {/* CALIFICACIÓN */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {language === "es" ? "Calificación Mínima" : "Minimum Rating"}
            </label>

            <select
              value={filters.minRating}
              onChange={(e) =>
                setFilters((p) => ({ ...p, minRating: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded-xl"
            >
              <option value="any">
                {language === "es" ? "Cualquiera" : "Any"}
              </option>
              <option value="5">5 ⭐</option>
              <option value="4">4 ⭐</option>
              <option value="3">3 ⭐</option>
              <option value="2">2 ⭐</option>
              <option value="1">1 ⭐</option>
            </select>
          </div>

          {/* SERVICIOS */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              {language === "es" ? "Servicios" : "Amenities"}
            </label>

            <div className="grid grid-cols-2 gap-3">
              {["Wifi", "Piscina", "Estacionamiento", "Gimnasio"].map((service) => (
                <label key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(service)}
                    onChange={() =>
                      setFilters((p) => {
                        const selected = p.amenities.includes(service)
                          ? p.amenities.filter((x) => x !== service)
                          : [...p.amenities, service];
                        return { ...p, amenities: selected };
                      })
                    }
                  />
                  <span>
                    {language === "es"
                      ? service
                      : service === "Piscina"
                      ? "Pool"
                      : service === "Estacionamiento"
                      ? "Parking"
                      : service === "Gimnasio"
                      ? "Gym"
                      : "Wifi"}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* BOTÓN LIMPIAR */}
        <div className="flex space-x-3 mt-8">
          <button
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold"
            onClick={() =>
              setFilters({
                minPrice: "",
                maxPrice: "",
                minRating: "any",
                amenities: [],
              })
            }
          >
            {language === "es" ? "Limpiar" : "Clear"}
          </button>
        </div>
      </div>
    </div>
  );
});



    return (
  <div className="flex items-center justify-center min-h-screen bg-gray-200">
    <div
      className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[10px] border-gray-900"
      style={{ width: 393, height: 852 }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl z-[9999]" />

      <div className="w-full h-full overflow-y-auto">

      {currentScreen === "login" && (
        <LoginScreen
          goSignup={() => setCurrentScreen("signup")}
          login={login}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {currentScreen === "signup" && (
        <SignUpScreen
          goLogin={() => setCurrentScreen("login")}
          registerUser={registerUser}
          language={language}
          setLanguage={setLanguage}
        />
      )}

      {currentScreen === "settings" && (
        <SettingsScreen
          language={language}
          setLanguage={setLanguage}
          setCurrentScreen={setCurrentScreen}
        />
      )}


        {/* 🔥 Tus pantallas existentes */}
        {currentScreen === "home" && <HomeScreen />}
        {currentScreen === "results" && <ResultsScreen />}
        {currentScreen === "detail" && <DetailScreen />}
        {currentScreen === "rooms" && <RoomsScreen />}
        {currentScreen === "confirmation" && (<ConfirmationScreen language={language} /> )}
        {currentScreen === "saved" && <SavedBookingsScreen />}
        {currentScreen === "favorites" && <FavoritesScreen />}
        {currentScreen === "booking" && (<BookingScreen
          selectedHotel={selectedHotel}
          selectedRoom={selectedRoom}
          searchData={searchData}
          bookingData={bookingData}
          setBookingData={setBookingData}
          errors={errors}
          setCurrentScreen={setCurrentScreen}
          setSearchData={setSearchData}
          language={language}
          handleConfirmBooking={handleConfirmBooking}
        />
        )}

        <SideMenu />
        <FiltersModal
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  </div>
);
}
