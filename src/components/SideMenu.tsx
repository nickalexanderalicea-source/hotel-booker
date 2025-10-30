import React from "react";
import { Home, Bookmark, Heart, Settings, X } from "lucide-react";

interface SideMenuProps {
  showMenu: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  favoritesCount: number;
  savedCount: number;
}

const SideMenu: React.FC<SideMenuProps> = ({
  showMenu,
  onClose,
  onNavigate,
  favoritesCount,
  savedCount,
}) => (
  <div
    className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
      showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
    onClick={onClose}
  >
    <div
      className={`absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-transform ${
        showMenu ? "translate-x-0" : "translate-x-full"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Menú</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2">
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => {
              onNavigate("home");
              onClose();
            }}
          >
            <Home size={22} />
            <span className="font-medium">Inicio</span>
          </button>
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={() => {
              onNavigate("saved");
              onClose();
            }}
          >
            <Bookmark size={22} />
            <span className="font-medium">Mis Reservas ({savedCount})</span>
          </button>
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={onClose}
          >
            <Heart size={22} />
            <span className="font-medium">Favoritos ({favoritesCount})</span>
          </button>
          <button
            className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={onClose}
          >
            <Settings size={22} />
            <span className="font-medium">Configuración</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SideMenu;
