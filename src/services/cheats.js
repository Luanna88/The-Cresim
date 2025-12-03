import { atualizarCresim } from "../services/cresim.js";
import { CONSTANTES } from "../utils/constantes.js";

let cheatsDisponiveis = [];

export const CHEATS = {
  SORTENAVIDA: "SORTENAVIDA",
  DEITADONAREDE: "DEITADONAREDE",
  TERAPIA: "TERAPIA",
  DESODORANTE: "DESODORANTE",
  WHEYPROTEIN: "WHEYPROTEIN",
  SINUSITE: "SINUSITE",
};

export const carregarCheats = () => {
  cheatsDisponiveis = Object.keys(CHEATS).map(c => ({ codigo: c }));
};

export const aplicarCheat = (cresim, codigo) => {
  if (!cresim) return { cresim: null, aplicado: false };
  const cheat = cheatsDisponiveis.find(c => c.codigo === codigo.toUpperCase());
  if (!cheat) return { cresim, aplicado: false };

  let cresimAtualizado = { ...cresim };

  switch (cheat.codigo) {
    case CHEATS.SORTENAVIDA:
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        cresceleons: cresimAtualizado.cresceleons + 1000,
      });
      break;

    case CHEATS.DEITADONAREDE:
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        energia: Math.min(CONSTANTES.ENERGIA_MAXIMA, cresimAtualizado.energia + 10),
      });
      break;

    case CHEATS.TERAPIA:
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        relacionamento: cresimAtualizado.relacionamento.map(r => ({
          ...r,
          pontos: r.pontos + 5,
        })),
      });
      break;

    case CHEATS.DESODORANTE:
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        higiene: Math.min(CONSTANTES.HIGIENE_MAXIMA, cresimAtualizado.higiene + 15),
      });
      break;

    case CHEATS.WHEYPROTEIN:
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        tempo: cresimAtualizado.tempo + 100000,
      });
      break;

    case CHEATS.SINUSITE:
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        tempo: 0,
      });
      break;

    default:
      return { cresim, aplicado: false };
  }

  return { cresim: cresimAtualizado, aplicado: true };
};

export { cheatsDisponiveis };
