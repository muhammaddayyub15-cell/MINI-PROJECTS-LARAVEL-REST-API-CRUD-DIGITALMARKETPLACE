import { useEffect, useState } from "react";
import api from "../api/axios";
import MovieList from "../components/ui/movie/MovieList";

function Genre() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([
    "All", "Action", "Adventure", "Animation", "Comedy",
    "Crime", "Drama", "Fantasy", "History", "Horror",
    "Music", "Mystery", "Romance", "Sci-Fi", "Thriller",
    "War", "Western"
  ]);

  const [selected, setSelected] = useState("All");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const perPage = 24;

  // FETCH MOVIES FROM API (WITH GENRE FILTER)
  const fetchMovies = async (currentPage = 1, genre = "All") => {
    setLoading(true);

    try {
      const res = await api.get(
        `/movies?page=${currentPage}&per_page=${perPage}&genre=${genre}`
      );

      const data = res.data?.data;

      setMovies(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);

      // update genres dari API jika tersedia
      if (data.genres && data.genres.length > 0) {
        setGenres(["All", ...data.genres]);
      }
    } catch (err) {
      console.log("Error fetch genre movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    fetchMovies(page, selected);
  }, [page, selected]);

  // RESET PAGE saat genre berubah
  useEffect(() => {
    setPage(1);
  }, [selected]);

  return (
    <div className="text-white">

      {/* HEADER */}
      <h1 className="mb-4 text-2xl font-bold">Genre</h1>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelected(g)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all active:scale-95
              ${
                selected === g
                  ? "bg-yellow-500 text-black font-semibold"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-white/40 animate-pulse">Loading...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-white/40">No movies found for <span className="text-yellow-500">"{selected}"</span></p>
          </div>
        ) : (
          <MovieList movies={movies} />
        )}
      </div>

      {/* PAGINATION */}
      {!loading && lastPage > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">

          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 text-sm transition rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>

          <div className="px-3 py-1 text-sm rounded-lg bg-white/10">
            {page} / {lastPage}
          </div>

          <button
            disabled={page === lastPage}
            onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
            className="px-4 py-2 text-sm transition rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>

        </div>
      )}
    </div>
  );
}

export default Genre;