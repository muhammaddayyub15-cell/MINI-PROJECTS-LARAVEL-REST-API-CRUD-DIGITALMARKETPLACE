import { useState } from "react";
import SidebarItem from "./SidebarItem";
import UserSection from "./UserSection";
import { useAuth } from "../../../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";

const menu = [
  { label: "Movies",path: "/" },
  { label: "Popular",path: "/popular" },
  { label: "User Choices",path: "/coming-soon" },
  { label: "Upcoming",path: "/coming-soon" },
  { label: "Genres", path: "/genre" },
  { label: "Watchlist", path: "/watchlist" },
  { label: "Community Talks", ath: "/coming-soon" },
  { label: "Profile", path: "/coming-soon" },
  { label: "Admin Dashboard", path: "/admin", adminOnly: true },
];

function Sidebar({ onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredMenu = menu.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <div className="w-64 bg-[#111] text-white h-full flex flex-col shrink-0">

      {/* Header + tombol close (hanya mobile) */}
      <div className="flex items-center justify-between p-5">
        <h2 className="m-0 text-lg font-bold">🎬INDOFLIX</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center transition-all rounded-full lg:hidden w-7 h-7 text-white/60 hover:text-white bg-white/10 hover:bg-white/20"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredMenu.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            active={activeIndex === index}
            onClick={() => {
              setActiveIndex(index);
              navigate(item.path);
              onClose?.(); // tutup drawer saat navigasi di mobile
            }}
          />
        ))}
      </div>

      <UserSection
        isLoggedIn={isLoggedIn}
        name={user?.name || "Guest"}
        email={user?.email || "-"}
        avatarUrl="https://i.pravatar.cc/100"
        onLogout={handleLogout}
        onLogin={() => navigate("/login")}
      />
    </div>
  );
}

export default Sidebar;