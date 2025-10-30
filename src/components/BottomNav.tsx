import React from "react";
import { Home, Search, Bookmark, User } from "lucide-react";

interface BottomNavProps {
  active: string;
  onNavigate: (screen: string) => void;
  onOpenMenu: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate, onOpenMenu }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around">
    <button
      onClick={() => onNavigate("home")}
      className={`flex flex-col items-center ${active === "home" ? "text-blue-600" : "text-gray-400"}`}
    >
      <Home size={24} />
      <span className="text-xs mt-1">Inicio</span>
    </button>
    <button
      onClick={() => onNavigate("results")}
      className={`flex flex-col items-center ${active === "search" ? "text-blue-600" : "text-gray-400"}`}
    >
      <Search size={24} />
      <span className="text-xs mt-1">Buscar</span>
    </button>
    <button
      onClick={() => onNavigate("saved")}
      className={`flex flex-col items-center ${active === "saved" ? "text-blue-600" : "text-gray-400"}`}
    >
      <Bookmark size={24} />
      <span className="text-xs mt-1">Mis Reservas</span>
    </button>
    <button
      onClick={onOpenMenu}
      className="flex flex-col items-center text-gray-400"
    >
      <User size={24} />
      <span className="text-xs mt-1">Perfil</span>
    </button>
  </div>
);

export default BottomNav;
