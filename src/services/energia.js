import { atualizarCresim } from "./cresim.js";
import { CONSTANTES } from "../utils/constantes.js";

export function podeAgir() {
  return energia > 0;
}

export function gastarEnergia(cresim, qtde) {
  if (!podeAgir(cresim)) {
    return cresim;
  }

  const novaEnergia = Math.max(0, cresim.energia - qtde);

  return atualizarCresim(cresim, { energia: novaEnergia });
}

export function dormir(cresim, tempoMs, callback = () => {}) {
  if (tempoMs < 5000) {
    return cresim;
  }

  const ciclos = Math.floor(tempoMs / 5000);

  let ganho = ciclos * 4;

  if (ciclos > 1) {
    ganho += 2;
  }

  setTimeout(() => {
    const novaEnergia = Math.min(
      cresim.energia + ganho,
      CONSTANTES.ENERGIA_MAXIMA
    );

    const atualizado = atualizarCresim(cresim, { energia: novaEnergia });

    callback(atualizado);

  }, tempoMs);

  return cresim;
}