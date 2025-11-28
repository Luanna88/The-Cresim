import { buscarInteracoes } from "../api/api.js";
import { atualizarCresim } from "./cresim.js";
import { gastarEnergia, podeAgir } from "./energia.js";

export let interacoes = [];
export let relacionamentos = {};

export async function carregarInteracoes() {
  interacoes = await buscarInteracoes();
  return interacoes;
}

export function calcularNivel(pontos) {
  if (pontos < 0) return "INIMIZADE";
  if (pontos <= 10) return "NEUTRO";
  if (pontos <= 25) return "AMIZADE";
  return "AMOR";
}

function getRelacao(cresimA, cresimB) {
  const chave = `${cresimA}-${cresimB}`;
  const chaveInvertida = `${cresimB}-${cresimA}`;

  if (relacionamentos[chave]) return relacionamentos[chave];
  if (relacionamentos[chaveInvertida]) return relacionamentos[chaveInvertida];

  relacionamentos[chave] = { pontos: 0, nivel: "NEUTRO" };
  return relacionamentos[chave];
}

export function interacoesDisponiveis(nivel) {
  return interacoes.filter((i) => i.categoria === nivel);
}

export function interagir(cresimA, cresimB, nomeInteracao, callback = () => {}) {
  if (!podeAgir(cresimA) || !podeAgir(cresimB)) return;

  const relacao = getRelacao(cresimA.nome, cresimB.nome);
  const dadosInteracao = interacoes.find((i) => i.nome === nomeInteracao);
  if (!dadosInteracao) return;

  const energiaA = dadosInteracao.energia;
  const energiaB = Math.ceil(dadosInteracao.energia / 2);
  const tempo = dadosInteracao.energia * 2000;

  atualizarCresim(cresimA, { energia: Math.max(0, cresimA.energia - energiaA) });
  atualizarCresim(cresimB, { energia: Math.max(0, cresimB.energia - energiaB) });

  setTimeout(() => {
    relacao.pontos += dadosInteracao.pontos;
    relacao.nivel = calcularNivel(relacao.pontos);

    callback({
      entre: [cresimA.nome, cresimB.nome],
      interacao: nomeInteracao,
      pontosFinais: relacao.pontos,
      nivelFinal: relacao.nivel,
      energiaGastaA: energiaA,
      energiaGastaB: energiaB,
      tempoGastoMs: tempo
    });
  }, tempo);
}
