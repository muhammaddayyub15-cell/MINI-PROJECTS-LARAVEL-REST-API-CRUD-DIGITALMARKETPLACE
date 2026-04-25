import { useState } from "react";

function UserForm({ onSubmit, initialData = null }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "user",
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <div className="flex flex-col gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <input
          placeholder="Password (kosongkan jika tidak diubah)"
          type="password"
          onChange={(e) => setForm({...form, password: e.target.value})}
          className="w-full p-2 text-white border rounded bg-white/10 border-white/20"
        />
        <select
          value={form.role}
          onChange={(e) => setForm({...form, role: e.target.value})}
          className="w-full p-2 rounded bg-[#222] text-white border border-white/20"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full py-2 mt-1 font-semibold bg-blue-600 rounded">
          Save User
        </button>
      </div>
    </form>
  );
}

export default UserForm;