import { passarTempo, estaOcupado } from "../services/tempo.js";
import { reduzirEnergia } from "../services/energia.js";
import { reduzirHigieneTrabalho } from "../services/higiene.js";
import { adicionarCresceleons } from "../services/economia.js";
import { atualizarCresim } from "../services/cresim.js";
import { api } from "../api/api.js";
import { CONSTANTES } from "../utils/constants.js";

const JORNADA_PADRAO = 20000;
const ENERGIA_POR_TURNO = 10;
const ENERGIA_MINIMA_TRABALHO = 4;

let listaTrabalhos = [];
const carregarTrabalhos = async () => {
  try {
    listaTrabalhos = await api.getEmpregos();
  } catch (error) {
    return;
  }
};
carregarTrabalhos();

const trabalhar = (cresim, emprego) => {
  if (estaOcupado(cresim)) {
    return { cresim, tempo: 0, salario: 0 };
  }

  if (cresim.energia < ENERGIA_MINIMA_TRABALHO) {
    return { cresim, tempo: 0, salario: 0 };
  }

  const nivel = obterNivelHabilidade(cresim, emprego.categoria);
  const salarioBase =
    emprego.salario.find((s) => s.nivel === nivel)?.valor || 0;
  const bonusPercentual = cresim.bonusSalario ? cresim.bonusSalario / 100 : 0;
  const salarioFinalBase = salarioBase * (1 + bonusPercentual);

  const energiaDisponivel = Math.max(2, cresim.energia - 2); 
  const tempoTrabalho = Math.min(
    JORNADA_PADRAO,
    energiaDisponivel * (JORNADA_PADRAO / ENERGIA_POR_TURNO)
  );

  const salarioPorMs = salarioFinalBase / JORNADA_PADRAO;
  let salarioFinal = tempoTrabalho * salarioPorMs;

  if (cresim.energia <= 5) {
    const pontosRecalculo = 5 - cresim.energia;
    const desconto = pontosRecalculo * 0.1;
    salarioFinal *= 1 - desconto;
  }

  const resultadoEnergia = reduzirEnergia(
    cresim,
    Math.ceil(tempoTrabalho / (JORNADA_PADRAO / ENERGIA_POR_TURNO))
  );
  if (!resultadoEnergia.sucesso) return { cresim, tempo: 0, salario: 0 };

  const { cresim: cresimHigiene, penalidade } = reduzirHigieneTrabalho(
    resultadoEnergia.cresim,
    tempoTrabalho
  );
  salarioFinal *= 1 - penalidade;

  const cresimComSalario = adicionarCresceleons(cresimHigiene, salarioFinal);

  const cresimAtualizado = passarTempo(cresimComSalario, tempoTrabalho);

  return {
    cresim: atualizarCresim(cresimAtualizado, {
      cresceleons: cresimAtualizado.cresceleons + salarioFinal,
    }),
    tempo: tempoTrabalho,
    salario: salarioFinal,
  };
};

const obterNivelHabilidade = (cresim, categoria) => {
  const pontos = cresim.habilidades[categoria] || 0;
  if (pontos <= CONSTANTES.PONTUACAO_JUNIOR) return "JUNIOR";
  if (pontos <= CONSTANTES.PLENO) return "PLENO";
  return "SENIOR";
};

const buscarTrabalho = async (idTrabalho) => {
  if (listaTrabalhos.length === 0) {
    await carregarTrabalhos();
  }

  const trabalho = listaTrabalhos.find((t) => t.id === idTrabalho);
  if (!trabalho) {
    return null;
  }

  return trabalho;
};

const buscarTodosOsTrabalhos = () => {
  return listaTrabalhos;
};

export {
  trabalhar,
  obterNivelHabilidade,
  buscarTrabalho,
  buscarTodosOsTrabalhos,
};
