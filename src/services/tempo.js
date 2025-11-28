import { atualizarCresim } from "../services/cresim.js";

const passarTempo = (cresim, tempoGasto) => {
  if (cresim.tempo <= 0) {
    return cresim;
  }

  const novoTempo = Math.max(0, cresim.tempo - tempoGasto);
  return atualizarCresim(cresim, { tempo: novoTempo });
};

const estaVivo = (cresim) => cresim.tempo > 0;
const estaOcupado = (cresim) => cresim.tempo <= 0;

export { passarTempo, estaVivo, estaOcupado };
