import { useState } from "react";
import { api } from "../api/api";


export function NovaPlanta() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [dataAquisicao, setDataAquisicao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/plantas", {
        nome,
        tipo,
        local,
        dataAquisicao,
        observacoes,
        fotoUrl
      });
      alert("Planta cadastrada com sucesso!");
      // limpar formulário ou redirecionar
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar planta.");
    }
  };

  return (
    <div className="container">
      <h1>🌼 Cadastrar Nova Planta</h1>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>Tipo:</label>
        <input value={tipo} onChange={(e) => setTipo(e.target.value)} required />

        <label>Local:</label>
        <input value={local} onChange={(e) => setLocal(e.target.value)} required />

        <label>Data de Aquisição:</label>
        <input type="date" value={dataAquisicao} onChange={(e) => setDataAquisicao(e.target.value)} required />

        <label>Observações:</label>
        <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />

        <label>URL da Foto:</label>
        <input type="url" value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />

        {fotoUrl && (
          <div style={{ margin: "10px 0" }}>
            <img src={fotoUrl} alt="Prévia" style={{ maxWidth: "200px" }} />
          </div>
        )}

        <button type="submit">Cadastrar Planta</button>
      </form>
    </div>
  );
}
