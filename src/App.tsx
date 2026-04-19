import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");

  return (
    <MainLayout onSearch={setSearch}>
      <Home search={search} />
    </MainLayout>
  );
}

export default App;