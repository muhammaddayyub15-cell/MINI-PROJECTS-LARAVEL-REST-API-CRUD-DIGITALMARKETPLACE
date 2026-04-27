import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axios";
import MovieList from "../components/ui/movie/MovieList";

function Popular() {
  const outlet = useOutletContext() || {};
  const search = outlet.search || "";

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const perPage = 24;

  // reset page saat search berubah
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await api.get(
          `/movies?type=popular&page=${page}&per_page=${perPage}&search=${search}`
        );

        const result = res.data?.data;

        if (!ignore) {
          setMovies(result.data);
          setLastPage(result.last_page);
        }
      } catch (err) {
        console.log("Popular fetch error:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [page, search]);

  return (
    <div className="text-white">
      <h1 className="mb-4 text-2xl font-bold">Popular Movies</h1>

      {loading ? (
        <div className="text-white/40">Loading...</div>
      ) : (
        <MovieList movies={movies} />
      )}

      {lastPage > 1 && (
        <div className="flex justify-center gap-3 mt-8">

          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <span>{page} / {lastPage}</span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
            disabled={page === lastPage}
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}

export default Popular;