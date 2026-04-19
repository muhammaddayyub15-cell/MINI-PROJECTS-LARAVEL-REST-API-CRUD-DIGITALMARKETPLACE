import { useState } from "react";
import SidebarItem from "./SidebarItem";
import UserSection from "./UserSection";

const menu = [
  { label: "Movies" },
  { label: "Popular" },
  { label: "Top Rated" },
  { label: "Upcoming" },
  { label: "Genres" },
  { label: "My List" },
];

function Sidebar() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-64 bg-[#111] text-white h-full flex flex-col -shrink-0">
      
      {/* LOGO */}
      <h2 className="p-5 m-0">🎬 Da App</h2>

      {/* MENU */}
      <div className="flex-1">
        {menu.map((item, index) => (
          <SidebarItem
            key={index}
            item={item}
            active={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>

      {/* USER */}
      <UserSection
        isLoggedIn={true}
        name="Muh Ayyub"
        email="ayub@mail.com"
        avatarUrl="https://i.pravatar.cc/100"
        onLogout={() => alert("Logout")}
      />
    </div>
  );
}

export default Sidebar;