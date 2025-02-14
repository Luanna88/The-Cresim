import { api } from "../api/api.js";
import { passarTempo, estaOcupado } from "../services/tempo.js";
import { reduzirEnergia } from "../services/energia.js";
import { reduzirHigieneTreino } from "../services/higiene.js";
import {
  removerCresceleons,
  temCresceleonsSuficientes,
} from "../services/economia.js";
import { atualizarCresim } from "../services/cresim.js";
import { CONSTANTES } from "../utils/constants.js";

let itensHabilidade = [];
const carregarItensHabilidade = async () => {
  itensHabilidade = await api.getItens();
  return itensHabilidade;
};
carregarItensHabilidade();

const treinar = (cresim, habilidade) => {
  if (estaOcupado(cresim)) {
    return { cresim, tempo: 0 };
  }

  if (cresim.energia < CONSTANTES.ENERGIA_TREINO) {
    return { cresim, tempo: 0 };
  }

  const itemHabilidade = cresim.itens.find((item) =>
    itensHabilidade[habilidade].some((it) => it.nome === item.nome)
  );

  // if (!itemHabilidade) {
  //   console.log("❌ Cresim não possui um item dessa habilidade!");
  //   return { cresim, tempo: 0 };
  // }

  let pontosDeHabilidade = itemHabilidade.pontos;
  if (habilidade === cresim.aspiracao) {
    pontosDeHabilidade += CONSTANTES.GANHO_PONTOS_HABILIDADE;
  }

  const resultadoEnergia = reduzirEnergia(cresim, CONSTANTES.ENERGIA_TREINO);
  if (!resultadoEnergia.sucesso) return { cresim, tempo: 0 };

  const cresimAtualizado = passarTempo(
    resultadoEnergia.cresim,
    CONSTANTES.CICLO_TEMPO_TREINO
  );

  const cresimComHigieneReduzida = reduzirHigieneTreino(cresimAtualizado);

  return {
    cresim: atualizarCresim(cresimComHigieneReduzida, {
      habilidades: {
        ...cresim.habilidades,
        [habilidade]: cresim.habilidades[habilidade] + pontosDeHabilidade,
      },
      pontosHabilidade: cresim.pontosHabilidade + pontosDeHabilidade,
    }),
    tempo: CONSTANTES.CICLO_TEMPO_TREINO,
  };
};

const obterNivelHabilidade = (pontos) => {
  if (pontos <= CONSTANTES.PONTUACAO_JUNIOR) return "JUNIOR";
  if (pontos <= CONSTANTES.PONTUACAO_PLENO) return "PLENO";
  return "SENIOR";
};

const comprarItem = (cresim, item) => {
  if (!item) {
    return cresim;
  }

  if (!temCresceleonsSuficientes(cresim, item.preco)) {
    console.log(
      "❌ Você não tem Cresceleons suficientes para comprar este item."
    );
    return cresim;
  }

  console.log(
    `🛒 ${cresim.nome} comprou ${item.nome} por ${item.preco} Cresceleons.`
  );

  const cresimAtualizado = removerCresceleons(cresim, item.preco);

  return atualizarCresim(cresimAtualizado, {
    itens: [...cresimAtualizado.itens, { ...item }],
  });
};

const buscarItensHabilidades = (chave) => {
  return itensHabilidade[chave] || [];
};

const buscarHabilidades = () => {
  return Object.keys(itensHabilidade);
};

const buscarHabilidadePorIndex = (index) => {
  const habilidade = itensHabilidade[index - CONSTANTES.CORRECAO_INDICE];
  console.log(habilidade);
  return itensHabilidade[index - CONSTANTES.CORRECAO_INDICE] || null;
};

export {
  treinar,
  obterNivelHabilidade,
  comprarItem,
  buscarItensHabilidades,
  buscarHabilidades,
  buscarHabilidadePorIndex,
};
