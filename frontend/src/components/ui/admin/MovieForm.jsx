import { useState, useRef } from "react";

const CATEGORY_OPTIONS = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
  "Romance", "Sci-Fi", "Thriller", "Western",
];

function MovieForm({ onSubmit, initialData = null }) {
  const parseCategories = (raw) => {
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw || "[]"); } catch { return []; }
  };

  const [form, setForm] = useState({
    title:       initialData?.title       || "",
    description: initialData?.description || "",
    rating:      initialData?.rating      || "",
    year:        initialData?.year        || "",
    director:    initialData?.director    || "",
    poster_url:  initialData?.poster_url  || "",
    categories:  parseCategories(initialData?.categories),
  });

  const [posterPreview, setPosterPreview] = useState(initialData?.poster_url || null);
  const [isDragging, setDragging]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const fileRef                           = useRef(null);

  // ── Poster upload ──────────────────────────────────────────────────────────
  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("File too large. Max 5MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPosterPreview(e.target.result);
      setForm(p => ({ ...p, poster_url: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // ── Category toggle ────────────────────────────────────────────────────────
  const toggleCategory = (cat) => {
    setForm(p => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter(c => c !== cat)
        : [...p.categories, cat],
    }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      categories: JSON.stringify(form.categories),
      rating: form.rating ? parseFloat(form.rating) : null,
      year:   form.year   ? parseInt(form.year)      : null,
    };
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Poster Upload ── */}
      <div>
        <label className="block mb-2 text-xs font-medium tracking-wide uppercase text-white/50">
          Movie Poster
        </label>
        <div className="flex gap-3">
          {/* Preview */}
          <div className="flex items-center justify-center w-20 overflow-hidden border h-28 rounded-xl bg-white/5 border-white/10 shrink-0">
            {posterPreview
              ? <img src={posterPreview} alt="poster" className="object-cover w-full h-full" />
              : <span className="text-3xl opacity-30">🎬</span>
            }
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl px-3 py-3 cursor-pointer
                        text-center select-none transition-all flex flex-col items-center justify-center gap-1
                        ${isDragging
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-white/15 hover:border-white/30 hover:bg-white/5"
                        }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-white/40">{isDragging ? "Drop image here" : "Click or drag poster"}</p>
            <p className="text-xs text-white/20">JPG, PNG · max 5MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => processFile(e.target.files[0])} />
        </div>

        {/* Or paste URL */}
        <div className="mt-2">
          <input
            value={form.poster_url?.startsWith("data:") ? "" : (form.poster_url || "")}
            onChange={e => { setForm(p => ({ ...p, poster_url: e.target.value })); setPosterPreview(e.target.value || null); }}
            placeholder="Or paste poster URL…"
            className="w-full px-3 py-2 text-xs text-white transition-all border rounded-lg bg-white/5 border-white/10 placeholder-white/20 focus:outline-none focus:border-purple-500"
          />
        </div>

        {posterPreview && (
          <button type="button"
            onClick={() => { setPosterPreview(null); setForm(p => ({ ...p, poster_url: "" })); }}
            className="mt-1 text-xs transition-colors text-rose-400 hover:text-rose-300"
          >✕ Remove poster</button>
        )}
      </div>

      <div className="h-px bg-white/8" />

      {/* ── Title ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Title</label>
        <input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
          placeholder="Movie title"
          className="w-full px-4 py-2.5 text-sm text-white border rounded-xl
                     bg-white/5 border-white/10 placeholder-white/25
                     focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* ── Description ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Brief synopsis…"
          rows={3}
          className="w-full px-4 py-2.5 text-sm text-white border rounded-xl resize-none
                     bg-white/5 border-white/10 placeholder-white/25
                     focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* ── Rating + Year row ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Rating</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-400 text-sm">★</span>
            <input
              value={form.rating}
              onChange={e => setForm({ ...form, rating: e.target.value })}
              type="number"
              step="0.1"
              min="0"
              max="10"
              placeholder="0.0 – 10"
              className="w-full pl-8 pr-4 py-2.5 text-sm text-white border rounded-xl
                         bg-white/5 border-white/10 placeholder-white/25
                         focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Year</label>
          <input
            value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value })}
            type="number"
            min="1900"
            max={new Date().getFullYear() + 2}
            placeholder="e.g. 2024"
            className="w-full px-4 py-2.5 text-sm text-white border rounded-xl
                       bg-white/5 border-white/10 placeholder-white/25
                       focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      {/* ── Director ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Director</label>
        <input
          value={form.director}
          onChange={e => setForm({ ...form, director: e.target.value })}
          placeholder="Director name"
          className="w-full px-4 py-2.5 text-sm text-white border rounded-xl
                     bg-white/5 border-white/10 placeholder-white/25
                     focus:outline-none focus:border-purple-500 transition-all"
        />
      </div>

      {/* ── Categories ── */}
      <div>
        <label className="block mb-2 text-xs font-medium tracking-wide uppercase text-white/50">
          Categories
          {form.categories.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 normal-case">
              {form.categories.length} selected
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_OPTIONS.map(cat => {
            const selected = form.categories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full border font-medium transition-all active:scale-95 ${
                  selected
                    ? "bg-purple-500/25 text-purple-300 border-purple-500/40"
                    : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/70"
                }`}
              >
                {selected ? "✓ " : ""}{cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center w-full gap-2 py-3 mt-2 text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 active:scale-95 disabled:opacity-50"
      >
        {saving
          ? <><span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" /> Saving…</>
          : initialData ? "Save Changes" : "Add Movie"
        }
      </button>
    </form>
  );
}

export default MovieForm;