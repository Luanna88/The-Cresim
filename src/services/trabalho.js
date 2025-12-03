import { api } from "../api/api.js";
import { CONSTANTES } from "../utils/constantes.js";
import { passarTempo } from "../services/tempo.js";
import { reduzirEnergia } from "../services/energia.js";
import { reduzirHigieneTrabalho, aplicarPenalidadeHigiene } from "../services/higiene.js";
import { adicionarCresceleons } from "../services/economia.js";
import { atualizarCresim } from "../services/cresim.js";

const carregarEmpregos = async () => {
  return await api.getItensEmpregos();
};

const getEmprego = (empregos, nome) => {
  return (empregos || []).find((e) => e.nome === nome) ?? null;
};

const nivelPorHabilidade = (cresim, categoria) => {
  const pontuacao = (cresim.habilidades && cresim.habilidades[categoria]) || 0;

  if (pontuacao >= CONSTANTES.PONTUACAO_PLENO) return "SENIOR";
  if (pontuacao >= CONSTANTES.PONTUACAO_JUNIOR) return "PLENO";
  return "JUNIOR";
};

const trabalhar = async (cresim, empregoInput) => {
  if (!cresim) {
    return {
      sucesso: false,
      mensagem: "Cresim inválido",
      cresim,
      tempoTrabalhado: 0,
      ganho: 0,
    };
  }

  if (cresim.energia <= CONSTANTES.ENERGIA_MINIMA_TRABALHO) {
    return {
      sucesso: false,
      mensagem: `Energia insuficiente para começar a trabalhar (mínimo ${CONSTANTES.ENERGIA_MINIMA_TRABALHO + 1}).`,
      cresim,
      tempoTrabalhado: 0,
      ganho: 0,
    };
  }

  let emprego = null;
  if (typeof empregoInput === "string") {
    const lista = await carregarEmpregos();
    emprego = getEmprego(lista, empregoInput);
    if (!emprego) {
      return {
        sucesso: false,
        mensagem: "Emprego não encontrado",
        cresim,
        tempoTrabalhado: 0,
        ganho: 0,
      };
    }
  } else {
    emprego = empregoInput;
  }

  const jornadaPadrao = CONSTANTES.CICLO_JORNADA_TRABALHO; 
  const energiaInicial = cresim.energia;
  const energiaMinimaPermitida = 2;

  const categoria = emprego.categoria || emprego.area || "generico";
  const nivel = nivelPorHabilidade(cresim, categoria);

  const salarioDiario =
    (emprego.salarios && emprego.salarios[nivel]) ??
    (emprego.salario || 0);

  const msPorPontoEnergia = jornadaPadrao / 10; 
  const cresceleonPorPontoEnergia = (salarioDiario / 10);

  const pontosDisponiveis = Math.max(0, energiaInicial - energiaMinimaPermitida);
  const tempoMaximoPermitido = pontosDisponiveis * msPorPontoEnergia;

  const tempoPlanejado = Math.min(jornadaPadrao, tempoMaximoPermitido);

  const energiaParaDesconto = Math.max(0, Math.min(energiaInicial - energiaMinimaPermitida, 5 - energiaMinimaPermitida));
  const energiaDescansada = pontosDisponiveis - energiaParaDesconto;

  const tempoDescansado = energiaDescansada * msPorPontoEnergia;
  const tempoCansado = energiaParaDesconto * msPorPontoEnergia;

  const ganhoDescansado = energiaDescansada * cresceleonPorPontoEnergia;
  const ganhoCansado = energiaParaDesconto * cresceleonPorPontoEnergia * 0.9; 

  let ganhoBruto = ganhoDescansado + ganhoCansado;

  let ganho = aplicarPenalidadeHigiene(ganhoBruto, cresim);
  ganho = Math.round(ganho * 100) / 100;

  const energiaGasta = energiaDescansada + energiaParaDesconto;
  const energiaFinal = Math.max(0, energiaInicial - energiaGasta);

  let cresimAtualizado = passarTempo(cresim, tempoPlanejado);
  cresimAtualizado = adicionarCresceleons(cresimAtualizado, ganho);
  cresimAtualizado = reduzirHigieneTrabalho(cresimAtualizado, tempoPlanejado);

  const reducao = reduzirEnergia(cresimAtualizado, energiaGasta);
  if (!reducao.sucesso) {
    cresimAtualizado = atualizarCresim(cresimAtualizado, { energia: energiaFinal });
  } else {
    cresimAtualizado = reducao.cresim;
  }

  return {
    sucesso: true,
    mensagem: `Trabalho finalizado. Tempo trabalhado: ${tempoPlanejado}ms. Ganho: ${ganho} Cresceleons.`,
    cresim: cresimAtualizado,
    tempoTrabalhado: tempoPlanejado,
    ganho,
  };
};

export {
  carregarEmpregos,
  getEmprego,
  trabalhar
};
