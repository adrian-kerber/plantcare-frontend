import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

interface Cuidado {
  id: number;
  tipo: string;
  dataProgramada: string;
  realizado: boolean;
  dataRealizacao?: string;
}

interface Planta {
  id: number;
  nome: string;
  tipo: string;
  local: string;
  dataAquisicao: string;
  observacoes?: string;
  fotoUrl?: string;
  cuidados: Cuidado[];
}

export function DetalhePlanta() {
  const { id } = useParams();
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [novoCuidado, setNovoCuidado] = useState({ tipo: "", data: "" });

  useEffect(() => {
    api.get(`/plantas/${id}`).then(res => setPlanta(res.data));
  }, [id]);

  const adicionarCuidado = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/cuidados", {
        tipo: novoCuidado.tipo,
        dataProgramada: novoCuidado.data,
        plantaId: Number(id),
      });
      alert("Cuidado agendado com sucesso!");
      const updated = await api.get(`/plantas/${id}`);
      setPlanta(updated.data);
      setNovoCuidado({ tipo: "", data: "" });
    } catch (err) {
      console.error(err);
      alert("Erro ao agendar cuidado.");
    }
  };

  if (!planta) return <p>Carregando...</p>;

  return (
    <div className="container">
      <h1>{planta.nome}</h1>
      {planta.fotoUrl && <img src={planta.fotoUrl} alt={planta.nome} style={{ maxWidth: "250px" }} />}
      <p><strong>Tipo:</strong> {planta.tipo}</p>
      <p><strong>Local:</strong> {planta.local}</p>
      <p><strong>Data de aquisição:</strong> {new Date(planta.dataAquisicao).toLocaleDateString()}</p>
      <p><strong>Observações:</strong> {planta.observacoes || "-"}</p>
      <div className="container-int">
      <h2>📝 Agendar Cuidado</h2>
      <form onSubmit={adicionarCuidado}>
        <label>Tipo:</label>
        <select value={novoCuidado.tipo} onChange={e => setNovoCuidado({ ...novoCuidado, tipo: e.target.value })} required>
          <option value="">Selecione</option>
          <option value="rega">Rega</option>
          <option value="adubação">Adubação</option>
          <option value="poda">Poda</option>
        </select>
        

        <label>Data:</label>
        <input type="date" value={novoCuidado.data} onChange={e => setNovoCuidado({ ...novoCuidado, data: e.target.value })} required />

        <button type="submit">Agendar</button>
      </form>
      </div>
      <div className="container-int">
      <h2>📋 Histórico de Cuidados</h2>
      <ul>
  {planta.cuidados.map(c => (
    <li key={c.id}>
      <strong>{c.tipo}</strong> – programado para {new Date(c.dataProgramada).toLocaleDateString()} –
      {c.realizado
        ? ` Realizado em ${new Date(c.dataRealizacao!).toLocaleDateString()}`
        : <>
            <span> Pendente </span>
            <button onClick={async () => {
              try {
                await api.put(`/cuidados/${c.id}/realizar`);
                const updated = await api.get(`/plantas/${id}`);
                setPlanta(updated.data);
              } catch {
                alert("Erro ao marcar como realizado.");
              }
            }}>
              ✅ Marcar como feito
            </button>
          </>
      }
    </li>
  ))}
</ul>
</div>
    </div>
  );
}
