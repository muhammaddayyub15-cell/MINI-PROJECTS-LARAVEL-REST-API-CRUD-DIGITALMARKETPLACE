import { useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

    // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

    // Handle Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await register(form);

    if (res.success) {
      navigate("/login"); // redirect ke login
    } else {
      setError(res.message || "Register gagal");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 border bg-white/5 backdrop-blur-xl border-white/10 rounded-xl"
      >
        <h2 className="mb-4 text-xl font-bold">Register</h2>

        {/* ERROR */}
        {error && (
          <p className="mb-3 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* NAME */}
        <input
          placeholder="Name"
          className="w-full p-2 mb-3 rounded bg-white/10"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
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
          className="w-full py-2 bg-yellow-500 rounded-md bg-linear-to-br hover:bg-blue-600"
        >
          Register
        </button>

        {/* LINK LOGIN */}
        <p className="mt-3 text-sm text-center">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-yellow-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;