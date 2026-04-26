import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

/* =========================
   COMPONENTS
========================= */

const MovieCard = ({ movie, onClick }) => {
  const poster =
    movie?.poster_url ||
    "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div onClick={onClick} className="cursor-pointer group">
      <div className="overflow-hidden border rounded-xl border-white/10 bg-white/5">
        <img
          src={poster}
          alt={movie?.title}
          className="object-cover w-full transition h-52 group-hover:scale-105"
        />
      </div>
      <p className="mt-2 text-xs text-white line-clamp-2">
        {movie?.title || "Unknown"}
      </p>
    </div>
  );
};

const ActionButton = ({ label, type = "primary", onClick }) => {
  const base =
    "w-full py-2.5 rounded-xl text-sm transition-all active:scale-95";

  const styles = {
    primary:
      "text-white bg-indigo-600/40 border border-indigo-500/40 hover:bg-indigo-600/60",
    warning:
      "text-yellow-300 bg-yellow-600/20 border border-yellow-600/30 hover:bg-yellow-600/30",
    danger:
      "text-red-400 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[type]}`}>
      {label}
    </button>
  );
};

/* =========================
   🔥 EDIT MODAL
========================= */

const EditUserModal = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
  });

  const handleSubmit = async () => {
    try {
      await api.put(`/users/${user.id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#1a1a2e]/95 border border-white/10 shadow-xl">

        <h2 className="mb-4 text-lg font-bold text-white">Edit User</h2>

        <input
          className="w-full p-2 mb-3 text-white bg-black border rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full p-2 mb-4 text-white bg-black border rounded"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-indigo-600 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

/* =========================
   MAIN PAGE
========================= */

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchUserDetail = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  // 🔥 REACTION EMOJI MAP
const reactionEmoji = {
  love: "❤️",
  neutral: "😐",
  hate: "👎",
};

// 🔥 GROUP REACTIONS
const groupedReactions = user?.reactions?.reduce((acc, item) => {
  const type = item.type || "other";

  if (!acc[type]) {
    acc[type] = {
      count: 0,
      movies: [],
    };
  }

  acc[type].count += 1;

  if (item.movie) {
    acc[type].movies.push(item.movie);
  }

  return acc;
}, {});
  /* ========================= */

  const handleDelete = async () => {
    if (!confirm("Delete user?")) return;

    try {
      await api.delete(`/users/${id}`);
      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuspend = async () => {
    try {
      await api.put(`/users/${id}`, {
        is_active: user.is_active ? 0 : 1,
      });

      fetchUserDetail();
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================= */

  if (loading) return <p className="text-white">Loading...</p>;
  if (!user) return <p className="text-red-400">User tidak ditemukan</p>;

  const isSuspended = !user.is_active;

  return (
    <div className="container px-4 py-6 mx-auto text-white md:px-6">

      <div className="grid gap-6 lg:grid-cols-4">

        {/* SIDEBAR PROFILE */}
        <div className="lg:col-span-1">
          <div className="p-4 text-center border rounded-xl bg-white/5 border-white/10">

            <img
              src={user.avatar || "https://i.pravatar.cc/300"}
              className="object-cover w-32 h-32 mx-auto border rounded-full border-white/10"
            />

            <h2 className="mt-4 text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-gray-400">{user.email}</p>

            {/* STATUS BADGE */}
            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full
                ${isSuspended
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}
            >
              {isSuspended ? "Suspended" : "Active"}
            </span>

            <div className="mt-6 space-y-2">
              <ActionButton label="Edit" onClick={() => setIsEditOpen(true)} />

              <ActionButton
                label={isSuspended ? "Suspended" : "Suspend"}
                type="warning"
                onClick={handleSuspend}
              />

              <ActionButton
                label="Delete"
                type="danger"
                onClick={handleDelete}
              />
            </div>

          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-6 lg:col-span-3">

          {/* INFO */}
          <div className="p-4 border rounded-xl bg-white/5 border-white/10">
            <h3 className="font-semibold">User Info</h3>
            <p className="text-sm text-gray-400">
              Last Login: {user.last_login || "-"}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Bio: {user.bio || "No bio available"}
            </p>
          </div>

          {/* WATCHLIST */}
          <div className="p-4 border rounded-xl bg-white/5 border-white/10">
            <h3 className="mb-3 font-semibold">
              Watchlist ({user.watchlist?.length || 0})
            </h3>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
              {user.watchlist?.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={item.movie}
                  onClick={() =>
                    navigate(`/movies/${item.movie?.id}`)
                  }
                />
              ))}
            </div>
          </div>
              {/* REACTIONS */}
<div className="p-4 border rounded-xl bg-white/5 border-white/10">
  <h3 className="mb-3 font-semibold">
    Reactions ({user.reactions?.length || 0})
  </h3>

  <div className="space-y-6">
    {Object.entries(groupedReactions || {}).map(([type, data]) => (
      <div key={type}>

        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold">
            {reactionEmoji[type] || "⭐"} {type}
          </p>
          <span className="text-xs text-gray-400">
            {data.count}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
          {data.movies.map((movie, i) => (
            <MovieCard
              key={i}
              movie={movie}
              onClick={() => navigate(`/movies/${movie?.id}`)}
            />
          ))}
        </div>

      </div>
    ))}
  </div>
</div>

        </div>
      </div>

      {/* MODAL */}
      {isEditOpen && (
        <EditUserModal
          user={user}
          onClose={() => setIsEditOpen(false)}
          onSuccess={fetchUserDetail}
        />
      )}
    </div>
  );
};

export default UserDetail;