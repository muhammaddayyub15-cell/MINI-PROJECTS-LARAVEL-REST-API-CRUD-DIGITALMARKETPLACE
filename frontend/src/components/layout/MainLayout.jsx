import { useState } from "react";
import Navbar from "../ui/bar-side/Navbar";
import Sidebar from "../ui/bar-side/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen w-full bg-linear-to-br from-[#0369f8] via-[#0d0c0c] to-[#f4c50d]">
      
      {/* SIDEBAR */}
      <div className="w-64 shrink-0">
        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">
        
        {/* NAVBAR */}
        <Navbar onSearch={setSearch} />

        {/* CONTENT */}
        <div className="p-5">
          {/* kirim search ke semua page */}
          <Outlet context={{ search }} />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;