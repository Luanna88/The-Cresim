import { atualizarCresim } from "../services/cresim.js";
import { passarTempo } from "../services/tempo.js";
import { removerCresceleons, temCresceleonsSuficientes } from "../services/economia.js";
import { CONSTANTES } from "../utils/constantes.js";

const reduzirHigiene = (cresim, quantidade) => {
  const MIN_HIGIENE = CONSTANTES.HIGIENE_MINIMA_TRABALHO; 

  const novaHigiene = Math.max(MIN_HIGIENE, cresim.higiene - quantidade);

  return atualizarCresim(cresim, { higiene: novaHigiene });
};

const podeExecutarPorHigiene = (cresim, custoMinimo) => {
  return cresim.higiene >= custoMinimo;
};

const reduzirHigieneTrabalho = (cresim, tempoTrabalhado) => {
  const turno = CONSTANTES.CICLO_TEMPO_TURNO_COMPLETO;

  if (tempoTrabalhado >= turno) {
    return reduzirHigiene(cresim, CONSTANTES.REDUCAO_HIGIENE_CICLO_TRABALHO);
  }

  const percentual = tempoTrabalhado / turno;
  const perdaProporcional =
    CONSTANTES.REDUCAO_HIGIENE_CICLO_TRABALHO * percentual;

  return reduzirHigiene(cresim, Math.floor(perdaProporcional));
};

const reduzirHigieneTreino = (cresim) => {
  return reduzirHigiene(cresim, CONSTANTES.REDUCAO_HIGIENE_TREINO);
};

const tomarBanho = (cresim) => {
  if (!temCresceleonsSuficientes(cresim, CONSTANTES.CUSTO_BANHO)) {
    return { cresim, sucesso: false, motivo: "Dinheiro insuficiente" };
  }

  const cresimApósPagamento = removerCresceleons(
    cresim,
    CONSTANTES.CUSTO_BANHO
  );

  const cresimComTempoGasto = passarTempo(
    cresimApósPagamento,
    CONSTANTES.CICLO_TEMPO_BANHO
  );

  const cresimHigienizado = atualizarCresim(cresimComTempoGasto, {
    higiene: CONSTANTES.HIGIENE_MAXIMA,
  });

  return {
    cresim: cresimHigienizado,
    sucesso: true,
  };
};

const aplicarPenalidadeHigiene = (salario, cresim) => {
  if (cresim.higiene < CONSTANTES.HIGIENE_MINIMA_TRABALHO) {
    const desconto = salario * CONSTANTES.PENALIDADE_HIGIENE_TRABALHO;
    return salario - desconto;
  }

  return salario;
};

export {
  reduzirHigiene,
  podeExecutarPorHigiene,
  reduzirHigieneTrabalho,
  reduzirHigieneTreino,
  tomarBanho,
  aplicarPenalidadeHigiene,
};
