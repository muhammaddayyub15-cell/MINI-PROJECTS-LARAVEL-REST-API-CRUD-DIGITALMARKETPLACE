type NavbarProps = {
  onSearch?: (value: string) => void;
};

export default function Navbar({ onSearch }: NavbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 
      bg-black/40 backdrop-blur-md border-b border-red-900">

      {/* TITLE */}
      <h1 className="text-white text-lg font-semibold">
        🎬 Da Movie App
      </h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch?.(e.target.value)}
        className="bg-gray-800/80 text-white 
          px-4 py-2 rounded-lg 
          outline-none focus:ring-2 focus:ring-red-500
          transition"
      />
    </div>
  );
}