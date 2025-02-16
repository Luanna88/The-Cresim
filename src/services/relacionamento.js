import { passarTempo, estaOcupado } from "../services/tempo.js";
import { reduzirEnergia } from "../services/energia.js";
import { atualizarCresim } from "../services/cresim.js";
import { CONSTANTES } from "../utils/constants.js";
import { api } from "../api/api.js";

let interacoesDisponiveis = [];
const carregarInteracoesDisponiveis = async () => {
  interacoesDisponiveis = await api.getInteracoes();
  return interacoesDisponiveis;
};
carregarInteracoesDisponiveis();

const interagir = (cresim, outroCresim, tipoInteracao) => {
  if (estaOcupado(cresim) || estaOcupado(outroCresim)) {
    console.log("❌ Cresim ocupado.");
    return { cresim, outroCresim, tempo: 0 };
  }

  const interacao = obterInteracao(tipoInteracao);
  if (!interacao) {
    console.log("❌ Interação não encontrada.");
    return { cresim, outroCresim, tempo: 0 };
  }

  const resultadoEnergia = reduzirEnergia(cresim, interacao.energia);
  if (!resultadoEnergia.sucesso) return { cresim, outroCresim, tempo: 0 };

  const energiaOutroCresim = Math.ceil(interacao.energia / 2);
  const resultadoEnergiaOutro = reduzirEnergia(outroCresim, energiaOutroCresim);

  const tempoGasto = interacao.energia * 2000;

  cresim = atualizarRelacionamento(cresim, outroCresim, interacao.pontos);
  outroCresim = atualizarRelacionamento(outroCresim, cresim, interacao.pontos);

  const cresimAtualizado = passarTempo(resultadoEnergia.cresim, tempoGasto);
  const outroCresimAtualizado = passarTempo(resultadoEnergiaOutro.cresim, tempoGasto);

  return {
    cresim: atualizarCresim(cresimAtualizado, { relacionamento: cresim.relacionamentos }),
    outroCresim: outroCresimAtualizado,
    tempo: tempoGasto,
  };
};


const obterInteracao = (interacaoNome) => {
  for (const categoria in interacoesDisponiveis) {
    const interacaoEncontrada = interacoesDisponiveis[categoria].find(
      (interacao) =>
        interacao.interacao.toLowerCase() === interacaoNome.toLowerCase()
    );
    if (interacaoEncontrada) {
      return interacaoEncontrada;
    }
  }
  console.log("❌ Interação não encontrada");
  return null;
};


const atualizarRelacionamento = (cresim, outroCresim, pontos) => {
  if (!Array.isArray(cresim.relacionamentos)) {
    cresim.relacionamentos = []; 
  }

  const relacionamentoAtual = cresim.relacionamentos.find(
    (r) => r.nome === outroCresim.nome
  );
  const novoPontos = relacionamentoAtual ? relacionamentoAtual.pontos + pontos : pontos;

  if (relacionamentoAtual) {
    relacionamentoAtual.pontos = novoPontos;
    relacionamentoAtual.nivel = determinarNivelRelacionamento(novoPontos);
  } else {
    cresim.relacionamentos.push({
      nome: outroCresim.nome,
      pontos: novoPontos,
      nivel: determinarNivelRelacionamento(novoPontos),
    });
  }

  return cresim;
};


const determinarNivelRelacionamento = (pontos) => {
  if (pontos < CONSTANTES.NIVEL_INIMIZADE_RELACIONAMENTO) return "INIMIZADE";
  if (pontos < CONSTANTES.NIVEL_NEUTRO_RELACIONAMENTO) return "NEUTRO";
  if (pontos < CONSTANTES.NIVEL_AMIZADE_RELACIONAMENTO) return "AMIZADE";
  return "AMOR";
};

const obterInteracoesDisponiveis = () => {
  return interacoesDisponiveis;
};

export { interagir, obterInteracoesDisponiveis,  determinarNivelRelacionamento };
