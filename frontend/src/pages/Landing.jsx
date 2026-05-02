import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

// Scrolling Poster Strip
function PosterStrip({ movies, direction = 1, speed = 30 }) {
  const trackRef = useRef(null);
  const raf = useRef(null);
  const pos = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || movies.length === 0) return;

    const step = () => {
      pos.current += direction * (speed / 1000);
      const halfW = track.scrollWidth / 2;
      if (direction > 0 && pos.current >= halfW) pos.current -= halfW;
      if (direction < 0 && pos.current <= 0) pos.current += halfW;
      track.style.transform = `translateX(-${pos.current}px)`;
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [movies, direction, speed]);

  // Repeat the array enough times to ensure the strip covers wide screens without gaps
  let repeated = [...movies];
  while (repeated.length > 0 && repeated.length < 30) {
    repeated = [...repeated, ...movies];
  }
  const doubled = [...repeated, ...repeated];

  return (
    <div className="w-full overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div ref={trackRef} className="flex gap-3 will-change-transform" style={{ width: "max-content" }}>
        {doubled.map((m, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 overflow-hidden rounded-xl group"
            style={{ width: 150, height: 225 }}
          >
            <img
              src={m.poster_url}
              alt={m.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
            />
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 via-transparent to-transparent group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-2 transition-transform duration-300 translate-y-full group-hover:translate-y-0">
              <p className="text-white text-[10px] font-semibold leading-tight truncate">{m.title}</p>
              <p className="text-yellow-400 text-[10px]">★ {m.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ad Banner
function AdBanner({ type = "horizontal" }) {
  const ads = [
    { label: "PROMOTED", title: "Stream Unlimited Movies", sub: "Get 3 months free with Premium", cta: "Try Free", color: "from-yellow-500/20 to-orange-500/20", border: "border-yellow-500/30" },
    { label: "SPONSORED", title: "4K Ultra HD Experience", sub: "Upgrade your home cinema today", cta: "Learn More", color: "from-blue-500/20 to-purple-500/20", border: "border-blue-500/30" },
    { label: "AD", title: "MovieBox Premium", sub: "Download & watch offline anytime", cta: "Get Now", color: "from-green-500/20 to-teal-500/20", border: "border-green-500/30" },
  ];
  const ad = ads[Math.floor(Math.random() * ads.length)];

  if (type === "sidebar") {
    return (
      <div className={`rounded-2xl border ${ad.border} bg-gradient-to-b ${ad.color} p-4 backdrop-blur-sm`}>
        <span className="text-[9px] font-bold tracking-widest text-white/30 uppercase">{ad.label}</span>
        <div className="flex items-center justify-center h-32 mt-3 mb-4 border rounded-xl bg-white/5 border-white/10">
          <span className="text-xs text-white/20">300 × 250</span>
        </div>
        <p className="text-sm font-semibold text-white">{ad.title}</p>
        <p className="mt-1 mb-3 text-xs text-white/50">{ad.sub}</p>
        <button className="w-full py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
          {ad.cta}
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${ad.border} bg-gradient-to-r ${ad.color} p-4 backdrop-blur-sm flex items-center justify-between gap-4`}>
      <div className="flex items-center flex-1 min-w-0 gap-4">
        <div className="flex items-center justify-center flex-shrink-0 w-16 h-16 border rounded-xl bg-white/5 border-white/10">
          <span className="text-white/20 text-[10px]">IMG</span>
        </div>
        <div className="min-w-0">
          <span className="text-[9px] font-bold tracking-widest text-white/30 uppercase block">{ad.label}</span>
          <p className="text-sm font-semibold text-white truncate">{ad.title}</p>
          <p className="text-xs truncate text-white/50">{ad.sub}</p>
        </div>
      </div>
      <button className="flex-shrink-0 px-4 py-2 text-xs font-semibold text-white transition-colors border rounded-xl bg-white/10 hover:bg-white/20 border-white/10">
        {ad.cta}
      </button>
    </div>
  );
}

// Main Landing Page
function Landing() {
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);

  useEffect(() => {
    api.get("/movies?per_page=50").then((res) => {
      let all = res.data?.data?.data ?? [];
      all = all.filter((m) => {
        const url = m.poster_url;
        return typeof url === 'string' && url.trim() !== '' && url !== 'null' && url !== 'N/A' && !url.includes('placehold');
      });
      setMovies(all);
      setTopMovies(all.filter((m) => m.rating >= 8.5).slice(0, 6));
    }).catch(() => {});
  }, []);

  const strip1 = movies.slice(0, 20);
  const strip2 = movies.slice(10, 30);
  const strip3 = movies.slice(20, 40);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0369f8] via-[#0d0c0c] to-[#f4c50d] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.95), transparent)" }}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-xl font-black tracking-tight">
            INDO<span className="text-yellow-400">FLIX</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2 text-sm font-semibold text-white transition-all border rounded-xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95">
            Login
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-bold text-white transition-all border rounded-xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95">
            Register Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-10">

        {/* BG Glow Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #ef4444 0%, transparent 70%)" }} />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-3xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold tracking-wider mb-6">
            🔥 INDONESIA'S #1 MOVIE PLATFORM
          </div>

          <h1 className="mb-6 text-5xl font-black leading-none tracking-tight sm:text-6xl md:text-7xl">
            <span className="block text-white">Watch Your</span>
            <span className="block" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Favorite Films
            </span>
            <span className="block text-white">Anytime</span>
          </h1>

          <p className="max-w-xl mx-auto mb-8 text-lg leading-relaxed text-white/50">
            Thousands of movies across every genre. Ratings, reviews, and personal watchlists. All in one platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="px-8 py-3.5 font-bold text-white transition-all border rounded-2xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95 hover:shadow-lg">
              Get Started — It's Free
            </Link>
            <Link to="/login" className="px-8 py-3.5 font-semibold text-white transition-all border rounded-2xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95 hover:shadow-lg">
              Already Have an Account
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            {[["50+", "Movies"], ["10K+", "Users"], ["4.9★", "Rating"]].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-black text-yellow-400">{val}</div>
                <div className="text-xs tracking-wider uppercase text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Poster Strips */}
        {movies.length > 0 && (
          <div className="relative w-full space-y-3">
            <PosterStrip movies={strip1} direction={1} speed={25} />
            <PosterStrip movies={strip2} direction={-1} speed={20} />
            <PosterStrip movies={strip3} direction={1} speed={30} />
          </div>
        )}
      </section>

      {/* Ad Banner 1 */}
      <section className="max-w-5xl px-6 py-4 mx-auto">
        <AdBanner type="horizontal" />
      </section>

      {/* Top Rated */}
      {topMovies.length > 0 && (
        <section className="max-w-5xl px-6 py-10 mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-yellow-400">🏆</span>
            <h2 className="text-xl font-black">Most Popular Films</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Main Featured */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-2 sm:grid-cols-3">
              {topMovies.slice(0, 6).map((m) => (
                <div key={m.id} className="relative overflow-hidden cursor-pointer rounded-xl group" style={{ aspectRatio: "2/3" }}>
                  <img src={m.poster_url} alt={m.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs font-bold leading-tight text-white truncate">{m.title}</p>
                    <p className="text-yellow-400 text-xs mt-0.5">★ {m.rating}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Ads */}
            <div className="space-y-3">
              <AdBanner type="sidebar" />
              <AdBanner type="sidebar" />
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-5xl px-6 py-10 mx-auto">
        <h2 className="mb-8 text-xl font-black text-center">Why IndoFlix?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: "🎭", title: "Thousands of Films", desc: "Complete collection across every genre and era" },
            { icon: "⭐", title: "Ratings & Reviews", desc: "Rate films and read reviews from the community" },
            { icon: "📋", title: "Personal Watchlist", desc: "Save your favorites and watch them later" },
          ].map((f) => (
            <div key={f.title} className="p-5 transition-all border rounded-2xl border-white/10 bg-white/5 backdrop-blur-sm hover:border-yellow-500/30 hover:bg-white/8">
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-1 text-sm font-bold">{f.title}</h3>
              <p className="text-xs leading-relaxed text-white/40">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Banner 2 */}
      <section className="max-w-5xl px-6 py-4 mx-auto">
        <AdBanner type="horizontal" />
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-16 text-center">
        <h2 className="mb-3 text-3xl font-black">Ready to Start Watching?</h2>
        <p className="mb-6 text-sm text-white/40">Register for free and access all movies.</p>
        <Link to="/register" className="inline-block px-10 py-3.5 font-bold text-white transition-all border rounded-2xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95 hover:shadow-xl">
          Register Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-lg">🎬</span>
          <span className="font-black tracking-tight">INDO<span className="text-yellow-400">FLIX</span></span>
        </div>
        <p className="text-xs text-white/20">© 2026 IndoFlix. Indonesia's Movie Platform.</p>
      </footer>

    </div>
  );
}

export default Landing;