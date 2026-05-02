import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (res.success) {
      navigate("/login");
    } else {
      setError(res.message || "Register gagal");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0369f8] via-[#0d0c0c] to-[#f4c50d] text-white flex items-center justify-center px-4 relative overflow-hidden">

      {/* BG glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🎬</span>
            <span className="text-2xl font-black tracking-tight">
              INDO<span className="text-yellow-400">FLIX</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold">Create New Account</h2>
          <p className="mt-1 text-sm text-white/40">Free Registration</p>
        </div>

        {/* Card */}
        <div className="p-6 border rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl">

          {/* Error */}
          {error && (
            <div className="px-4 py-3 mb-4 text-sm text-red-400 border rounded-xl bg-red-500/10 border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name */}
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1.5">Name</label>
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white transition-all border rounded-xl bg-white/8 border-white/10 placeholder-white/25 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="yourmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white transition-all border rounded-xl bg-white/8 border-white/10 placeholder-white/25 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min. 8 Characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white transition-all border rounded-xl bg-white/8 border-white/10 placeholder-white/25 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10"
              />
            </div>

            {/* Submit */}
            <button
              type="Submit"
              disabled={loading}
              className="w-full py-3 mt-2 font-bold text-white transition-all border rounded-xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Regsitring..." : "Register Now"}
            </button>

          </form>

          {/* Link login */}
          <p className="mt-4 text-sm text-center text-white/40">
            Already Have Account?{" "}
            <Link to="/login" className="font-semibold text-yellow-400 transition-colors hover:text-yellow-300">
              Login Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;