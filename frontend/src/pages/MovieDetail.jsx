import { useParams } from "react-router-dom";
import { useMovie } from "../contexts/MovieContexts";

function MovieDetail() {
  const { id } = useParams();
  const { movies = [], addToList } = useMovie() || {};

  const movie = movies.find((m) => m.id === Number(id));

  // 🟡 loading safety
  if (!movies.length) {
    return <p className="text-white">Loading movies...</p>;
  }

  // ❌ not found
  if (!movie) {
    return <p className="text-white">Movie not found</p>;
  }

  return (
    <div className="text-white">

      {/* HERO IMAGE */}
      <div className="relative mb-6">
        <img
          src={movie.posterUrl || movie.poster_url}
          alt={movie.title}
          className="object-cover w-full h-87.5 rounded-xl"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent rounded-xl" />

        <div className="absolute bottom-4 left-4">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="text-yellow-400">⭐ {movie.rating}</p>
          <p className="text-gray-300">{movie.category}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => addToList?.(movie)}
          className="px-5 py-2 font-semibold bg-red-600 rounded-lg hover:bg-red-700"
        >
          Watchlist
        </button>

        <button className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">
          ▶ Watch (Coming Soon)
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Description</h2>
        <p className="text-gray-300">
          {movie.description || "No description available"}
        </p>
      </div>

      {/* TRAILER */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Trailer</h2>

        <div className="overflow-hidden rounded-lg aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/YoHD9XEInc0"
            title="Trailer"
            allowFullScreen
          />
        </div>
      </div>

    </div>
  );
}

export default MovieDetail;