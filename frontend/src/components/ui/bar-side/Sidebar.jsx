import { useState } from "react";
import SidebarItem from "./SidebarItem";
import UserSection from "./UserSection";
import { useAuth } from "../../../contexts/AuthContexts";
import { useNavigate } from "react-router-dom";

const menu = [
  { label: "Movies", path: "/" },
  { label: "Popular", path: "/popular" },
  { label: "Top Rated", path: "/coming-soon" },
  { label: "Upcoming", path: "/coming-soon" },
  { label: "Genres", path: "/genre" },
  { label: "Watchlist", path: "/watchlist" },
  { label: "Community Talks", path: "/coming-soon" },
  { label: "Profile", path: "/coming-soon" },
  { label: "Admin Dashboard", path: "/admin", adminOnly: true },
];

function Sidebar() {
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
      <h2 className="p-5 m-0">🎬INDOFLIX</h2>

      <div className="flex-1">
        {filteredMenu.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            active={activeIndex === index}
            onClick={() => {
              setActiveIndex(index);
              navigate(item.path); // ← navigasi ke route
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