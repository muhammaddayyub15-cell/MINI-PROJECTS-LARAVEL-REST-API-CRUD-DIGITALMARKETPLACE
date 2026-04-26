import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./route/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Popular from "./pages/Popular";
import Genre from "./pages/Genre";
import Watchlist from "./pages/Watchlist";
import ComingSoon from "./pages/ComingSoon";
import MovieDetail from "./pages/MovieDetail";
import AdminDashboard from "./pages/AdminDashboard";
import UserDetail from "./pages/UserDetail";
import UserForm from "./components/ui/admin/UserForm";


function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<MainLayout />}>

        {/* semua user yang sudah login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Route>

        {/* admin only */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users/:id" element={<UserDetail />} />
          <Route path="/admin/users/edit/:id" element={<UserForm />} />
        </Route>

      </Route>

    </Routes>
  );
}

export default App;