import { buscarEmpregos } from "../services/api/api.js";

export let empregos = [];

export async function carregarEmpregos() {
  empregos = await buscarEmpregos();
  return empregos;
}

export function getEmprego(nome) {
  return empregos.find(e => e.nome === nome);
}

const CARGA_TRABALHO = 20000;
const MINIMO_PARA_TRABALHAR = 4;
const MINIMO_ENERGIA_FINAL = 2;

export function trabalhar({ crescim, nomeEmprego, callback = () => {} }) {
  
  const emprego = getEmprego(nomeEmprego);
  if (!emprego) {
    console.warn("Emprego não encontrado:", nomeEmprego);
    return;
  }

  if (crescim.energia < MINIMO_PARA_TRABALHAR) {
    console.log("❌ Energia insuficiente para trabalhar! (mínimo 4)");
    return;
  }

  console.log(`👷 ${crescim.nome} começou a trabalhar como ${emprego.nome}...`);

  let desconto = 0;

  if (crescim.energia < 10) {
    const pontosAbaixoDe10 = 10 - crescim.energia;
    desconto = pontosAbaixoDe10 * 0.10;
  }

  const energiaAtual = crescim.energia;

  const msPorEnergia = CARGA_TRABALHO / energiaAtual;
  const energiaParaGastar = energiaAtual - MINIMO_ENERGIA_FINAL;

  const tempoTrabalhado = energiaParaGastar * msPorEnergia;

  const msPorCresceleon = CARGA_TRABALHO / emprego.salario;
  const cresceleonPorEnergia = msPorEnergia / msPorCresceleon;

  const energiaCansado = Math.max(0, Math.min(energiaParaGastar, 5 - MINIMO_ENERGIA_FINAL));
  const energiaDescansado = energiaParaGastar - energiaCansado;

  const salarioCansado =
    energiaCansado * (cresceleonPorEnergia - cresceleonPorEnergia * desconto);

  const salarioDescansado =
    energiaDescansado > 0 ? energiaDescansado * cresceleonPorEnergia : 0;

  const salarioFinal = salarioCansado + salarioDescansado;

  crescim.energia = MINIMO_ENERGIA_FINAL;

  console.log(` Energia gasta: ${energiaParaGastar}`);
  console.log(` Tempo trabalhado: ${tempoTrabalhado}`);
  console.log(` Salário final: ${salarioFinal.toFixed(2)}`);
  console.log(` Energia final: ${crescim.energia}`);

  callback({salario: salarioFinal,tempoTrabalhado,energiaRestante: crescim.energia,emprego});
}
