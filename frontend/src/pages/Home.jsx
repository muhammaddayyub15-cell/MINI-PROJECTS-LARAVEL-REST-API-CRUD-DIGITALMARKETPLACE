import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieList from "../components/ui/movie/MovieList";
import api from "../api/axios";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navSearch = searchParams.get("search") || "";
  const [mobileSearch, setMobileSearch] = useState(navSearch);
  const mobileDebounce = useRef(null);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const SKELETON_COUNT = 12;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await api.get("/movies", {
          params: {
            page,
            per_page: 24,
            ...(navSearch ? { search: navSearch } : {}),
          },
        });
        if (cancelled) return;
        const data = res.data.data;
        setMovies(data.data);
        setPage(data.current_page);
        setLastPage(data.last_page);
      } catch (err) {
        if (!cancelled) console.log("Error fetch movies:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [page, navSearch]);

  // Reset page ke 1 saat search berubah
  const prevSearch = useRef(navSearch);
  useEffect(() => {
    if (prevSearch.current !== navSearch) {
      prevSearch.current = navSearch;
      setPage(1);
    }
  }, [navSearch]);

  // Mobile search debounce → update URL params
  const handleMobileSearch = (val) => {
    setMobileSearch(val);
    clearTimeout(mobileDebounce.current);
    mobileDebounce.current = setTimeout(() => {
      if (val) setSearchParams({ search: val });
      else setSearchParams({});
    }, 500);
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold sm:text-2xl">Movies List</h1>
      </div>

      {/* SEARCH mobile & tablet */}
      <input
        type="text"
        placeholder="Search movie..."
        value={mobileSearch}
        onChange={(e) => handleMobileSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 text-sm text-white placeholder-gray-400 rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400 lg:hidden"
      />

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {[...Array(SKELETON_COUNT)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse">
                <div className="rounded-t-2xl bg-white/10" style={{ aspectRatio: "2/3" }} />
                <div className="p-3 space-y-2">
                  <div className="w-3/4 h-3 rounded bg-white/10" />
                  <div className="w-1/2 h-3 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MovieList movies={movies} />
        )}
      </div>

      {!loading && lastPage > 1 && (
        <div className="flex items-center justify-center gap-3 pb-4 mt-8">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm transition-all border rounded-lg bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >← Prev</button>
          <span className="px-3 py-1 text-sm rounded-lg bg-white/10">{page} / {lastPage}</span>
          <button disabled={page === lastPage} onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm transition-all border rounded-lg bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >Next →</button>
        </div>
      )}
    </div>
  );
}

export default Home;