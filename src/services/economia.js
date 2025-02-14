import { atualizarCresim } from "../services/cresim.js";

const adicionarCresceleons = (cresim, valor) => {
  if (valor <= 0) {
    return cresim;
  }

  console.log(`💰 ${cresim.nome} ganhou ${valor} Cresceleons.`);
  return atualizarCresim(cresim, { cresceleons: cresim.cresceleons + valor });
};

const removerCresceleons = (cresim, valor) => {
  if (valor <= 0) {
    return cresim;
  }

  if (cresim.cresceleons < valor) {
    return cresim;
  }

  return atualizarCresim(cresim, { cresceleons: cresim.cresceleons - valor });
};

const temCresceleonsSuficientes = (cresim, valor) => {
  return cresim.cresceleons >= valor;
};

export { adicionarCresceleons, removerCresceleons, temCresceleonsSuficientes };
