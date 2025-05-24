import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [planta, setPlanta] = useState<Planta | null>(null);
  const [novoCuidado, setNovoCuidado] = useState({ tipo: "", data: "" });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formEdicao, setFormEdicao] = useState({
    nome: "",
    tipo: "",
    local: "",
    dataAquisicao: "",
    observacoes: "",
    fotoUrl: ""
  });

  useEffect(() => {
    api.get(`/plantas/${id}`).then(res => {
      setPlanta(res.data);
      setFormEdicao({
        nome: res.data.nome,
        tipo: res.data.tipo,
        local: res.data.local,
        dataAquisicao: res.data.dataAquisicao.slice(0, 10),
        observacoes: res.data.observacoes || "",
        fotoUrl: res.data.fotoUrl || ""
      });
    });
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

  const excluirPlanta = async () => {
    if (confirm("Tem certeza que deseja excluir esta planta?")) {
      await api.delete(`/plantas/${id}`);
      alert("Planta excluída com sucesso.");
      navigate("/plantas");
    }
  };

  const salvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/plantas/${id}`, formEdicao);
      alert("Planta atualizada!");
      const updated = await api.get(`/plantas/${id}`);
      setPlanta(updated.data);
      setModoEdicao(false);
    } catch {
      alert("Erro ao atualizar planta.");
    }
  };

  if (!planta) return <p>Carregando...</p>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
        <button onClick={() => setModoEdicao(true)}>✏️ Editar</button>
        <button onClick={excluirPlanta} style={{ backgroundColor: "#dc2626" }}>🗑️ Excluir</button>
      </div>

      {modoEdicao ? (
        <form onSubmit={salvarEdicao}>
          <label>Nome:</label>
          <input value={formEdicao.nome} onChange={e => setFormEdicao({ ...formEdicao, nome: e.target.value })} required />

          <label>Tipo:</label>
          <input value={formEdicao.tipo} onChange={e => setFormEdicao({ ...formEdicao, tipo: e.target.value })} required />

          <label>Local:</label>
          <input value={formEdicao.local} onChange={e => setFormEdicao({ ...formEdicao, local: e.target.value })} required />

          <label>Data de Aquisição:</label>
          <input type="date" value={formEdicao.dataAquisicao} onChange={e => setFormEdicao({ ...formEdicao, dataAquisicao: e.target.value })} required />

          <label>Observações:</label>
          <textarea value={formEdicao.observacoes} onChange={e => setFormEdicao({ ...formEdicao, observacoes: e.target.value })} />

          <label>URL da Foto:</label>
          <input value={formEdicao.fotoUrl} onChange={e => setFormEdicao({ ...formEdicao, fotoUrl: e.target.value })} />

          <button type="submit">💾 Salvar alterações</button>
          <button type="button" onClick={() => setModoEdicao(false)}>❌ Cancelar</button>
        </form>
      ) : (
        <>
          <h1>{planta.nome}</h1>
          {planta.fotoUrl && <img src={planta.fotoUrl} alt={planta.nome} style={{ maxWidth: "250px" }} />}
          <p><strong>Tipo:</strong> {planta.tipo}</p>
          <p><strong>Local:</strong> {planta.local}</p>
          <p><strong>Data de aquisição:</strong> {new Date(planta.dataAquisicao).toLocaleDateString()}</p>
          <p><strong>Observações:</strong> {planta.observacoes || "-"}</p>
        </>
      )}

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
              {c.realizado ? (
                ` Realizado em ${new Date(c.dataRealizacao!).toLocaleDateString()}`
              ) : (
                <>
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
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
