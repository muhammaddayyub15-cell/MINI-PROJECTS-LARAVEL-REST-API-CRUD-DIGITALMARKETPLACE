import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useMovie } from "../../../contexts/MovieContexts";

const PLACEHOLDER = "https://placehold.co/300x450/1a1a1a/ffffff?text=No+Image";

function MovieCard({ id, title, poster_url, rating, categories }) {
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useMovie();

  const [hovered, setHovered]             = useState(false);
  const [pinned, setPinned]               = useState(false);
  const [movie, setMovie]                 = useState(null);
  const [loading, setLoading]             = useState(false);
  const [reaction, setReaction]           = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [counts, setCounts]               = useState({ love: 0, hate: 0, watchlist: 0 });
  const cardRef     = useRef(null);
  const reactionRef = useRef(null);
  const hoverTimer  = useRef(null);

  const inWatchlist = movie ? isInWatchlist(movie.id) : isInWatchlist(id);
  const expanded    = hovered || pinned;

  const reactions = [
    { type: "love",    emoji: "👍", label: "Love" },
    { type: "neutral", emoji: "😐", label: "Neutral" },
    { type: "hate",    emoji: "👎", label: "Hate" },
  ];
  const currentReaction = reactions.find((r) => r.type === reaction);

  // Fetch detail sekali saat pertama expand
  useEffect(() => {
    if (!expanded || movie || loading) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/movies/${id}`);
        const d   = res.data.data;
        setMovie(d);
        setCounts({
          love:      d.love_count      ?? 0,
          hate:      d.hate_count      ?? 0,
          neutral:   d.neutral_count   ?? 0,
          watchlist: d.watchlist_count ?? 0,
        });
      } catch (err) {
        console.log("Fetch detail error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [expanded]);

  // Tutup pinned saat klik di luar
  useEffect(() => {
    if (!pinned) return;
    const handler = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setPinned(false);
        setHovered(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pinned]);

  // Tutup reaction popup
  useEffect(() => {
    const handler = (e) => {
      if (reactionRef.current && !reactionRef.current.contains(e.target)) {
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape untuk unpin
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setPinned(false); setHovered(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 120);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    if (!pinned) setHovered(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setPinned((p) => !p);
    setHovered(true);
  };

  const handleReaction = async (e, type) => {
    e.stopPropagation();
    try {
      await api.post(`/reactions/${id}`, { type });
      setCounts((prev) => {
        const next = { ...prev };
        if (reaction === "love") next.love = Math.max(0, next.love - 1);
        if (reaction === "hate") next.hate = Math.max(0, next.hate - 1);
        if (type === "love") next.love += 1;
        if (type === "hate") next.hate += 1;
        return next;
      });
      setReaction(type);
      setShowReactions(false);
    } catch (err) {
      console.log("Reaction error:", err);
    }
  };

  const handleWatchlist = async (e) => {
    e.stopPropagation();
    try {
      await api.post(`/watchlist/${id}`);
      toggleWatchlist(id);
      setCounts((prev) => ({
        ...prev,
        watchlist: inWatchlist ? Math.max(0, prev.watchlist - 1) : prev.watchlist + 1,
      }));
    } catch (err) {
      console.log("Watchlist error:", err);
    }
  };

  return (
    <>
      <style>{`
        @keyframes expandCard {
          from { opacity: 0.85; transform: scale(0.97) }
          to   { opacity: 1;    transform: scale(1) }
        }
        .card-detail { animation: expandCard 0.18s ease; }
      `}</style>

      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`
          relative w-full cursor-pointer rounded-2xl text-white overflow-hidden
          bg-white/5 backdrop-blur-xl border border-white/10
          shadow-[0_10px_30px_rgba(0,0,0,0.5)]
          transition-all duration-300 ease-out
          ${expanded
            ? "scale-105 z-50 shadow-[0_24px_60px_rgba(0,0,0,0.8)] border-white/25 bg-[#1a1a2e]/95"
            : "scale-100 z-0 hover:border-white/20"
          }
        `}
      >
        {/* POSTER — rasio 2:3 (poster standar film) */}
        <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ aspectRatio: "2/3" }}>
          <img
            src={poster_url || PLACEHOLDER}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300
              ${expanded ? "brightness-75" : "brightness-100"}`}
            onError={(e) => { e.target.src = PLACEHOLDER; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-2 right-2
            px-2 py-0.5 text-xs font-semibold text-yellow-400
            bg-black/50 backdrop-blur-md border border-white/10 rounded-lg">
            ★ {rating}
          </div>

          {/* Pin indicator */}
          {pinned && (
            <div className="absolute top-2 left-2
              px-1.5 py-0.5 text-xs bg-black/50 backdrop-blur-md border border-white/15 rounded-lg">
              📌
            </div>
          )}
        </div>

        {/* COLLAPSED: judul + genre */}
        {!expanded && (
          <div className="p-2.5">
            <h4 className="text-xs font-semibold truncate sm:text-sm">{title}</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {JSON.parse(categories || "[]").slice(0, 2).map((cat) => (
                <span key={cat} className="px-1.5 py-0.5 text-[9px] rounded-full bg-white/10 text-white/50">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* EXPANDED: detail */}
        {expanded && (
          <div className="px-3 pb-3 pt-2.5 card-detail" onClick={(e) => e.stopPropagation()}>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 rounded-full border-white/20 border-t-white/70 animate-spin" />
              </div>
            )}

            {!loading && (
              <>
                {/* Judul + tahun */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <h3 className="text-xs font-bold leading-tight text-white truncate sm:text-sm">{title}</h3>
                  {movie?.release_year && (
                    <span className="text-white/40 text-[10px] shrink-0">{movie.release_year}</span>
                  )}
                </div>

                {/* Genre */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {JSON.parse(movie?.categories || categories || "[]").map((cat) => (
                    <span key={cat} className="px-1.5 py-0.5 text-[9px] rounded-full bg-white/10 border border-white/20 text-white/60">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Description */}
                {movie?.description && (
                  <p className="text-white/50 text-[10px] leading-relaxed mb-2.5 line-clamp-2">
                    {movie.description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-1 mb-2.5">
                  {[
                    { emoji: "👍", count: counts.love,      label: "Love" },
                    { emoji: "👎", count: counts.hate,      label: "Hate" },
                    { emoji: "★",  count: counts.watchlist, label: "Saved" },
                  ].map(({ emoji, count, label }) => (
                    <div key={label} className="flex flex-col items-center py-1.5 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-xs">{emoji}</span>
                      <span className="text-white font-semibold text-[11px]">{count}</span>
                      <span className="text-white/40 text-[9px]">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Views */}
                {movie?.views !== undefined && (
                  <div className="flex justify-between text-[10px] mb-2.5 border-t border-white/10 pt-2">
                    <span className="text-white/40">Views</span>
                    <span className="text-white/70">{Number(movie.views).toLocaleString()}</span>
                  </div>
                )}

                {/* React + Watchlist */}
                <div className="flex gap-1.5 mb-2">
                  <div ref={reactionRef} className="relative flex-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowReactions((p) => !p); }}
                      className={`w-full py-1.5 text-[10px] rounded-lg border transition-all active:scale-95
                        ${reaction
                          ? "bg-white/20 border-white/30 text-white"
                          : "bg-white/10 text-white/60 border-white/15 hover:bg-white/20"
                        }`}
                    >
                      {currentReaction ? `${currentReaction.emoji} ${currentReaction.label}` : "🤍 React"}
                    </button>

                    {showReactions && (
                      <div className="absolute bottom-[calc(100%+4px)] left-0 w-32
                        bg-black/80 backdrop-blur-xl border border-white/20
                        rounded-xl overflow-hidden z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                        {reactions.map((r) => (
                          <button
                            key={r.type}
                            onClick={(e) => handleReaction(e, r.type)}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-[10px] transition-all
                              ${reaction === r.type ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/15"}`}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.label}</span>
                            {reaction === r.type && <span className="ml-auto text-white/40">✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleWatchlist}
                    className={`flex-1 py-1.5 text-[10px] rounded-lg border transition-all active:scale-95
                      ${inWatchlist
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                        : "bg-white/10 text-white/60 border-white/15 hover:bg-white/20"
                      }`}
                  >
                    {inWatchlist ? "★ Saved" : "☆ Watchlist"}
                  </button>
                </div>

                {/* Watch */}
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/movies/${id}`); }}
                  className="w-full py-1.5 text-[10px] font-semibold text-white rounded-lg
                    transition-all active:scale-95
                    bg-gradient-to-br from-red-600/90 to-red-500/90
                    border border-red-500/30
                    hover:from-red-500 hover:to-red-400"
                >
                  ▶ Watch Now
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default MovieCard;