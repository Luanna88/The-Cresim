import { api } from "../api/api.js";
import { reduzirEnergia, podeExecutarAcao } from "./energia.js";
import { passarTempo } from "./tempo.js";

let interacoes = [];

const carregarInteracoes = async () => {
  interacoes = await api.getItensInteracoes();
  return interacoes;
};

const getInteracao = (nome) => {
  return interacoes.find(i => i.nome === nome);
};

const obterNivelRelacionamento= (pontos) => {
  if (pontos < 0) return "INIMIZADE";
  if (pontos >= 0 && pontos <= 10) return "NEUTRO";
  if (pontos >= 11 && pontos <= 25) return "AMIZADE";
  return "AMOR";
};

const categoriasLiberadas = (nivel) => {
  switch (nivel) {
    case "INIMIZADE":
      return ["INIMIZADE", "NEUTRO"];
    case "NEUTRO":
      return ["NEUTRO"];
    case "AMIZADE":
      return ["NEUTRO", "AMIZADE"];
    case "AMOR":
      return ["NEUTRO", "AMIZADE", "AMOR"];
    default:
      return ["NEUTRO"];
  }
};

const getRelacao = (cresimA, cresimB) => {
  return (
    cresimA.relacionamento.find(r => r.nome === cresimB.nome) || {
      nome: cresimB.nome,
      pontos: 0
    }
  );
};

const atualizarRelacao = (cresim, nomeAlvo, novosPontos) => {
  const rel = cresim.relacionamento.find(r => r.nome === nomeAlvo);

  if (rel) {
    rel.pontos = novosPontos;
  } else {
    cresim.relacionamento.push({ nome: nomeAlvo, pontos: novosPontos });
  }

  return cresim;
};

const interagir = (cresimA, cresimB, nomeInteracao) => {
  const interacao = getInteracao(nomeInteracao);
  if (!interacao) {
    return { erro: "Interação não encontrada." };
  }

  const relAtual = getRelacao(cresimA, cresimB);
  const nivelAtual = obterNivelRelacionamento(relAtual.pontos);
  const liberadas = categoriasLiberadas(nivelAtual);

  if (!liberadas.includes(interacao.categoria)) {
    return {
      erro: `Interação "${interacao.nome}" não permitida para o nível atual (${nivelAtual}).`
    };
  }

  const custoEnergia = interacao.energia;
  const pontosInteracao = interacao.pontos;
  const tempoMs = interacao.energia * 2000;

  if (!podeExecutarAcao(cresimA, custoEnergia)) {
    return { erro: `${cresimA.nome} não tem energia suficiente.` };
  }
  cresimA = reduzirEnergia(cresimA, custoEnergia).cresim;

  const metadeEnergia = Math.ceil(custoEnergia / 2);
  if (!podeExecutarAcao(cresimB, metadeEnergia)) {
    return { erro: `${cresimB.nome} não tem energia suficiente.` };
  }
  cresimB = reduzirEnergia(cresimB, metadeEnergia).cresim;

  cresimA = passarTempo(cresimA, tempoMs);
  cresimB = passarTempo(cresimB, tempoMs);

  const relA = getRelacao(cresimA, cresimB);
  const relB = getRelacao(cresimB, cresimA);

  const novosPontosA = relA.pontos + pontosInteracao;
  const novosPontosB = relB.pontos + pontosInteracao;

  cresimA = atualizarRelacao(cresimA, cresimB.nome, novosPontosA);
  cresimB = atualizarRelacao(cresimB, cresimA.nome, novosPontosB);

  return {
    cresimA,
    cresimB,
    pontos: pontosInteracao,
    tempoGasto: tempoMs,
    categoria: interacao.categoria,
    nivelA: obterNivelRelacionamento(novosPontosA),
    nivelB: obterNivelRelacionamento(novosPontosB),
  };
};

export {
  carregarInteracoes,
  getInteracao,
  obterNivelRelacionamento,
  categoriasLiberadas,
  interagir
};
