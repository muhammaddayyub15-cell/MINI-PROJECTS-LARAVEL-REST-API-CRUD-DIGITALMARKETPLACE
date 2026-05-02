import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form);
    setLoading(false);
    if (res.success) {
      // Fix Navigate Ke Home Setelah Login
      navigate("/home");
    } else {
      setError(res.message || "Login gagal");
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
          <h2 className="text-xl font-bold">Welcome Back</h2>
          <p className="mt-1 text-sm text-white/40">Login to your Account</p>
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

            {/* Email */}
            <div>
              <label className="text-xs text-white/40 font-semibold uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="email@kamu.com"
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
                placeholder="Password kamu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 text-sm text-white transition-all border rounded-xl bg-white/8 border-white/10 placeholder-white/25 focus:outline-none focus:border-yellow-500/50 focus:bg-white/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 font-bold text-white transition-all border rounded-xl bg-white/10 border-white/20 hover:bg-white/20 active:scale-95 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Masuk..." : "Login"}
            </button>

          </form>

          {/* Link register */}
          <p className="mt-4 text-sm text-center text-white/40">
            Not have Account?{" "}
            <Link to="/register" className="font-semibold text-yellow-400 transition-colors hover:text-yellow-300">
              Free Registration
            </Link>
          </p>
        </div>

        {/* Demo account hint */}
        <div className="p-3 mt-4 text-center border rounded-xl border-white/5 bg-white/3">
          <p className="text-xs text-white/30">Demo: <span className="text-white/50">admin@mail.com</span> / <span className="text-white/50">password</span></p>
        </div>

      </div>
    </div>
  );
}

export default Login;