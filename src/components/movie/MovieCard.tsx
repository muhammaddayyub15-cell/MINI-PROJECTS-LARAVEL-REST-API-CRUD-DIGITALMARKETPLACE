import type { Movie } from "../../data/movie.type";
import { useState } from "react";

function MovieCard({ title, posterUrl, rating, categories }: Movie) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div
      onClick={() => setShowDetail(!showDetail)}
      className="
        w-full cursor-pointer rounded-2xl overflow-hidden text-white
        bg-white/5 backdrop-blur-xl border border-white/10
        shadow-[0_10px_30px_rgba(0,0,0,0.5)]
        transition-all duration-300
        hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]
      "
    >
      {/* IMAGE */}
      <img
        src={posterUrl}
        className="w-full h-64 object-cover"
      />

      {/* CONTENT */}
      <div className="p-3">
        <h4 className="mb-1 font-semibold">{title}</h4>

        {showDetail && (
          <>
            <p className="text-yellow-400 text-sm">
              ⭐ {rating}
            </p>

            {/* CATEGORY */}
            <div className="flex gap-1 flex-wrap mt-2">
              {categories.map((cat, i) => (
                <span
                  key={i}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    px-2 py-1 text-[11px] rounded-full
                    bg-white/10 border border-white/20
                    backdrop-blur-md
                  "
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* BUTTON */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="
                mt-3 px-3 py-2 rounded-lg w-full
                bg-linear-to-br from-red-600 to-red-500
                text-white font-semibold
                shadow-[0_5px_15px_rgba(229,9,20,0.5)]
                transition hover:scale-105
              "
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