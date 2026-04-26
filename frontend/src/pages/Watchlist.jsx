import { useEffect, useState } from "react";
import api from "../api/axios";
import { useMovie } from "../contexts/MovieContexts";

function Watchlist() {
  const { toggleWatchlist } = useMovie();
  const [apiWatchlist, setApiWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await api.get("/watchlist");
      setApiWatchlist(res.data.data || []);
    } catch (err) {
      console.log("Watchlist error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWatchlist(); }, []);

  const handleRemove = async (movieId) => {
    try {
      await api.post(`/watchlist/${movieId}`);
      toggleWatchlist(movieId);
      await fetchWatchlist(); // ← refresh dari API
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="text-white">
      <h1 className="mb-4 text-2xl font-bold">
         Watchlist ({apiWatchlist.length})
      </h1>

      {loading ? (
        <p className="text-white/40">Loading...</p>
      ) : apiWatchlist.length === 0 ? (
        <div className="py-16 text-center text-white/30">
          <p className="mb-3 text-4xl">☆</p>
          <p>You haven't added any movies to your watchlist yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {apiWatchlist.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 transition-all border rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.movie?.poster_url}
                  alt={item.movie?.title}
                  className="object-cover w-12 h-16 rounded-lg"
                  onError={(e) => { e.target.src = "https://placehold.co/48x64/1a1a1a/ffffff?text=?"; }}
                />
                <div>
                  <p className="font-semibold">{item.movie?.title}</p>
                  <p className="text-sm text-yellow-400">⭐ {item.movie?.rating}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.movie_id)}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 active:scale-95 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;