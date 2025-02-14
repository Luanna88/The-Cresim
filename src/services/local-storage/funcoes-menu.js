import { useLocalStorage } from "./use-local-storage.js";

const localStorage = useLocalStorage();
let idCresimSelecionado;
let cresims = [];
let newId = 0;

const updateStorage = () => {
  idCresimSelecionado = localStorage.getString("cresimSelecionado");
  cresims = localStorage.getObject("cresims") || [];
  newId = localStorage.getObject("idCresim") || 0;
};

const salvarNovoCresim = (cresim) => {
  localStorage.setObject("cresims", [
    ...cresims,
    { ...cresim, id: getNewCresimId() },
  ]);
  console.log("\n ✅ Cresim criado com sucesso!");
  updateStorage();
};

const getNewCresimId = () => {
  newId = newId === null ? 1 : newId + 1;
  localStorage.setObject("idCresim", newId);
  return newId;
};

const updateLocalStorage = (cresim) => {
  if (!cresims) {
    return;
  }
  const updatedCresims = cresims.map((c) =>
    c.id === cresim.id ? { ...c, ...cresim } : c
  );
  localStorage.setObject("cresims", updatedCresims);
  updateStorage();
};

const buscarTodosAtivos = () => {
  if (!cresims) {
    return [];
  }
  return cresims.filter((cresim) => cresim && cresim.tempo > 0);
};

const findCresim = (idOrName) => {
  if (!cresims) {
    console.log("❌ Nenhum Cresim encontrado.");
    return null;
  }
  return cresims.find(
    (cresim) => cresim.id === parseInt(idOrName, 10) || cresim.nome === idOrName
  );
};

const selecionarCresim = async (cresimId) => {
  const cresim = findCresim(cresimId);
  if (!cresim) {
    console.log("❌ Cresim não encontrado.");
    return null;
  }
  localStorage.setString("cresimSelecionado", cresimId);
  return cresim;
};

export {
  updateStorage,
  salvarNovoCresim,
  updateLocalStorage,
  buscarTodosAtivos,
  findCresim,
  selecionarCresim,
};
