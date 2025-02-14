import { api } from "../src/api/api.js";
import { CONSTANTES } from "../src/utils/constants";
import { criarCresim } from "../src/services/cresim.js";
import {  reduzirEnergia } from "../src/services/energia.js";
import { tomarBanho, podeExecutarAcaoHigiene, reduzirHigieneTreino, reduzirHigieneTrabalho } from "../src/services/higiene.js";
import { carregarCheats } from "../src/services/cheats.js";
import { removerCresceleons, temCresceleonsSuficientes } from "../src/services/economia.js";
import { passarTempo } from "../src/services/tempo.js";

jest.mock("../src/services/tempo.js", () => ({
  ...jest.requireActual("../src/services/tempo.js"),
  passarTempo: jest.fn(),
  estaOcupado: jest.fn(() => false),
}));

jest.mock("../src/services/energia.js", () => ({
  ...jest.requireActual("../src/services/energia.js"),
  reduzirEnergia: jest.fn(),
  podeExecutarAcao: jest.fn(() => true),
}));

jest.mock("../src/services/economia.js", () => ({
  ...jest.requireActual("../src/services/economia.js"),
  removerCresceleons: jest.fn(),
  temCresceleonsSuficientes: jest.fn(() => true),
}));

let cresim, cheatsDisponiveis;

beforeAll(async () => {
  cheatsDisponiveis = await api.getCheats();
  carregarCheats(cheatsDisponiveis);
});

beforeEach(() => {
  cresim = criarCresim("Julia", "JARDINAGEM");
});

describe("Testes Higiene", () => {

it("Deve retornar o mesmo Cresim e tempo 0 se a higiene já estiver no máximo", () => {
    cresim.higiene = CONSTANTES.HIGIENE_MAXIMA;
    const resultado = tomarBanho(cresim);

    expect(resultado.cresim).toEqual(cresim);
    expect(resultado.tempo).toBe(0);
});

it("Deve retornar 'true' quando a higiene for maior que 0", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 5;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(true);
});

it("Deve retornar 'false' quando a higiene for 0", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 0;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(false);
});

it("Deve retornar 'false' quando a higiene for negativa", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = -3;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(false);
});

it("Deve retornar true quando a higiene for exatamente 1", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 1;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(true);
});

it("Não deve chamar funções externas se a higiene já estiver no máximo", () => {
    cresim.higiene = CONSTANTES.HIGIENE_MAXIMA;
    tomarBanho(cresim);

    expect(reduzirEnergia).not.toHaveBeenCalled();
    expect(passarTempo).not.toHaveBeenCalled();
    expect(removerCresceleons).not.toHaveBeenCalled();
});

it("Deve retornar o mesmo Cresim e tempo 0 se não houver Cresceleons suficientes", () => {
    temCresceleonsSuficientes.mockReturnValue(false);
    const resultado = tomarBanho(cresim);

    expect(resultado.cresim).toEqual(cresim);
    expect(resultado.tempo).toBe(0);
});
  
it("Deve retornar o mesmo Cresim e tempo 0 se reduzirEnergia falhar", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    reduzirEnergia.mockReturnValue({ sucesso: false, cresim });
    const resultado = tomarBanho(cresim);

    expect(resultado.cresim).toEqual(cresim);
    expect(resultado.tempo).toBe(0);
});

it("Deve retornar o mesmo Cresim se a higiene for 0", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    cresim.higiene = 0;
    const resultado = reduzirHigieneTreino(cresim);
    
    expect(resultado).toEqual(cresim);
});
  
it("Deve reduzir a higiene em 2 pontos se a higiene for maior que 0", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    cresim.higiene = 5;
    const resultado = reduzirHigieneTreino(cresim);
    
    expect(resultado.higiene).toBe(3);
});

it("Deve garantir que a higiene nunca fique negativa", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    cresim.higiene = 1;
    const resultado = reduzirHigieneTreino(cresim);
    
    expect(resultado.higiene).toBe(0);
});

it("Deve retornar o mesmo Cresim e penalidade 0 quando a higiene já for 0", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    cresim.higiene = 0;
    const resultado = reduzirHigieneTrabalho(cresim, 5);

    expect(resultado).toEqual({ cresim, penalidade: 0 });
});

it("Deve retornar o mesmo Cresim e penalidade 0 quando a higiene for negativa", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    cresim.higiene = -2;
    const resultado = reduzirHigieneTrabalho(cresim, 5);

    expect(resultado).toEqual({ cresim, penalidade: 0 });
})
 
});
