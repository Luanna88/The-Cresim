import axios from "axios";
const BASE_URL = "https://emilyspecht.github.io/the-cresim/";

const request = async (endpoint) => {
  const response = await axios.get(`${BASE_URL}${endpoint}.json`);
  return response.data;
};

const getItens = () => request("itens-habilidades");
const getEmpregos = () => request("empregos");
const getInteracoes = () => request("interacoes");
const getCheats = () => request("cheats");

export const api = { getItens, getEmpregos, getInteracoes, getCheats };
