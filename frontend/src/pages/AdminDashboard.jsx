import { useEffect, useState } from "react";
import api from "../api/axios";
import Modal from "../components/ui/admin/Modal";
import UserForm from "../components/ui/admin/UserForm";
import MovieForm from "../components/ui/admin/MovieForm";

function Admin() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get(`/users?page=${page}`);
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

  const handleDeleteUser = async (id) => {
    if (!confirm("Hapus user ini?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleUserSubmit = async (data) => {
    if (editUser) await api.put(`/users/${editUser.id}`, data);
    else await api.post(`/users`, data);
    setShowUserModal(false);
    fetchUsers();
  };

  const handleDeleteMovie = async (id) => {
    if (!confirm("Hapus movie ini?")) return;
    await api.delete(`/movies/${id}`);
    fetchMovies();
  };

  const handleMovieSubmit = async (data) => {
    if (editMovie) await api.put(`/movies/${editMovie.id}`, data);
    else await api.post(`/movies`, data);
    setShowMovieModal(false);
    fetchMovies();
  };

  const parseCategories = (raw) => {
    try { return JSON.parse(raw || "[]"); } catch { return []; }
  };

  return (
    <div className="space-y-8 text-white">

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold">👑 Admin Dashboard</h1>
          <p className="text-sm text-white/40">Kelola users dan movies</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 border rounded-xl bg-white/5 border-white/10">
          <p className="text-sm text-white/40">Total Users</p>
          <p className="mt-1 text-3xl font-bold">{total}</p>
        </div>
        <div className="p-5 border rounded-xl bg-white/5 border-white/10">
          <p className="text-sm text-white/40">Total Movies</p>
          <p className="mt-1 text-3xl font-bold">{movies.length}</p>
        </div>
      </div>

      {/* ── USERS ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            Users
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">{total}</span>
          </h2>
          <button
            onClick={() => { setEditUser(null); setShowUserModal(true); }}
            className="px-4 py-2 text-sm transition-all bg-blue-600 rounded-lg hover:bg-blue-500 active:scale-95"
          >
            + Add User
          </button>
        </div>

        <div className="overflow-hidden border rounded-xl border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-white/5 text-white/50">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30">Loading...</td></tr>
              ) : users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className="transition-colors border-t cursor-pointer border-white/5 hover:bg-white/5 group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="transition-colors group-hover:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${u.role === "admin" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => { setEditUser(u); setShowUserModal(true); }}
                        className="px-3 py-1 text-xs text-yellow-400 transition-all border rounded-lg bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-3 py-1 text-xs text-red-400 transition-all border rounded-lg bg-red-500/20 border-red-500/30 hover:bg-red-500/30 active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

      {/* ── MOVIES ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            Movies
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">{movies.length}</span>
          </h2>
          <button
            onClick={() => { setEditMovie(null); setShowMovieModal(true); }}
            className="px-4 py-2 text-sm transition-all bg-green-600 rounded-lg hover:bg-green-500 active:scale-95"
          >
            + Add Movie
          </button>
        </div>

        <div className="overflow-hidden border rounded-xl border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-white/5 text-white/50">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingMovies ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30">Loading...</td></tr>
              ) : movies.map((m) => (
                <tr key={m.id} className="transition-colors border-t border-white/5 hover:bg-white/5 group">
                  <td className="px-4 py-3 font-medium transition-colors group-hover:text-white">{m.title}</td>
                  <td className="px-4 py-3 text-yellow-400">★ {m.rating}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {parseCategories(m.categories).map((cat) => (
                        <span key={cat} className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/60">{cat}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => { setEditMovie(m); setShowMovieModal(true); }}
                        className="px-3 py-1 text-xs text-yellow-400 transition-all border rounded-lg bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95"
                      >Edit</button>
                      <button
                        onClick={() => handleDeleteMovie(m.id)}
                        className="px-3 py-1 text-xs text-red-400 transition-all border rounded-lg bg-red-500/20 border-red-500/30 hover:bg-red-500/30 active:scale-95"
                      >Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── USER DETAIL MODAL ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-sm bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-20 bg-gradient-to-br from-blue-600 to-purple-600">
              <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold border-4 border-[#1a1a1a]">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <button onClick={() => setSelectedUser(null)} className="absolute text-xl transition-colors top-3 right-3 text-white/60 hover:text-white">✕</button>
            </div>
            <div className="px-6 pt-10 pb-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold">{selectedUser.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${selectedUser.role === "admin" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`}>
                  {selectedUser.role}
                </span>
              </div>
              <p className="mb-4 text-sm text-white/50">{selectedUser.email}</p>
              <div className="pt-4 space-y-3 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">ID</span>
                  <span>#{selectedUser.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Status</span>
                  <span className={selectedUser.is_active === false ? "text-red-400" : "text-green-400"}>
                    {selectedUser.is_active === false ? "Suspended" : "Active"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => { setEditUser(selectedUser); setShowUserModal(true); setSelectedUser(null); }}
                  className="flex-1 py-2 text-sm text-yellow-400 transition-all border rounded-lg bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30 active:scale-95"
                >Edit User</button>
                <button
                  onClick={() => { handleDeleteUser(selectedUser.id); setSelectedUser(null); }}
                  className="flex-1 py-2 text-sm text-red-400 transition-all border rounded-lg bg-red-500/20 border-red-500/30 hover:bg-red-500/30 active:scale-95"
                >Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
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