import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ListaPlantas } from "./pages/listPlants";
import { NovaPlanta } from "./pages/newPlant";
import { DetalhePlanta } from "./pages/detailPlant";
import { Inicial } from "./pages/home";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  return (
    <>
      <nav>
        <div className="links">
          <Link to="/">🏠 Início</Link>
          <Link to="/plantas">📋 Ver Plantas</Link>
          <Link to="/nova">➕ Nova Planta</Link>
        </div>
        <div className="darkmodebtn">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞 Claro" : "🌙 Escuro"}
        </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Inicial />} />
        <Route path="/plantas" element={<ListaPlantas />} />
        <Route path="/nova" element={<NovaPlanta />} />
        <Route path="/planta/:id" element={<DetalhePlanta />} />
      </Routes>
    </>
  );
}

export default App;
