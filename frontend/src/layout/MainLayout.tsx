import Navbar from "../components/bar-side/Navbar";
import Sidebar from "../components/bar-side/Sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
  onSearch?: (value: string) => void;
};

function MainLayout({ children, onSearch }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full 
      bg-linear-to-br from-[#1a0000] via-[#3b0000] to-[#7a0000]">

      {/* SIDEBAR */}
      <div className="w-64 shrink-0">
\\        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* NAVBAR */}
        <div className="shrink-0">
          <Navbar onSearch={onSearch} /> {/* 🔥 FIX DI SINI */}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-5">
          {children}
        </div>

      </div>
    </div>
  );
}

export default MainLayout;