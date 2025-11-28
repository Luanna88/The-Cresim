import { CONSTANTES } from "../utils/constantes.js";
import { atualizarCresim } from "./cresim.js";

export function higieneSuficienteParaAcao(cresim, pontosNecessarios) {
  return cresim.higiene - pontosNecessarios >= 0;
}

export function perderHigiene(cresim, qtd) {
  const novaHigiene = Math.max(0, cresim.higiene - qtd);
  return atualizarCresim(cresim, { higiene: novaHigiene });
}

export function recuperarHigieneTotal(cresim) {
  return atualizarCresim(cresim, { higiene: CONSTANTES.HIGIENE_MAXIMA });
}

export function trabalharTurnoCompleto(cresim) {
  return perderHigiene(cresim, CONSTANTES.REDUCAO_HIGIENE_CICLO_TRABALHO);
}

export function trabalharParcial(cresim, tempoTrabalhado, tempoTotalTurno) {
  const porcentagem = tempoTrabalhado / tempoTotalTurno;
  const perda = CONSTANTES.REDUCAO_HIGIENE_CICLO_TRABALHO * porcentagem;

  return perderHigiene(cresim, perda);
}

export function treinarCiclo(cresim) {
  return perderHigiene(cresim, 2);
}

export async function tomarBanho(cresim, callback = () => {}) {
  if (cresim.cresceleons < CONSTANTES.CUSTO_BANHO) {
    return { sucesso: false, motivo: "Sem cresceleon" };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const higienizado = recuperarHigieneTotal(cresim);

      const atualizado = atualizarCresim(higienizado, {
        cresceleons: higienizado.cresceleons - CONSTANTES.CUSTO_BANHO,
      });

      callback(atualizado);
      resolve({ sucesso: true, cresim: atualizado });
    }, CONSTANTES.CICLO_TEMPO_BANHO);
  });
}

export function calcularSalarioComHigiene(cresim, salarioBase) {
  if (cresim.higiene < CONSTANTES.HIGIENE_MINIMA_TRABALHO) {
    const desconto = salarioBase * CONSTANTES.PENALIDADE_HIGIENE_TRABALHO;
    return salarioBase - desconto;
  }
  return salarioBase;
}
