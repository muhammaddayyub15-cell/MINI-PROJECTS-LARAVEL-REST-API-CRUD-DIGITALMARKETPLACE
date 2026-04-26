import { useState } from "react";
import Navbar from "../ui/bar-side/Navbar";
import Sidebar from "../ui/bar-side/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-linear-to-br from-[#0369f8] via-[#0d0c0c] to-[#f4c50d]">

      {/* SIDEBAR DESKTOP — selalu tampil di lg ke atas */}
      <div className="hidden w-64 lg:block shrink-0">
        <Sidebar />
      </div>

      {/* SIDEBAR MOBILE/TABLET — drawer dari kiri */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 z-50 w-64 h-full lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* NAVBAR — kirim toggle sidebar untuk mobile */}
        <Navbar onSearch={setSearch} onMenuClick={() => setSidebarOpen(true)} />

        {/* CONTENT */}
        <div className="p-4 lg:p-5">
          <Outlet context={{ search }} />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;