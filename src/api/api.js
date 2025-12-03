import axios from "axios";

const ITENS_HABILIDADES  = "https://emilyspecht.github.io/the-cresim/itens-habilidades.json";
const ITENS_EMPREGOS     = "https://emilyspecht.github.io/the-cresim/empregos.json";
const ITENS_INTERACOES   = "https://emilyspecht.github.io/the-cresim/interacoes.json";

const request = async (endpoint) => {
  try {
    const resposta = await axios.get(endpoint);
    return resposta.data;
  } catch (erro) {
    console.error("Erro na API:", erro);
    return [];
  }
};

const getItensHabilidades = () => request(ITENS_HABILIDADES);
const getItensEmpregos = () => request(ITENS_EMPREGOS);
const getItensInteracoes = () => request(ITENS_INTERACOES);

export const api = {
  getItensHabilidades,
  getItensEmpregos,
  getItensInteracoes
};
