import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // FORM STATE
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // HANDLE LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(form);

    if (res.success) {
      navigate("/"); // redirect ke home
    } else {
      setError(res.message || "Login gagal");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border bg-white/5 backdrop-blur-xl border-white/10 rounded-xl"
      >
        <h2 className="mb-4 text-xl font-bold">Login</h2>

        {/* ERROR */}
        {error && (
          <p className="mb-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-white/10"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-white/10"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-2 bg-yellow-500 rounded-md bg-gradient-to-br hover:bg-blue-600"
        >
          Login
        </button>

        {/* LINK REGISTER */}
        <p className="mt-3 text-sm text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="text-yellow-400">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;