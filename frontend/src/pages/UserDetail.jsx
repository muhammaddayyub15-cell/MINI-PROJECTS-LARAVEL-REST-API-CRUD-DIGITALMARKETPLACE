import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

// ── Constants 

const REACTION_META = {
  love:    { emoji: "❤️", label: "Love",    color: "bg-rose-500",  badge: "bg-rose-500/15 text-rose-400 border-rose-500/30"    },
  neutral: { emoji: "😐", label: "Neutral", color: "bg-slate-400", badge: "bg-slate-500/15 text-slate-300 border-slate-500/30" },
  hate:    { emoji: "😡", label: "Hate",    color: "bg-red-600",   badge: "bg-red-500/15 text-red-400 border-red-500/30"       },
};

// ── Helpers 

function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className="flex items-center gap-3 p-3 border sm:p-4 rounded-xl bg-white/5 border-white/10">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs truncate text-white/40">{label}</p>
        <p className="text-lg font-bold leading-tight sm:text-xl">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-widest uppercase text-white/60">
      <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-purple-500 to-indigo-500 shrink-0" />
      {children}
    </h3>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-white/25">
      <span className="mb-2 text-4xl">{icon}</span>
      <p className="text-sm text-center">{text}</p>
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2 sm:hidden text-white/25 text-xs border-b border-white/5">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      Scroll to see more
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({ user, onClose, onSave }) {
  const [form, setForm]               = useState({ name: user.name, email: user.email, role: user.role, password: "", avatar: user.avatar ?? null });
  const [avatarPreview, setPreview]   = useState(user.avatar ?? null);
  const [isDragging, setDragging]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const fileRef                       = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("File too large. Max 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target.result); setForm(p => ({ ...p, avatar: e.target.result })); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    await onSave(payload);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full sm:max-w-md bg-[#1a1f2e] sm:rounded-2xl rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Handle mobile */}
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/10">
          <h2 className="font-bold text-white">Edit User</h2>
          <button onClick={onClose} className="flex items-center justify-center transition-colors rounded-lg text-white/40 hover:text-white w-7 h-7 hover:bg-white/10">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3 overflow-y-auto max-h-[80vh]">

          {/* Avatar */}
          <div>
            <label className="block mb-2 text-xs text-white/50">Profile Photo</label>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 overflow-hidden text-lg font-bold border-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shrink-0 border-white/10">
                {avatarPreview ? <img src={avatarPreview} alt="" className="object-cover w-full h-full" /> : form.name?.charAt(0).toUpperCase()}
              </div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`flex-1 border-2 border-dashed rounded-lg px-3 py-2.5 cursor-pointer text-center transition-all select-none
                  ${isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/15 hover:border-white/30 hover:bg-white/5"}`}
              >
                <p className="text-xs text-white/40">{isDragging ? "Drop image here" : "Click or drag an image"}</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => processFile(e.target.files[0])} />
            </div>
            {avatarPreview && (
              <button type="button" onClick={() => { setPreview(null); setForm(p => ({ ...p, avatar: null })); }}
                className="mt-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors">✕ Remove photo</button>
            )}
          </div>

          {/* Name */}
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Full name"
            className="w-full p-2.5 text-sm text-white border rounded-lg bg-white/10 border-white/20 placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors" />

          {/* Email */}
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required type="email" placeholder="Email"
            className="w-full p-2.5 text-sm text-white border rounded-lg bg-white/10 border-white/20 placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors" />

          {/* Password */}
          <input onChange={e => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password (leave blank to keep current)"
            className="w-full p-2.5 text-sm text-white border rounded-lg bg-white/10 border-white/20 placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors" />

          {/* Role */}
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full p-2.5 text-sm rounded-lg bg-[#0d1117] text-white border border-white/20 focus:outline-none focus:border-purple-500 transition-colors">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm rounded-lg border border-white/15 text-white/50 hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

function UserDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [tab,        setTab]        = useState("watchlist");
  const [showEdit,   setShowEdit]   = useState(false);
  const [toggling,   setToggling]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${id}`);
      setUser(res.data.data ?? res.data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, [id]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSave = async (payload) => {
    try {
      await api.put(`/users/${id}`, payload);
      setShowEdit(false);
      await loadUser();
    } catch (err) {
      console.error("Update error:", err.response?.data);
      alert(err.response?.data?.message ?? "Failed to save changes");
    }
  };

  const handleToggleStatus = async () => {
    setToggling(true);
    const isActive = user.is_active === 1 || user.is_active === true;
    try {
      await api.put(`/users/${id}`, { is_active: isActive ? 0 : 1 });
      setUser(prev => ({ ...prev, is_active: isActive ? 0 : 1 }));
    } catch (err) {
      console.error("Toggle error:", err.response?.data);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${user.name}"? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${id}`);
      navigate("/admin");
    } catch (err) {
      console.error("Delete error:", err.response?.data);
      alert(err.response?.data?.message ?? "Failed to delete user");
      setDeleting(false);
    }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-white">
      <div className="space-y-3 text-center">
        <div className="w-10 h-10 mx-auto border-2 border-purple-500 rounded-full border-t-transparent animate-spin" />
        <p className="text-sm text-white/40">Loading user details…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh] text-white px-4">
      <div className="space-y-4 text-center">
        <p className="text-4xl">😕</p>
        <p className="font-semibold">{error}</p>
        <button onClick={() => navigate("/admin")}
          className="px-5 py-2 text-sm transition rounded-xl bg-white/10 hover:bg-white/20">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  // ── Derived ────────────────────────────────────────────────────────────────

  const watchlist     = user?.watchlist  ?? [];
  const reactions     = user?.reactions  ?? [];
  const isActive      = user?.is_active === 1 || user?.is_active === true;
  const reactionCount = {
    love:    reactions.filter(r => r.type === "love").length,
    neutral: reactions.filter(r => r.type === "neutral").length,
    hate:    reactions.filter(r => r.type === "hate").length,
  };
  const reactionTotal = reactions.length;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 text-white sm:space-y-6">

      {/* Back */}
      <button onClick={() => navigate("/admin")}
        className="inline-flex items-center gap-2 text-sm transition-colors text-white/50 hover:text-white group">
        <span className="flex items-center justify-center transition-all rounded-lg w-7 h-7 bg-white/10 group-hover:bg-white/20">←</span>
        ← Back to Dashboard
      </button>

      {/* ── Hero card ── */}
      <div className="overflow-hidden border shadow-xl rounded-2xl border-white/10">

        {/* Gradient strip */}
        <div className="relative h-24 sm:h-28 bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500">
          <div className="absolute -bottom-9 left-5 sm:left-6 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20
                          rounded-full bg-gradient-to-br from-blue-500 to-purple-500
                          flex items-center justify-center text-2xl sm:text-3xl font-bold
                          border-4 border-[#0d1117] overflow-hidden shadow-lg">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
              : user.name?.charAt(0).toUpperCase()
            }
          </div>
        </div>

        <div className="px-4 sm:px-6 pt-12 pb-5 bg-[#0d1117]">

          {/* Name + role + status + id */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-lg font-bold sm:text-xl">{user.name}</h1>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium shrink-0 ${
                  user.role === "admin"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}>{user.role}</span>
              </div>
              <p className="text-sm break-all text-white/50">{user.email}</p>
              {(user.created_at || user.updated_at) && (
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-white/35">
                  {user.created_at && <span>Joined: {new Date(user.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}</span>}
                  {user.updated_at && <span>Updated: {new Date(user.updated_at).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}</span>}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-emerald-400" : "bg-red-400"}`} />
                {isActive ? "Active" : "Suspended"}
              </span>
              <span className="font-mono text-xs text-white/30">#{user.id}</span>
            </div>
          </div>

          {/* ── ACTION BUTTONS ── */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">

            {/* Edit */}
            <button
              onClick={() => setShowEdit(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg
                         bg-amber-500/15 text-amber-400 border border-amber-500/30
                         hover:bg-amber-500/25 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit User
            </button>

            {/* Suspend / Activate toggle */}
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border
                          transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                          ${isActive
                            ? "bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25"
                            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                          }`}
            >
              {toggling
                ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                )
              }
              {isActive ? "Suspend User" : "Activate User"}
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg
                         bg-red-500/15 text-red-400 border border-red-500/30
                         hover:bg-red-500/25 transition-all active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {deleting
                ? <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )
              }
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard label="Watchlist"    value={watchlist.length}  icon="🎬" colorClass="bg-blue-500/20 text-blue-400"    />
        <StatCard label="Total Reactions" value={reactionTotal}     icon="💬" colorClass="bg-purple-500/20 text-purple-400" />
        <StatCard label="Love / Hate"  value={`${reactionCount.love}/${reactionCount.hate}`} icon="❤️" colorClass="bg-rose-500/20 text-rose-400" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 border rounded-xl bg-white/5 border-white/10">
        {[
          { key: "watchlist", emoji: "🎬", label: "Watchlist" },
          { key: "reactions", emoji: "💬", label: "Reactions" },
        ].map(({ key, emoji, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === key ? "bg-white/15 text-white shadow" : "text-white/40 hover:text-white/70 hover:bg-white/5"
            }`}
          >
            <span className="sm:hidden">{emoji}</span>
            <span className="hidden sm:inline">{emoji} {label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Watchlist ── */}
      {tab === "watchlist" && (
        <div>
          <SectionTitle>Watchlist ({watchlist.length})</SectionTitle>
          {watchlist.length === 0
            ? <EmptyState icon="🎥" text="No movies in watchlist yet" />
            : (
              <div className="overflow-hidden border rounded-xl border-white/10">
                <ScrollHint />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[440px] text-sm">
                    <thead>
                      <tr className="text-xs text-left bg-white/5 text-white/40">
                        <th className="px-4 py-3 font-medium">#</th>
                        <th className="px-4 py-3 font-medium">Movie Title</th>
                        <th className="px-4 py-3 font-medium">Rating</th>
                        <th className="px-4 py-3 font-medium">Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.map((item, i) => (
                        <tr key={item.id ?? i} className="transition-colors border-t border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-xs text-white/30">{i + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.movie?.poster_url
                                ? <img src={item.movie.poster_url} alt="" className="object-cover w-8 rounded h-11 shrink-0" />
                                : <div className="flex items-center justify-center w-8 text-xs rounded h-11 bg-white/10 shrink-0 text-white/20">🎬</div>
                              }
                              <div>
                                <p className="font-medium whitespace-nowrap">{item.movie?.title ?? "—"}</p>
                                {item.movie?.categories && (
                                  <p className="text-xs text-white/35 mt-0.5">
                                    {(() => { try { return JSON.parse(item.movie.categories).slice(0, 2).join(", "); } catch { return item.movie.categories; } })()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-yellow-400 whitespace-nowrap">
                            {item.movie?.rating ? `★ ${item.movie.rating}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
        </div>
      )}

      {/* ── Tab: Reactions ── */}
      {tab === "reactions" && (
        <div className="space-y-4">
          <SectionTitle>Reaction Summary</SectionTitle>
          {reactionTotal === 0
            ? <EmptyState icon="😶" text="This user hasn't reacted to anything yet" />
            : (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {Object.entries(REACTION_META).map(([key, { emoji, label, badge }]) => (
                    <div key={key} className="flex flex-col items-center gap-1.5 p-3 sm:p-4 border rounded-xl bg-white/5 border-white/10">
                      <span className="text-2xl sm:text-3xl">{emoji}</span>
                      <p className="text-lg font-bold sm:text-xl">{reactionCount[key]}</p>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${badge}`}>{label}</span>
                    </div>
                  ))}
                </div>

                {/* Proportion bar */}
                <div className="p-4 border rounded-xl bg-white/5 border-white/10">
                  <div className="flex justify-between mb-2 text-xs text-white/40">
                    <span>Reaction breakdown</span>
                    <span>Total: {reactionTotal}</span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full gap-0.5">
                    {Object.entries(REACTION_META).map(([key, { color }]) => {
                      if (!reactionCount[key]) return null;
                      const pct = ((reactionCount[key] / reactionTotal) * 100).toFixed(1);
                      return <div key={key} style={{ width: `${pct}%` }} title={`${REACTION_META[key].emoji} ${pct}%`} className={`${color} rounded-full`} />;
                    })}
                  </div>
                  <div className="flex gap-3 mt-2">
                    {Object.entries(REACTION_META).map(([key, { emoji, label, color }]) => (
                      <span key={key} className="flex items-center gap-1 text-xs text-white/35">
                        <span className={`w-2 h-2 rounded-full ${color}`} />{emoji} {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Detail per movie */}
                <div>
                  <SectionTitle>Per Movie ({reactions.length})</SectionTitle>
                  <div className="overflow-hidden border rounded-xl border-white/10">
                    <ScrollHint />
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[380px] text-sm">
                        <thead>
                          <tr className="text-xs text-left bg-white/5 text-white/40">
                            <th className="px-4 py-3 font-medium">#</th>
                            <th className="px-4 py-3 font-medium">Movie</th>
                            <th className="px-4 py-3 font-medium">Reaction</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reactions.map((r, i) => {
                            const meta = REACTION_META[r.type];
                            return (
                              <tr key={r.id ?? i} className="transition-colors border-t border-white/5 hover:bg-white/5">
                                <td className="px-4 py-3 text-xs text-white/30">{i + 1}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    {r.movie?.poster_url
                                      ? <img src={r.movie.poster_url} alt="" className="object-cover h-10 rounded w-7 shrink-0" />
                                      : <div className="flex items-center justify-center h-10 text-xs rounded w-7 bg-white/10 shrink-0 text-white/20">🎬</div>
                                    }
                                    <span className="font-medium whitespace-nowrap">{r.movie?.title ?? "—"}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {meta
                                    ? <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${meta.badge}`}>{meta.emoji} {meta.label}</span>
                                    : <span className="text-xs text-white/30">{r.type}</span>
                                  }
                                </td>
                                <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                                  {r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )
          }
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEdit && (
        <EditModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default UserDetail;