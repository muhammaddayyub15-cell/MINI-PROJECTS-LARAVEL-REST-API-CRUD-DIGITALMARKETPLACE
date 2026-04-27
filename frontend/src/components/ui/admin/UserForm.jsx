// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/components/ui/admin/UserForm.jsx
// GANTI SELURUH ISI FILE INI
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef } from "react";

function UserForm({ onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    name:     initialData?.name  || "",
    email:    initialData?.email || "",
    password: "",
    role:     initialData?.role  || "user",
    avatar:   initialData?.avatar || null,
  });

  const [avatarPreview, setPreview] = useState(initialData?.avatar || null);
  const [isDragging, setDragging]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const fileRef                     = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) { alert("File too large. Max 2MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setForm(p => ({ ...p, avatar: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    await onSubmit(payload);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Avatar Upload ── */}
      <div>
        <label className="block mb-2 text-xs font-medium tracking-wide uppercase text-white/50">
          Profile Photo
        </label>
        <div className="flex items-center gap-3">
          {/* Preview */}
          <div className="flex items-center justify-center overflow-hidden text-xl font-bold border-2 rounded-full shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 shrink-0 border-white/10">
            {avatarPreview
              ? <img src={avatarPreview} alt="preview" className="object-cover w-full h-full" />
              : <span>{form.name?.charAt(0).toUpperCase() || "U"}</span>
            }
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
            className={`flex-1 border-2 border-dashed rounded-xl px-3 py-3 cursor-pointer text-center select-none transition-all
              ${isDragging
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/15 hover:border-white/30 hover:bg-white/5"
              }`}
          >
            <p className="text-sm text-white/40">
              {isDragging ? "Drop image here" : "Click or drag an image"}
            </p>
            <p className="text-xs text-white/20 mt-0.5">JPG, PNG · max 2MB</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => processFile(e.target.files[0])} />
        </div>

        {avatarPreview && (
          <button type="button"
            onClick={() => { setPreview(null); setForm(p => ({ ...p, avatar: null })); }}
            className="mt-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >✕ Remove photo</button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/8" />

      {/* ── Name ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Name</label>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Full name"
          className="w-full px-4 py-2.5 text-sm text-white border rounded-xl
                     bg-white/5 border-white/10 placeholder-white/25
                     focus:outline-none focus:border-purple-500 focus:bg-white/8 transition-all"
        />
      </div>

      {/* ── Email ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Email</label>
        <input
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
          type="email"
          placeholder="user@example.com"
          className="w-full px-4 py-2.5 text-sm text-white border rounded-xl
                     bg-white/5 border-white/10 placeholder-white/25
                     focus:outline-none focus:border-purple-500 focus:bg-white/8 transition-all"
        />
      </div>

      {/* ── Password ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Password</label>
        <input
          onChange={e => setForm({ ...form, password: e.target.value })}
          type="password"
          placeholder={initialData ? "Leave blank to keep current" : "Min. 6 characters"}
          className="w-full px-4 py-2.5 text-sm text-white border rounded-xl
                     bg-white/5 border-white/10 placeholder-white/25
                     focus:outline-none focus:border-purple-500 focus:bg-white/8 transition-all"
        />
      </div>

      {/* ── Role ── */}
      <div>
        <label className="block text-xs text-white/50 mb-1.5 font-medium tracking-wide uppercase">Role</label>
        <div className="flex gap-2">
          {["user", "admin"].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                form.role === r
                  ? r === "admin"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                  : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
              }`}
            >
              {r === "admin" ? " Admin" : "User"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center w-full gap-2 py-3 mt-2 text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 active:scale-95 disabled:opacity-50"
      >
        {saving
          ? <><span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" /> Saving…</>
          : initialData ? "Save Changes" : "Create User"
        }
      </button>
    </form>
  );
}

export default UserForm;