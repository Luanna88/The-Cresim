import { CONSTANTES } from "../utils/constants.js";
import {
  updateStorage,
  salvarNovoCresim,
  updateLocalStorage,
  buscarTodosAtivos,
  findCresim,
  selecionarCresim,
} from "./local-storage/funcoes-menu.js";

const criarCresim = (nome, aspiracao) => {
  return {
    nome: nome,
    aspiracao,
    habilidades: {
      gastronomia: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      pintura: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      jogos: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      jardinagem: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      musica: CONSTANTES.VALORES_INICIAIS_ZERADOS,
    },
    cresceleons: CONSTANTES.CRESCELEONS_INICIAIS,
    tempo: CONSTANTES.TEMPO_DE_VIDA_INICIAL,
    energia: CONSTANTES.ENERGIA_INICIAL,
    higiene: CONSTANTES.HIGIENE_MAXIMA,
    relacionamento: [],
    pontosHabilidade: CONSTANTES.VALORES_INICIAIS_ZERADOS,
    itens: [],
  };
};

const atualizarCresim = (cresim, updates) => {
  const updatedCresim = { ...cresim };

  for (const key in updates) {
    if (
      updates[key] &&
      typeof updates[key] === "object" &&
      !Array.isArray(updates[key])
    ) {
      updatedCresim[key] = { ...cresim[key], ...updates[key] };
    } else {
      updatedCresim[key] = updates[key];
    }
  }

  return updatedCresim;
};

export {
  criarCresim,
  atualizarCresim,
  buscarTodosAtivos,
  findCresim,
  selecionarCresim,
  salvarNovoCresim,
  updateLocalStorage,
  updateStorage,
};
