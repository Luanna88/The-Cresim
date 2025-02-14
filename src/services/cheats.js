import { atualizarCresim } from "../services/cresim.js";
import { passarTempo } from "../services/tempo.js";
import { CONSTANTES } from "../utils/constants.js";
import { useLocalStorage } from "./local-storage/use-local-storage.js";

let cheatsDisponiveis = [];

const carregarCheats = (cheats) => {
  cheatsDisponiveis = cheats;
};

const localStorage = useLocalStorage();

const aplicarCheat = (cresim, codigo, habilidade = null) => {
  const cheat = cheatsDisponiveis.find(
    (c) => c.codigo === codigo.toUpperCase()
  );

  if (!cheat) {
    return { cresim, aplicado: false };
  }

  let cresimAtualizado = { ...cresim };

  switch (cheat.categoria) {
    case "SALARIO":
      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        bonusSalario: (cresimAtualizado.bonusSalario || 0) + cheat.valor,
      });
      break;

    case "ENERGIA":
      const energiaNova = Math.min(
        CONSTANTES.ENERGIA_MAXIMA,
        cresimAtualizado.energia + cheat.valor
      );
      return {
        cresim: atualizarCresim(cresimAtualizado, { energia: energiaNova }),
        aplicado: true,
      };

    case "HABILIDADE":
      if (!habilidade || !(habilidade in cresim.habilidades)) {
        return { cresim, aplicado: false };
      }

      cresimAtualizado = atualizarCresim(cresimAtualizado, {
        habilidades: {
          ...cresim.habilidades,
          [habilidade]: cresim.habilidades[habilidade] + cheat.valor,
        },
      });
      break;

    case "VIDA":
      if (cheat.valor === 0) {
        return {
          cresim: atualizarCresim(cresimAtualizado, { morto: true, tempo: 0 }),
          aplicado: true,
        };
      }
      cresimAtualizado = passarTempo(cresimAtualizado, -cheat.valor);
      break;

    default:
      return { cresim, aplicado: false };
  }

  return { cresim: cresimAtualizado, aplicado: true };
};

export { aplicarCheat, carregarCheats, cheatsDisponiveis };
