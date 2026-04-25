import { useState } from "react";
import { useNavigate } from "react-router-dom";

function MovieCard({ id, title, poster_url, rating, categories }) {
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => setShowDetail((prev) => !prev)}
      className="w-full cursor-pointer rounded-2xl overflow-hidden text-white
        bg-white/5 backdrop-blur-xl border border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.5)]
        transition-all duration-300
        hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
    >
      <img
        src={poster_url}
        alt={title}
        className="object-cover w-full h-64"
        onError={(e) => { e.target.src = "https://placehold.co/300x400/1a1a1a/ffffff?text=No+Image"; }}
      />

      <div className="p-3">
        <h4 className="mb-1 font-semibold">{title}</h4>

        {showDetail && (
          <>
            <p className="text-sm text-yellow-400">⭐ {rating}</p>

            <div className="flex flex-wrap gap-1 mt-2">
              {JSON.parse(categories || "[]").map((cat) => (
                <span
                  key={cat}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 text-[11px] rounded-full bg-white/10 border border-white/20"
                >
                  {cat}
                </span>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movies/${id}`);
              }}
              className="w-full px-3 py-2 mt-3 font-semibold text-white transition rounded-lg bg-linear-to-br from-red-600 to-red-500 hover:scale-105"
            >
              ▶ Watch
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MovieCard;