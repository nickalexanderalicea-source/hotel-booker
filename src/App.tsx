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


const CURRENCY = new Intl.NumberFormat("es-PR", { style: "currency", currency: "USD" });

const HOTELS = [
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
      { id: 1, name: "Habitación Estándar", capacity: 2, size: 25, price: 189, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800" },
      { id: 2, name: "Suite Deluxe", capacity: 3, size: 45, price: 289, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800" },
      { id: 3, name: "Suite Presidencial", capacity: 4, size: 80, price: 489, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800" },
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
      { id: 1, name: "Habitación Vista Jardín", capacity: 2, size: 30, price: 159, image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800" },
      { id: 2, name: "Habitación Vista Mar", capacity: 2, size: 35, price: 229, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800" },
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
      { id: 1, name: "Habitación Doble", capacity: 2, size: 22, price: 129, image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800" },
    ],
  },
];

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
  <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
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

const BottomNav = ({ active, go }) => (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around" aria-label="Navegación inferior">
    {[
      { id: "home", icon: Home, label: "Inicio" },
      { id: "results", icon: Search, label: "Buscar" },
      { id: "saved", icon: Bookmark, label: "Mis reservas" },
      { id: "menu", icon: User, label: "Menú" },
    ].map((item) => (
      <button
        key={item.id}
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
    ))}
  </nav>
);

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
}: {
  bookingData: { name: string; email: string; phone: string; cardNumber: string; expDate: string; cvv: string; specialRequests: string };
  setBookingData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
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
        <h3 className="font-semibold mb-4">Datos Personales</h3>
        <div className="space-y-3">
          <InputField
            id="nombre"
            type="text"
            label="Nombre Completo"
            placeholder="Nombre Completo"
            value={bookingData.name}
            onChange={(v) => handleChange("name", v)}
            error={errors.name}
          />
          <InputField
            id="email"
            type="email"
            label="Correo Electrónico"
            placeholder="Correo Electrónico"
            value={bookingData.email}
            onChange={(v) => handleChange("email", v)}
            error={errors.email}
          />
          <InputField
            id="telefono"
            type="tel"
            label="Teléfono"
            placeholder="Teléfono"
            value={bookingData.phone}
            onChange={(v) => handleChange("phone", v)}
            error={errors.phone}
          />
        </div>
      </Card>

      {/* ----- MÉTODO DE PAGO ----- */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Método de Pago</h3>

        <InputField
          id="cardNumber"
          type="text"
          inputMode="numeric"
          label="Número de Tarjeta"
          placeholder="Número de Tarjeta"
          value={bookingData.cardNumber}
          onChange={(v) => handleChange("cardNumber", v)}
          error={errors.cardNumber}
        />

        <div className="grid grid-cols-2 gap-3 mt-3">
          <InputField
            id="expDate"
            type="text"
            inputMode="numeric"
            label="Fecha de Expiración"
            placeholder="MM/AA"
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
        <h3 className="font-semibold mb-4">Solicitudes Especiales</h3>
        <label htmlFor="solicitudes" className="sr-only">Solicitudes Especiales</label>
        <textarea
          id="solicitudes"
          placeholder="Ej: Cama extra, piso alto, vista al mar..."
          aria-label="Solicitudes especiales"
          value={bookingData.specialRequests}
          onChange={(e) => handleChange("specialRequests", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none h-24 resize-none"
        />
      </Card>
    </>
  );
});

function BookingScreen({
  selectedHotel,
  selectedRoom,
  searchData,
  bookingData,
  setBookingData,
  errors,
  setCurrentScreen,
  setSearchData,
  handleConfirmBooking,
}: {
  selectedHotel: any;
  selectedRoom: any;
  searchData: { checkIn: string; checkOut: string };
  bookingData: any;
  setBookingData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
  setCurrentScreen: (s: string) => void;
  setSearchData: React.Dispatch<React.SetStateAction<any>>;
  handleConfirmBooking: () => void;
}) {
  if (!selectedRoom || !selectedHotel) return null;

  // Helpers de fechas
  const dayDiff = (a: string, b: string) => {
    const da = new Date(a + "T00:00:00");
    const db = new Date(b + "T00:00:00");
    return Math.max(1, Math.ceil((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24)));
  };
  const addDays = (dateStr: string, days: number) => {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Estados locales
  const [checkIn, setCheckIn] = React.useState<string>(searchData.checkIn || "2025-11-15");
  const [checkOut, setCheckOut] = React.useState<string>(searchData.checkOut || "2025-11-18");
  const [nights, setNights] = React.useState<number>(
    dayDiff(searchData.checkIn || "2025-11-15", searchData.checkOut || "2025-11-18")
  );

  // Refs para abrir el selector nativo
  const checkInRef = React.useRef<HTMLInputElement>(null);
  const checkOutRef = React.useRef<HTMLInputElement>(null);

  // Sincronía fechas/noches
  const handleChangeCheckIn = (val: string) => {
    setCheckIn(val);
    const newNights = Math.max(1, nights);
    const minOut = addDays(val, newNights);
    if (checkOut <= val) setCheckOut(minOut);
    else setNights(dayDiff(val, checkOut));
  };
  const handleChangeCheckOut = (val: string) => {
    setCheckOut(val);
    setNights(dayDiff(checkIn, val));
  };
  const handleChangeNights = (val: number) => {
    const n = Math.max(1, Math.floor(val || 1));
    setNights(n);
    setCheckOut(addDays(checkIn, n));
  };

  const total = selectedRoom.price * nights;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <HeaderBar title="Completar Reserva" onBack={() => setCurrentScreen("rooms")} />
      <div className="p-4 space-y-4">
      {/* ----- RESUMEN DE RESERVA (FONDO BLANCO + INPUTS CONSISTENTES) ----- */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Resumen de Reserva</h3>
        <p className="text-sm text-gray-600">{selectedHotel.name}</p>
        <p className="text-sm text-gray-600">{selectedRoom.name}</p>

        {/* === BLOQUE DE FECHAS === */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {/* CHECK-IN */}
          <div>
            <label htmlFor="checkin" className="text-xs text-gray-600 block mb-1">
              Check-in
            </label>
            <input
              ref={checkInRef}
              id="checkin"
              type="date"
              value={checkIn}
              onChange={(e) => handleChangeCheckIn(e.target.value)}
              onClick={() => checkInRef.current?.showPicker()}
              aria-label="Fecha de check-in"
              className="w-full h-9 rounded-lg px-2 text-sm bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none cursor-pointer"
            />
          </div>

          {/* CHECK-OUT */}
          <div>
            <label htmlFor="checkout" className="text-xs text-gray-600 block mb-1">
              Check-out
            </label>
            <input
              ref={checkOutRef}
              id="checkout"
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => handleChangeCheckOut(e.target.value)}
              onClick={() => checkOutRef.current?.showPicker()}
              aria-label="Fecha de check-out"
              className="w-full h-9 rounded-lg px-2 text-sm bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none cursor-pointer"
            />
          </div>

          {/* NOCHES */}
          <div>
            <label htmlFor="nights" className="text-xs text-gray-600 block mb-1">
              Noches
            </label>
            <input
              id="nights"
              type="number"
              min={1}
              value={nights}
              onChange={(e) => handleChangeNights(Number(e.target.value))}
              aria-label="Número de noches"
              className="w-full h-9 rounded-lg px-3 text-sm bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">
              Total ({nights} {nights === 1 ? "noche" : "noches"})
            </span>
            <span className="text-2xl font-bold text-blue-600">{CURRENCY.format(total)}</span>
          </div>
        </div>
      </Card>


        {/* ----- FORMULARIOS (datos personales, pago, solicitudes) ----- */}
        <PersonalForm bookingData={bookingData} setBookingData={setBookingData} errors={errors} />
      </div>

      {/* ----- BOTÓN FINAL ----- */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-40">
        <button
          type="button"
          onClick={() => {
            setSearchData((prev: any) => ({ ...prev, checkIn, checkOut }));
            handleConfirmBooking();
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Confirmar Reserva - {CURRENCY.format(total)}
        </button>
      </div>
    </div>
  );
}

export default function HotelBookerApp() {
  const [currentScreen, setCurrentScreen] = useState("home");
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

  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  


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
      if (currentScreen === "results" && !showFilters && !showMenu && inputRef.current) {
        if (document.activeElement !== inputRef.current) inputRef.current.focus();
      }
    }, [currentScreen, showFilters, showMenu]);
    const filteredHotels = useMemo(() => hotels.filter((h) => matchesHotel(h, searchData.destination, searchData.guests)), [hotels, searchData.destination, searchData.guests]);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <HeaderBar
          title="Resultados"
          onBack={() => setCurrentScreen("home")}
          right={
            <button aria-label="Abrir filtros" onClick={() => setShowFilters(true)} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Filter size={24} />
            </button>
          }
        />
        <div className="px-4 pt-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={searchData.destination}
              onChange={(e) => setSearchData((prev) => ({ ...prev, destination: e.target.value }))}
              placeholder="Buscar destino u hotel"
              autoFocus
              className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
              aria-label="Buscar destino u hotel"
            />
          </div>
          <div className="py-2 text-sm text-gray-600">{filteredHotels.length} hoteles encontrados</div>
        </div>

        <div className="p-4 space-y-4">
          {filteredHotels.length === 0 ? (
            <Card className="p-6 text-center text-gray-600">No encontramos hoteles para "{searchData.destination}". Prueba otro destino o reduce filtros.</Card>
          ) : (
            filteredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <button onClick={() => handleHotelSelect(hotel)} className="text-left w-full">
                  <div className="relative">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
                    <button
                      aria-label={favorites.includes(hotel.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(hotel.id);
                      }}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Heart size={20} fill={favorites.includes(hotel.id) ? "#FF6B6B" : "none"} color={favorites.includes(hotel.id) ? "#FF6B6B" : "#000"} />
                    </button>
                    {hotel.id === 1 && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Mejor Oferta</div>
                    )}
                  </div>
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
                      <span className="ml-2 text-sm text-gray-600">({hotel.reviews} reseñas)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">{hotel.distance}</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{CURRENCY.format(hotel.price)}</p>
                        <p className="text-xs text-gray-500">por noche</p>
                      </div>
                    </div>
                  </div>
                </button>
              </Card>
            ))
          )}
        </div>
        <BottomNav active="results" go={go} />
      </div>
    );
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 pb-20">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">HotelBooker</h1>
          <button aria-label="Abrir menú" onClick={() => setShowMenu(true)} className="text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/70">
            <Menu size={28} />
          </button>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">¿A dónde viajas?</h2>
          <div className="space-y-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
              <label className="sr-only" htmlFor="destino">Destino</label>
              <input
                id="destino"
                aria-label="Destino"
                type="text"
                placeholder="Destino"
                autoFocus
                value={searchData.destination}
                onChange={(e) => setSearchData((prev) => ({ ...prev, destination: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col space-y-4">
              {/* 🔹 Fecha de inicio */}
              <div className="flex flex-col">
                <label htmlFor="checkin" className="text-xs font-medium text-gray-600 mb-1 ml-1">
                  Desde
                </label>
                <div className="relative">
                  <Calendar
                    onClick={() => checkInRef.current?.showPicker()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                  />
                  <input
                    ref={checkInRef}
                    id="checkin"
                    aria-label="Fecha de check-in"
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) =>
                      setSearchData((prev) => ({ ...prev, checkIn: e.target.value }))
                    }
                    onClick={() => checkInRef.current?.showPicker()}
                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                  />
                </div>
              </div>

              {/* 🔹 Fecha de salida */}
              <div className="flex flex-col">
                <label htmlFor="checkout" className="text-xs font-medium text-gray-600 mb-1 ml-1">
                  Hasta
                </label>
                <div className="relative">
                  <Calendar
                    onClick={() => checkOutRef.current?.showPicker()}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    size={20}
                  />
                  <input
                    ref={checkOutRef}
                    id="checkout"
                    aria-label="Fecha de check-out"
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) =>
                      setSearchData((prev) => ({ ...prev, checkOut: e.target.value }))
                    }
                    onClick={() => checkOutRef.current?.showPicker()}
                    className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm cursor-pointer"
                  />
                </div>
              </div>
            </div>



            <div className="relative">
              <Users className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={20} />
              <label className="sr-only" htmlFor="huespedes">Huéspedes</label>
              <select
                id="huespedes"
                aria-label="Cantidad de huéspedes"
                value={String(searchData.guests)}
                onChange={(e) => setSearchData((prev) => ({ ...prev, guests: safeParseInt(e.target.value, 2) }))}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="1">1 Huésped</option>
                <option value="2">2 Huéspedes</option>
                <option value="3">3 Huéspedes</option>
                <option value="4">4+ Huéspedes</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/70"
            >
              Buscar Hoteles
            </button>
          </div>
        </Card>

        <div className="mt-8">
          <h3 className="text-white text-xl font-semibold mb-4">Destinos Populares</h3>
          <div className="grid grid-cols-2 gap-4">
            {hotels.slice(0, 2).map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" aria-label={`Abrir ${hotel.name}`}>
                <button onClick={() => handleHotelSelect(hotel)} className="text-left w-full">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <h4 className="font-semibold text-sm">{hotel.name}</h4>
                    <p className="text-xs text-gray-600">{hotel.location}</p>
                    <p className="text-blue-600 font-bold mt-1">{CURRENCY.format(hotel.price)}/noche</p>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="home" go={go} />
    </div>
  );

  const DetailScreen = () => {
    if (!selectedHotel) return null;
    const checkInRef = useRef<HTMLInputElement>(null);
    const checkOutRef = useRef<HTMLInputElement>(null);
    
    return (
      <div className="min-h-screen bg-gray-50 pb-32">
        <div className="relative">
          <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-72 object-cover" />
          <button
            aria-label="Regresar a resultados"
            onClick={() => setCurrentScreen("results")}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            aria-label={favorites.includes(selectedHotel.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={() => toggleFavorite(selectedHotel.id)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Heart size={24} fill={favorites.includes(selectedHotel.id) ? "#FF6B6B" : "none"} color={favorites.includes(selectedHotel.id) ? "#FF6B6B" : "#000"} />
          </button>
        </div>

        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">{selectedHotel.name}</h1>
          <p className="text-gray-600 flex items-center mt-2">
            <MapPin size={16} className="mr-1" />
            {selectedHotel.location}
          </p>
          <div className="flex items-center mt-3">
            <div className="flex items-center bg-blue-100 px-3 py-2 rounded-xl">
              <Star size={18} fill="#FFD700" color="#FFD700" />
              <span className="ml-1 text-lg font-bold">{selectedHotel.rating}</span>
            </div>
            <span className="ml-3 text-gray-600">({selectedHotel.reviews} reseñas)</span>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Servicios</h3>
            <div className="grid grid-cols-3 gap-3">
              {selectedHotel.amenities.map((amenity, idx) => (
                <div key={idx} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-2xl mb-1">✓</div>
                  <p className="text-xs text-gray-700">{amenity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{selectedHotel.description}</p>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-sm opacity-90">Desde</p>
            <p className="text-4xl font-bold">{CURRENCY.format(selectedHotel.price)}</p>
            <p className="text-sm opacity-90">por noche</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40">
          <button
            onClick={() => setCurrentScreen("rooms")}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ver Habitaciones Disponibles
          </button>
        </div>
      </div>
    );
  };

  const RoomsScreen = () => {
    if (!selectedHotel) return null;
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <HeaderBar title="Selecciona tu Habitación" onBack={() => setCurrentScreen("detail")} />
        <div className="p-4 space-y-4">
          {selectedHotel.rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-600 space-x-4">
                  <span>👤 {room.capacity} personas</span>
                  <span>📏 {room.size} m²</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">{CURRENCY.format(room.price)}</p>
                    <p className="text-xs text-gray-500">por noche</p>
                  </div>
                  <button
                    onClick={() => handleRoomSelect(room)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };




  const ConfirmationScreen = () => {
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
        title: `Check-in: ${selectedHotel.name}`,
        location: selectedHotel.location,
        start,
        end,
        description: `Reserva ${confirmationNumber} - ${selectedRoom.name}`,
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" aria-hidden>
              <Check size={48} color="white" strokeWidth={3} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h1>
            <p className="text-gray-600 mb-6">Tu reservación ha sido procesada exitosamente</p>

            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Número de Confirmación</p>
              <p className="text-2xl font-bold text-blue-600">{confirmationNumber}</p>
            </div>

            <div className="text-left bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-500">Hotel</p>
                <p className="font-semibold">{selectedHotel.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Habitación</p>
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
                <p className="text-xs text-gray-500">Huésped</p>
                <p className="font-semibold">{bookingData.name || "Usuario"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={handleDownload} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                Descargar Confirmación
              </button>
              <button onClick={handleCalendar} className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                Añadir al Calendario
              </button>
              <button
                onClick={() => {
                  setCurrentScreen("home");
                  setSelectedHotel(null);
                  setSelectedRoom(null);
                  setBookingData({ name: "", email: "", phone: "", cardNumber: "", specialRequests: "" });
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SavedBookingsScreen = () => (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar title="Mis Reservas" right={<span className="text-sm text-gray-600">{savedBookings.length} reservas</span>} />

      {savedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 mt-10">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4" aria-hidden>
            <Bookmark size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes reservas</h3>
          <p className="text-gray-600 text-center mb-6">Cuando hagas una reserva, aparecerá aquí</p>
          <button onClick={() => setCurrentScreen("home")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
            Buscar Hoteles
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {savedBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <img src={booking.hotel.image} alt={booking.hotel.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{booking.hotel.name}</h3>
                    <p className="text-sm text-gray-600">{booking.room.name}</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Confirmada</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Confirmación:</span>
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
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-blue-600">{CURRENCY.format(booking.totalPrice)}</span>
                  </div>
                </div>

                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-xl font-semibold">Ver Detalles</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <BottomNav active="saved" go={go} />
    </div>
  );

  const FavoritesScreen = () => {
    const favHotels = hotels.filter((h) => favorites.includes(h.id));
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <HeaderBar title="Favoritos" onBack={() => setCurrentScreen("home")} />
        {favHotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-10">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4" aria-hidden>
              <Heart size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sin favoritos todavía</h3>
            <p className="text-gray-600 text-center mb-6">Marca hoteles con el corazón para verlos aquí</p>
            <button onClick={() => setCurrentScreen("results")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
              Ver Hoteles
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
                      <span className="ml-2 text-sm text-gray-600">({hotel.reviews} reseñas)</span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">{hotel.distance}</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{CURRENCY.format(hotel.price)}</p>
                        <p className="text-xs text-gray-500">por noche</p>
                      </div>
                    </div>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        )}
        <BottomNav active="results" go={go} />
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
      aria-label="Menú lateral"
    >

      <div
        className={cx(
          "absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform",
          showMenu ? "translate-x-0" : "translate-x-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Menú</h2>
            <button aria-label="Cerrar menú" onClick={() => setShowMenu(false)} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-8 pb-6 border-b">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              U
            </div>
            <div>
              <p className="font-semibold text-lg">Usuario</p>
              <p className="text-sm text-gray-600">user@email.com</p>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => { setCurrentScreen("home"); setShowMenu(false); }}>
              <Home size={22} />
              <span className="font-medium">Inicio</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => { setCurrentScreen("saved"); setShowMenu(false); }}>
              <Bookmark size={22} />
              <span className="font-medium">Mis Reservas ({savedBookings.length})</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => { setCurrentScreen("favorites"); setShowMenu(false); }}>
              <Heart size={22} />
              <span className="font-medium">Favoritos ({favorites.length})</span>
            </button>
            <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors" onClick={() => { setShowMenu(false); }}>
              <Settings size={22} />
              <span className="font-medium">Configuración</span>
            </button>
          </div>

          <div className="mt-auto pt-8">
            <button className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors">Cerrar Sesión</button>
          </div>
        </div>
      </div>
    </div>
  );

  const FiltersModal = () => (
    <div
      className={cx(
        "absolute inset-0 bg-black/50 z-50 flex items-end transition-opacity",
        showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => setShowFilters(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Filtros"
    >
      <div
        className={cx(
          "bg-white w-full rounded-t-3xl p-6 transition-transform",
          showFilters ? "translate-y-0" : "translate-y-full"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Filtros</h2>
          <button aria-label="Cerrar filtros" onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Rango de Precio</label>
            <div className="flex items-center space-x-4">
              <input type="number" placeholder="Min" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
              <span>-</span>
              <input type="number" placeholder="Max" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="minRating">
              Calificación Mínima
            </label>
            <select
              id="minRating"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
              aria-describedby="minRatingHelp"
            >
              <option value="any">Cualquiera</option>
              <option value="4">4+ estrellas</option>
              <option value="4.5">4.5+ estrellas</option>
            </select>
            <p id="minRatingHelp" className="sr-only">Selecciona el mínimo de estrellas</p>

          </div>

          <div>
            <label className="block text-sm font-semibold mb-3">Servicios</label>
            <div className="grid grid-cols-2 gap-3">
              {["WiFi Gratis", "Piscina", "Estacionamiento", "Gimnasio"].map((s) => (
                <label key={s} className="flex items-center space-x-2">
                  <input type="checkbox" className="w-5 h-5" />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold">Limpiar</button>
          <button onClick={() => setShowFilters(false)} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold">
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        {/* 📱 Contenedor con marco tipo iPhone */}
        <div
          className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[10px] border-gray-900"
          style={{ width: 393, height: 852 }}
        >
          {/* 🔸 Notch superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10" />

          {/* 🌐 Tu aplicación dentro */}
          <div className="w-full h-full overflow-y-auto">
            {currentScreen === "home" && <HomeScreen />}
            {currentScreen === "results" && <ResultsScreen />}
            {currentScreen === "detail" && <DetailScreen />}
            {currentScreen === "rooms" && <RoomsScreen />}
            {currentScreen === "confirmation" && <ConfirmationScreen />}
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
              handleConfirmBooking={handleConfirmBooking}
            />
          )}

            <SideMenu />
            <FiltersModal />
          </div>
        </div>
      </div>
    );
    }
