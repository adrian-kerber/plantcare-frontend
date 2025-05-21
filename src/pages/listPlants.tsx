import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";

interface Planta {
  id: number;
  nome: string;
  tipo: string;
  local: string;
  dataAquisicao: string;
  observacoes?: string;
  fotoUrl?: string;
}

export function ListaPlantas() {
  const [plantas, setPlantas] = useState<Planta[]>([]);

  useEffect(() => {
    api.get("/plantas")
      .then(response => setPlantas(response.data))
      .catch(err => console.error("Erro ao buscar plantas:", err));
  }, []);

  return (
    <div className="container">
      <h1>🌿 Minhas Plantas</h1>
      {plantas.map(planta => (
        <div key={planta.id} style={{ margin: "10px 0", borderBottom: "1px solid #ccc" }}>
          <h2><Link to={`/planta/${planta.id}`}>{planta.nome}</Link></h2>
          <p><strong>Tipo:</strong> {planta.tipo}</p>
          <p><strong>Local:</strong> {planta.local}</p>
          <p><strong>Data de aquisição:</strong> {new Date(planta.dataAquisicao).toLocaleDateString()}</p>
          {planta.observacoes && <p><strong>Observações:</strong> {planta.observacoes}</p>}
          {planta.fotoUrl && <img src={planta.fotoUrl} alt={planta.nome} style={{ maxWidth: "200px" }} />}
        </div>
      ))}
    </div>
  );
}
