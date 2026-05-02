import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);

  // Fetch Semua Movie
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get("/movies?per_page=100");
        setMovies(res.data?.data?.data || []);
      } catch (err) {
        console.log("MovieContext fetch error:", err);
      }
    };
    fetchAll();
  }, []);

  // Fetch Watchlist Ids Hanya Jika Sudah Login
  useEffect(() => {
    const fetchWatchlistIds = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/watchlist");
        const ids = (res.data.data || []).map((item) => item.movie_id);
        setWatchlistIds(ids);
      } catch (err) {
        console.log("Watchlist sync error:", err);
      }
    };
    fetchWatchlistIds();
  }, []);

  const toggleWatchlist = (movieId) => {
    setWatchlistIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const isInWatchlist = (movieId) => watchlistIds.includes(movieId);

  const [reactions, setReactions] = useState({});

  const reactToMovie = (movieId, type) => {
    setReactions((prev) => {
      const current = prev[movieId] || { like: 0, neutral: 0, hate: 0, user: null };
      let updated = { ...current };
      if (current.user) updated[current.user]--;
      updated[type]++;
      updated.user = type;
      return { ...prev, [movieId]: updated };
    });
  };

  return (
    <MovieContext.Provider value={{
      movies, setMovies,
      watchlistIds, toggleWatchlist, isInWatchlist,
      reactions, reactToMovie,
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);