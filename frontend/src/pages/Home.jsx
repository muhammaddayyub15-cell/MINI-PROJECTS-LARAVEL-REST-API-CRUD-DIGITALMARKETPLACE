import { useEffect, useState } from "react";
import MovieList from "../components/ui/movie/MovieList";
import api from "../api/axios";

// Jumlah skeleton disesuaikan per breakpoint (pakai nilai tengah)
const SKELETON_COUNT = 12;

function Home() {
  const [search, setSearch]     = useState("");
  const [movies, setMovies]     = useState([]);
  const [page, setPage]         = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading]   = useState(true);

  const fetchMovies = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res  = await api.get(`/movies?page=${pageNumber}&per_page=12`);
      const data = res.data?.data;
      setMovies(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch (err) {
      console.log("Error fetch movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMovies(page); }, [page]);

  return (
    <div className="flex flex-col min-h-screen text-white">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold sm:text-2xl">Movies List</h1>
      </div>

  
      {/* MOVIE GRID */}
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
          <MovieList movies={movies} search={search} />
        )}
      </div>

      {/* PAGINATION */}
      {!loading && lastPage > 1 && (
        <div className="flex items-center justify-center gap-3 pb-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 text-sm transition-all border rounded-lg bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >← Prev</button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {[...Array(lastPage)].map((_, i) => {
              const p = i + 1;
              // Tampilkan hanya halaman di sekitar current page
              if (p === 1 || p === lastPage || (p >= page - 1 && p <= page + 1)) {
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs rounded-lg transition-all active:scale-95
                      ${p === page
                        ? "bg-yellow-500/30 text-yellow-400 border border-yellow-500/40"
                        : "bg-white/10 text-white/60 hover:bg-white/20 border border-white/10"
                      }`}
                  >{p}</button>
                );
              }
              // Ellipsis
              if (p === page - 2 || p === page + 2) {
                return <span key={p} className="flex items-center justify-center w-8 h-8 text-xs text-white/30">…</span>;
              }
              return null;
            })}
          </div>

          <button
            disabled={page === lastPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 text-sm transition-all border rounded-lg bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >Next →</button>
        </div>
      )}
    </div>
  );
}

export default Home;