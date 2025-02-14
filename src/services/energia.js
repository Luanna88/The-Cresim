import { passarTempo, estaOcupado } from "../services/tempo.js";
import { atualizarCresim } from "../services/cresim.js";
import { CONSTANTES } from "../utils/constants.js";

const dormir = (cresim, tempoDormido) => {
  if (estaOcupado(cresim)) {
    return { cresim, tempo: 0 };
  }

  if (cresim.energia >= CONSTANTES.ENERGIA_MAXIMA) {
    return { cresim, tempo: 0 };
  }

  if (tempoDormido <= 0) {
    return { cresim, tempo: 0 };
  }

  const energiaGanhada =
    Math.floor(tempoDormido / CONSTANTES.CICLO_SIMPLES_DE_SONO) * 4;
  const energiaExtra =
    Math.floor(tempoDormido / CONSTANTES.CICLO_DUPLO_DE_SONO) * 2;
  const novaEnergia = Math.min(
    CONSTANTES.ENERGIA_MAXIMA,
    cresim.energia + energiaGanhada + energiaExtra
  );

  const cresimAtualizado = passarTempo(cresim, tempoDormido);

  return {
    cresim: atualizarCresim(cresimAtualizado, { energia: novaEnergia }),
    tempo: tempoDormido,
  };
};

const reduzirEnergia = (cresim, custo) => {
  if (cresim.energia < custo) {
    return { cresim, sucesso: false };
  }

  const novaEnergia = Math.max(0, cresim.energia - custo);

  return {
    cresim: atualizarCresim(cresim, { energia: novaEnergia }),
    sucesso: true,
  };
};

const podeExecutarAcao = (cresim, custoEnergia) => {
  if (cresim.energia < custoEnergia) {
    return false;
  }
  return true;
};

const estaSemEnergia = (cresim) => {
  if (cresim.energia === CONSTANTES.ENERGIA_ZERADA) {
    return true;
  }
  return false;
};

export { dormir, reduzirEnergia, podeExecutarAcao, estaSemEnergia };
