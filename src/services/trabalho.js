import { buscarEmpregos } from "../api/api.js";
import { gastarEnergia } from "./energia.js";
import { trabalharTurnoCompleto, trabalharParcial, calcularSalarioComHigiene } from "./higiene.js";
import { adicionarCresceleons } from "./economia.js";
import { passarTempo } from "./tempo.js";

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

export async function trabalhar({ cresim, nomeEmprego, callback = () => {} }) {
  const emprego = getEmprego(nomeEmprego);
  if (!emprego) {
    console.warn("Emprego não encontrado:", nomeEmprego);
    return;
  }

  if (cresim.energia < MINIMO_PARA_TRABALHAR) {
    console.warn("Energia insuficiente para trabalhar");
    return;
  }

  const energiaParaGastar = cresim.energia - MINIMO_ENERGIA_FINAL;
  const msPorEnergia = CARGA_TRABALHO / energiaParaGastar;
  const tempoTrabalhado = energiaParaGastar * msPorEnergia;

  cresim = gastarEnergia(cresim, energiaParaGastar);

  cresim = trabalharParcial(cresim, tempoTrabalhado, CARGA_TRABALHO);

  let salario = tempoTrabalhado / (CARGA_TRABALHO / emprego.salario);
  salario = calcularSalarioComHigiene(cresim, salario);

  cresim = adicionarCresceleons(cresim, salario);

  cresim = passarTempo(cresim, tempoTrabalhado);

  callback({
    salario,
    tempoTrabalhado,
    energiaRestante: cresim.energia,
    emprego,
    cresim
  });

  return cresim;
}
