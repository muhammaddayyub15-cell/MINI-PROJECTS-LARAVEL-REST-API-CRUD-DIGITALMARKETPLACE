import Navbar from "../ui/bar-side/Navbar";
import Sidebar from "../ui/bar-side/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-linear-to-br from-[#0369f8] via-[#0d0c0c] to-[#f4c50d]">

      <div className="hidden w-64 lg:block shrink-0">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 z-50 w-64 h-full lg:hidden">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 lg:p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;