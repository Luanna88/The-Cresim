import { passarTempo, estaOcupado } from "../services/tempo.js";
import { reduzirEnergia } from "../services/energia.js";
import {
  removerCresceleons,
  temCresceleonsSuficientes,
} from "../services/economia.js";
import { atualizarCresim } from "../services/cresim.js";
import { CONSTANTES } from "../utils/constants.js";

const tomarBanho = (cresim) => {
  if (estaOcupado(cresim)) {
    return { cresim, tempo: 0 };
  }

  if (cresim.higiene === CONSTANTES.HIGIENE_MAXIMA) {
    return { cresim, tempo: 0 };
  }

  if (!temCresceleonsSuficientes(cresim, CONSTANTES.CUSTO_BANHO)) {
    return { cresim, tempo: 0 };
  }

  const resultadoEnergia = reduzirEnergia(
    cresim,
    CONSTANTES.CUSTO_ENERGIA_BANHO
  );
  if (!resultadoEnergia.sucesso) return { cresim, tempo: 0 };

  const cresimAtualizado = passarTempo(
    resultadoEnergia.cresim,
    CONSTANTES.TEMPO_BANHO
  );

  const cresimFinal = removerCresceleons(
    cresimAtualizado,
    CONSTANTES.CUSTO_BANHO
  );

  return {
    cresim: atualizarCresim(cresimFinal, {
      higiene: CONSTANTES.HIGIENE_MAXIMA,
    }),
    tempo: CONSTANTES.TEMPO_BANHO,
  };
};

const reduzirHigieneTreino = (cresim) => {
  if (cresim.higiene <= 0) {
    return cresim;
  }

  console.log(`🎓 ${cresim.nome} treinou e perdeu 2 pontos de higiene.`);

  return atualizarCresim(cresim, {
    higiene: Math.max(0, cresim.higiene - 2),
  });
};

const reduzirHigieneTrabalho = (cresim, tempoTrabalho) => {
  if (cresim.higiene <= 0) {
    return { cresim, penalidade: 0 };
  }

  let novaHigiene = Math.max(
    0,
    cresim.higiene - CONSTANTES.REDUCAO_HIGIENE_CICLO_TRABALHO
  );
  let penalidade = 0;

  if (novaHigiene < CONSTANTES.HIGIENE_MINIMA_TRABALHO) {
    penalidade = CONSTANTES.PENALIDADE_HIGIENE_TRABALHO;
  }

  return {
    cresim: atualizarCresim(cresim, { higiene: novaHigiene }),
    penalidade,
  };
};

const podeExecutarAcaoHigiene = (cresim) => {
  if (cresim.higiene <= 0) {
    return false;
  }
  return true;
};

export {
  tomarBanho,
  reduzirHigieneTreino,
  reduzirHigieneTrabalho,
  podeExecutarAcaoHigiene,
};
