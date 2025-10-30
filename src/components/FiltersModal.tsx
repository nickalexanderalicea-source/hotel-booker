import React from "react";
import { X } from "lucide-react";

interface FiltersModalProps {
  show: boolean;
  onClose: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({ show, onClose }) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
      className={`fixed inset-0 bg-black/50 z-50 flex items-end transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-full rounded-t-3xl p-6 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="filters-title" className="text-2xl font-bold">
            Filtros
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          Aquí podrías implementar tus filtros personalizados.
        </p>

        <div className="flex space-x-3 mt-6">
          <button
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100"
            type="button"
          >
            Limpiar
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90"
            type="button"
            onClick={onClose}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
