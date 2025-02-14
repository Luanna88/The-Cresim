import { api } from "../src/api/api.js";
import { CONSTANTES } from "../src/utils/constants";
import { criarCresim } from "../src/services/cresim.js";
import {
  treinar,
  comprarItem,
  buscarHabilidadePorIndex,
  obterNivelHabilidade,
} from "../src/services/habilidade.js";
import {
  reduzirEnergia,
  podeExecutarAcao,
  estaSemEnergia,
  dormir,
} from "../src/services/energia.js";
import { trabalhar } from "../src/services/trabalho.js";
import {
  tomarBanho,
  podeExecutarAcaoHigiene,
} from "../src/services/higiene.js";
import { interagir, obterInteracao } from "../src/services/relacionamento.js";
import { aplicarCheat, carregarCheats } from "../src/services/cheats.js";
import { estaOcupado, passarTempo } from "../src/services/tempo.js";
import {
  adicionarCresceleons,
  removerCresceleons,
  temCresceleonsSuficientes,
} from "../src/services/economia.js";

jest.mock("../src/services/tempo.js", () => ({
  ...jest.requireActual("../src/services/tempo.js"),
  estaOcupado: jest.fn(),
}));

let cresim,
  cheatsDisponiveis;

beforeAll(async () => {
  cheatsDisponiveis = await api.getCheats();
  carregarCheats(cheatsDisponiveis);
});

beforeEach(() => {
  const nome = "Julia";
  cresim = criarCresim(nome, "JARDINAGEM");
});

describe("Testes The-Cresims", () => {

it("Deve retornar tempo 0 quando o cresim estiver ocupado", () => {
    const nome = "Julia";
    const cresim = criarCresim(nome, "JARDINAGEM");
    const habilidade = "JOGOS";
    estaOcupado.mockReturnValue(true);
    const resultado = treinar(cresim, habilidade);

    expect(resultado.tempo).toBe(0);
    expect(resultado.cresim).toBe(cresim);
});

it("Deve zerar o tempo se a redução for maior que o tempo restante", () => {
    const tempoGasto = 2000;
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.tempo = 1000;
    const cresimAtualizado = passarTempo(cresimClone, tempoGasto);

    expect(cresimAtualizado.tempo).toBe(0);
});

it("Deve manter o Cresim inalterado se o tempo já for 0", () => {
    const tempoGasto = 1000;
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.tempo = 0;
    const cresimAtualizado = passarTempo(cresimClone, tempoGasto);

    expect(cresimAtualizado).toEqual(cresimClone);
});

it("Deve retornar o Cresim sem alterações e tempo 0 se estiver ocupado", () => {
  estaOcupado.mockReturnValue(true);
  const resultado = tomarBanho(cresim);
  expect(estaOcupado).toHaveBeenCalledWith(cresim);
  expect(resultado).toEqual({ cresim, tempo: 0 });
});


});
 
