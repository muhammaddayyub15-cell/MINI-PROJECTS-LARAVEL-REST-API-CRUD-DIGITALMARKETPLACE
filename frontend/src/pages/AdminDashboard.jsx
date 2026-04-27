import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Modal from "../components/ui/admin/Modal";
import UserForm from "../components/ui/admin/UserForm";
import MovieForm from "../components/ui/admin/MovieForm";

// ── Status badge (toggle aktif/suspend)
function StatusBadge({ user, togglingId, onClick }) {
  const active  = user.is_active === 1 || user.is_active === true;
  const loading = togglingId === user.id;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(user); }}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border
        transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${active
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
          : "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25"
        }`}
    >
      {loading
        ? <span className="w-1.5 h-1.5 rounded-full border border-current border-t-transparent animate-spin" />
        : <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"}`} />
      }
      {active ? "Active" : "Suspended"}
    </button>
  );
}

// ── Scroll hint indicator
function ScrollHint() {
  return (
    <div className="flex items-center gap-1.5 mb-1.5 sm:hidden text-white/25 text-xs">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span>Scroll to view more</span>
    </div>
  );
}

// ── Main Admin Component
function Admin() {
  const navigate = useNavigate();

  const [users, setUsers]                   = useState([]);
  const [loadingUsers, setLoadingUsers]     = useState(true);
  const [page, setPage]                     = useState(1);
  const [lastPage, setLastPage]             = useState(1);
  const [total, setTotal]                   = useState(0);
  const [showUserModal, setShowUserModal]   = useState(false);
  const [editUser, setEditUser]             = useState(null);
  const [selectedUser, setSelectedUser]     = useState(null);
  const [togglingId, setTogglingId]         = useState(null);

  const [movies, setMovies]                 = useState([]);
  const [loadingMovies, setLoadingMovies]   = useState(true);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editMovie, setEditMovie]           = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res    = await api.get(`/users?page=${page}`);
      const result = res.data.data;
      setUsers(result.data);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch (err) { console.log(err); }
    finally { setLoadingUsers(false); }
  };

  const fetchMovies = async () => {
    setLoadingMovies(true);
    try {
      const res = await api.get(`/movies`);
      setMovies(res.data.data.data);
    } catch (err) { console.log(err); }
    finally { setLoadingMovies(false); }
  };

  useEffect(() => { fetchUsers(); fetchMovies(); }, [page]);

  // ── Handlers 
  const handleDeleteUser = async (id) => {
    if (!confirm("Hapus user ini?")) return;
    await api.delete(`/users/${id}`);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleUserSubmit = async (data) => {
    try {
      if (editUser) await api.put(`/users/${editUser.id}`, data);
      else          await api.post(`/users`, data);
      setShowUserModal(false);
      fetchUsers();
    } catch (err) {
      console.log("Error detail:", err.response?.data);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!confirm("Hapus movie ini?")) return;
    await api.delete(`/movies/${id}`);
    fetchMovies();
  };

  const handleMovieSubmit = async (data) => {
    if (editMovie) await api.put(`/movies/${editMovie.id}`, data);
    else           await api.post(`/movies`, data);
    setShowMovieModal(false);
    fetchMovies();
  };

  const handleToggleStatus = async (user) => {
    setTogglingId(user.id);
    const newVal = user.is_active === 1 || user.is_active === true ? 0 : 1;
    try {
      await api.put(`/users/${user.id}`, { is_active: newVal });
      const updated = { ...user, is_active: newVal };
      setUsers((prev) => prev.map((u) => u.id === user.id ? updated : u));
      if (selectedUser?.id === user.id) setSelectedUser(updated);
    } catch (err) {
      console.error("Toggle status error:", err);
    } finally {
      setTogglingId(null);
    }
  };

  const parseCategories = (raw) => {
    try { return JSON.parse(raw || "[]"); } catch { return []; }
  };

  // ── Render 
  return (
    <div className="space-y-6 text-white sm:space-y-8">

      {/* HEADER */}
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-xl font-bold sm:text-2xl">Dashboard Admin</h1>
        <p className="text-sm text-white/40">Manage Users dan Movies</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-4 border sm:p-5 rounded-xl bg-white/5 border-white/10">
          <p className="text-xs sm:text-sm text-white/40">Total Users</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">{total}</p>
        </div>
        <div className="p-4 border sm:p-5 rounded-xl bg-white/5 border-white/10">
          <p className="text-xs sm:text-sm text-white/40">Total Movies</p>
          <p className="mt-1 text-2xl font-bold sm:text-3xl">{movies.length}</p>
        </div>
      </div>

      {/* ── USERS TABLE ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold sm:text-lg">
            Users
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">{total}</span>
          </h2>
          <button
            onClick={() => { setEditUser(null); setShowUserModal(true); }}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95"
          >+ Add User</button>
        </div>

        {/* Scroll hint - only on mobile */}
        <ScrollHint />

        {/* Scrollable wrapper */}
        <div className="overflow-hidden border rounded-xl border-white/10">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left bg-white/5 text-white/50">
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-white/30">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 rounded-full border-white/20 border-t-white/60 animate-spin" />
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="transition-colors border-t cursor-pointer border-white/5 hover:bg-white/5 group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 overflow-hidden text-xs font-bold rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shrink-0">
                          {u.avatar
                            ? <img src={u.avatar} alt={u.name} className="object-cover w-full h-full" />
                            : u.name?.charAt(0).toUpperCase()
                          }
                        </div>
                        <span className="transition-colors whitespace-nowrap group-hover:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 whitespace-nowrap">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        u.role === "admin"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge user={u} togglingId={togglingId} onClick={handleToggleStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => { setEditUser(u); setShowUserModal(true); }}
                          className="px-3 py-1 text-xs text-yellow-400 transition-all border rounded-lg bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95 whitespace-nowrap"
                        >Edit</button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1 text-xs text-red-400 transition-all border rounded-lg bg-red-500/20 border-red-500/30 hover:bg-red-500/30 active:scale-95 whitespace-nowrap"
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/5">
            <button
              onClick={() => setPage(p => p - 1)} disabled={page === 1}
              className="px-3 py-1 text-xs transition-all rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >← Prev</button>
            <span className="text-xs text-white/40">Page {page} / {lastPage}</span>
            <button
              onClick={() => setPage(p => p + 1)} disabled={page === lastPage}
              className="px-3 py-1 text-xs transition-all rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >Next →</button>
          </div>
        </div>
      </div>

      {/* ── MOVIES TABLE ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold sm:text-lg">
            Movies
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">{movies.length}</span>
          </h2>
          <button
            onClick={() => { setEditMovie(null); setShowMovieModal(true); }}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all bg-green-600 rounded-lg hover:bg-green-500 active:scale-95"
          >+ Add Movie</button>
        </div>

        {/* Scroll hint - only on mobile */}
        <ScrollHint />

        <div className="overflow-hidden border rounded-xl border-white/10">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="text-left bg-white/5 text-white/50">
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Title</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Rating</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingMovies ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-white/30">
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 rounded-full border-white/20 border-t-white/60 animate-spin" />
                        Loading...
                      </div>
                    </td>
                  </tr>
                ) : movies.map((m) => (
                  <tr key={m.id} className="transition-colors border-t border-white/5 hover:bg-white/5 group">
                    <td className="px-4 py-3 font-medium transition-colors whitespace-nowrap group-hover:text-white">{m.title}</td>
                    <td className="px-4 py-3 text-yellow-400 whitespace-nowrap">★ {m.rating}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 min-w-[120px]">
                        {parseCategories(m.categories).map((cat) => (
                          <span key={cat} className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/60 whitespace-nowrap">{cat}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditMovie(m); setShowMovieModal(true); }}
                          className="px-3 py-1 text-xs text-yellow-400 transition-all border rounded-lg bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95 whitespace-nowrap"
                        >Edit</button>
                        <button onClick={() => handleDeleteMovie(m.id)}
                          className="px-3 py-1 text-xs text-red-400 transition-all border rounded-lg bg-red-500/20 border-red-500/30 hover:bg-red-500/30 active:scale-95 whitespace-nowrap"
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── USER QUICK MODAL ── */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full sm:max-w-sm bg-[#1a1f2e] sm:rounded-2xl rounded-t-2xl border border-white/10 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle on mobile */}
            <div className="flex justify-center pt-2 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="relative h-24 bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-500">
              <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold border-4 border-[#1a1f2e] overflow-hidden">
                {selectedUser.avatar
                  ? <img src={selectedUser.avatar} alt={selectedUser.name} className="object-cover w-full h-full" />
                  : selectedUser.name?.charAt(0).toUpperCase()
                }
              </div>
              <button onClick={() => setSelectedUser(null)}
                className="absolute flex items-center justify-center transition-all rounded-full top-3 right-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 w-7 h-7"
              >✕</button>
            </div>

            <div className="px-6 pt-10 pb-6 pb-safe">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                  selectedUser.role === "Admin"
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}>{selectedUser.role}</span>
              </div>
              <p className="mb-5 text-sm break-all text-white/50">{selectedUser.email}</p>

              <div className="px-4 py-3 mb-5 space-y-3 bg-white/5 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">ID</span>
                  <span className="font-mono text-white/80">#{selectedUser.id}</span>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Status</span>
                  <StatusBadge user={selectedUser} togglingId={togglingId} onClick={handleToggleStatus} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => { setEditUser(selectedUser); setShowUserModal(true); setSelectedUser(null); }}
                  className="py-2.5 text-xs text-yellow-400 transition-all border rounded-lg bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95"
                >Edit User</button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="py-2.5 text-xs text-red-400 transition-all border rounded-lg bg-red-500/20 border-red-500/30 hover:bg-red-500/30 active:scale-95"
                >Delete User</button>
              </div>

              <button
                onClick={() => { setSelectedUser(null); navigate(`/admin/users/${selectedUser.id}`); }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-indigo-300
                           bg-indigo-600/20 border border-indigo-600/30 hover:bg-indigo-600/30
                           transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODALS ── */}
      <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title={editUser ? "Edit User" : "Add User"}>
        <UserForm initialData={editUser} onSubmit={handleUserSubmit} />
      </Modal>
      <Modal isOpen={showMovieModal} onClose={() => setShowMovieModal(false)} title={editMovie ? "Edit Movie" : "Add Movie"}>
        <MovieForm initialData={editMovie} onSubmit={handleMovieSubmit} />
      </Modal>
    </div>
  );
}

export default Admin;