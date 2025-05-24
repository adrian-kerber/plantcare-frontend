import { useState } from "react";
import { api } from "../api/api";



export function NovaPlanta() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [dataAquisicao, setDataAquisicao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);


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

        <label>Foto:</label>
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFotoUrl(res.data.imageUrl);
    } catch {
      alert("Erro ao fazer upload da imagem.");
    }
  }}
/>


        {fotoUrl && (
  <div style={{ marginTop: "12px" }}>
    <img src={fotoUrl} alt="Prévia" style={{ maxWidth: "200px", borderRadius: "10px" }} />
  </div>
)}


        <button type="submit">Cadastrar Planta</button>
      </form>
    </div>
  );
}
