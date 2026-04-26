import { useEffect, useState } from "react";
import MovieList from "../components/ui/movie/MovieList";
import api from "../api/axios";

function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/movies?page=${pageNumber}`);
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

      <h1 className="mb-4 text-2xl font-bold">Movies List</h1>

      {/* SEARCH MOBILE */}
      <input
        type="text"
        placeholder="Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 mb-4 text-sm text-white placeholder-gray-400 lg:hidden rounded-xl bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />

      {/* MOVIE LIST — flex-1 supaya memenuhi halaman */}
      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/5 animate-pulse">
                <div className="h-48 rounded-t-2xl bg-white/10" />
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
      <div className="flex items-center justify-center gap-4 pb-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 text-sm transition-all border rounded-lg bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          ← Prev
        </button>
        <span className="text-sm text-white/60">
          {page} / {lastPage}
        </span>
        <button
          disabled={page === lastPage}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 text-sm transition-all border rounded-lg bg-white/10 border-white/20 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default Home;