import { useEffect, useState } from "react";
import { api } from "../api/api";
import { Link } from "react-router-dom";

interface Cuidado {
  id: number;
  tipo: string;
  dataProgramada: string;
  realizado: boolean;
  planta: {
    id: number;
    nome: string;
  };
}

export function Inicial() {
  const [cuidadosHoje, setCuidadosHoje] = useState<Cuidado[]>([]);

  useEffect(() => {
    api.get("/cuidados").then(res => {
      const hoje = new Date().toISOString().slice(0, 10); // formato YYYY-MM-DD
      const pendentesHoje = res.data.filter((c: Cuidado) => {
        return c.dataProgramada.startsWith(hoje) && !c.realizado;
      });
      setCuidadosHoje(pendentesHoje);
    });
  }, []);

  return (
    <div className="container">
      <h1>🌤️ Cuidados do Dia</h1>
      {cuidadosHoje.length === 0 ? (
        <p>Nenhum cuidado pendente para hoje! 🥳</p>
      ) : (
        <ul>
          {cuidadosHoje.map((c) => (
            <li key={c.id} style={{ marginBottom: "10px" }}>
              🌿 <strong>{c.planta.nome}</strong> precisa de <strong>{c.tipo}</strong> hoje.
              <br />
              <Link to={`/planta/${c.planta.id}`}>Ver planta</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
