import { atualizarCresim } from "../services/cresim.js";
import { CONSTANTES } from "../utils/constantes.js";

export const CHEATS = {
  SORTENAVIDA: "SORTENAVIDA",
  DEITADONAREDE: "DEITADONAREDE",
  TERAPIA: "TERAPIA",
  DESODORANTE: "DESODORANTE",
  WHEYPROTEIN: "WHEYPROTEIN",
  SINUSITE: "SINUSITE",
};

export function processarCheat(comando, cresim) {
  if (!comando || typeof comando !== "string") return cresim;
  if (!cresim) return cresim;

  const cheat = comando.trim().toUpperCase();

  switch (cheat) {

    case CHEATS.SORTENAVIDA:
      return atualizarCresim(cresim, {
        cresceleons: cresim.cresceleons + 1000,
      });

    case CHEATS.DEITADONAREDE:
      return atualizarCresim(cresim, {
        energia: Math.min(
          cresim.energia + CONSTANTES.GANHO_ENERGIA_DEZ,
          CONSTANTES.ENERGIA_MAXIMA
        ),
      });

    case CHEATS.TERAPIA:
      return atualizarCresim(cresim, {
        relacionamento: Array.isArray(cresim.relacionamento)
          ? cresim.relacionamento.map((r) => ({
              ...r,
              pontos: r.pontos + 5,
            }))
          : [],
      });

    case CHEATS.DESODORANTE:
      return atualizarCresim(cresim, {
        higiene: Math.min(
          cresim.higiene + 15,
          CONSTANTES.HIGIENE_MAXIMA
        ),
      });

    case CHEATS.WHEYPROTEIN:
      return atualizarCresim(cresim, {
        tempo: cresim.tempo + 100000,
      });

    case CHEATS.SINUSITE:
      return atualizarCresim(cresim, {
        tempo: 0,
      });

    default:
      return cresim;
  }
}
