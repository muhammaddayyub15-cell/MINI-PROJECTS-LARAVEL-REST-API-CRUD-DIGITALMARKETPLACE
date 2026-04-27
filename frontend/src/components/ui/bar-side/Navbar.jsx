import { useLocation, useSearchParams } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageLabel = location.pathname === "/" ? "Movies" : "Page";
  const currentSearch = searchParams.get("search") || "";

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-black border-b sm:px-6 border-white/10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-2xl text-white lg:hidden">☰</button>
        <h1 className="text-base font-semibold text-white sm:text-lg whitespace-nowrap">🎬 INDOFLIX</h1>
      </div>

      {/* Search desktop */}
      <div className="justify-end hidden w-full lg:flex">
        <input
          type="text"
          placeholder={`Search ${pageLabel}...`}
          value={currentSearch}
          onChange={(e) => {
            const val = e.target.value;
            if (val) setSearchParams({ search: val });
            else setSearchParams({});
          }}
          className="w-[420px] xl:w-[520px] px-4 py-2 text-white bg-gray-800/80 rounded-lg outline-none transition focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </div>
  );
}

export default Navbar;