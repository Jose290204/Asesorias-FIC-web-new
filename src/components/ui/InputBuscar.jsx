import SearchIcon from '@mui/icons-material/Search';

export default function InputBuscar({ value, onChange, placeholder = "Buscar" }) {
  return (
    <div className="relative flex-1 max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-900 transition-all placeholder:text-gray-400"
      />
    </div>
  );
}