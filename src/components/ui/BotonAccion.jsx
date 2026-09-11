export default function BotonAccion({ label, onClick, color = "bg-[#2e7d32] hover:bg-[#1b5e20]" }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-sm text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm`}
    >
      {label}
    </button>
  );
}