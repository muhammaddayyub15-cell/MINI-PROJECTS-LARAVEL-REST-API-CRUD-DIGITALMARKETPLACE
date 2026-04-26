import { useState } from "react";

function UserForm({ onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    name:     initialData?.name  || "",
    email:    initialData?.email || "",
    password: "",
    role:     initialData?.role  || "user",
  });

  const inputClass = "w-full px-3 py-2 text-white rounded-lg border bg-white/5 border-white/15 placeholder-white/30 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="flex flex-col gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Password (Required to change)"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className={inputClass}
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border bg-[#1a1f2e] text-white border-white/15 focus:outline-none focus:border-white/40 transition-all cursor-pointer"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full py-2.5 mt-1 font-semibold text-white rounded-lg
            bg-blue-600 border border-blue-500/50
            hover:bg-blue-500 hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)]
            active:scale-95 transition-all duration-200"
        >
          Save User
        </button>
      </div>
    </form>
  );
}

export default UserForm;