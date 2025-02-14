import { api } from "../src/api/api.js";
import { CONSTANTES } from "../src/utils/constants";
import { criarCresim } from "../src/services/cresim.js";
import {
  treinar} from "../src/services/habilidade.js";
import {
  podeExecutarAcao,
  estaSemEnergia,
  dormir
} from "../src/services/energia.js";
import { trabalhar } from "../src/services/trabalho.js";
import { carregarCheats } from "../src/services/cheats.js";
import { estaOcupado } from "../src/services/tempo.js";

jest.mock("../src/services/tempo.js", () => ({
  ...jest.requireActual("../src/services/tempo.js"),
  estaOcupado: jest.fn(),
}));

let cresim,
  itensHabilidades,
  empregos,
  cheatsDisponiveis;

beforeAll(async () => {
  itensHabilidades = await api.getItens();
  empregos = await api.getEmpregos();
  cheatsDisponiveis = await api.getCheats();
  carregarCheats(cheatsDisponiveis);
});

beforeEach(() => {
  const nome = "Julia";
  cresim = criarCresim(nome, "JARDINAGEM");
});

describe("Testes Energia", () => {

it("Deve não permitir que um Cresim ocupado durma", () => {
    estaOcupado.mockReturnValue(true);
    const { cresim: cresimAtualizado, tempo } = dormir(cresim, 10000);

    expect(tempo).toBe(0);
    expect(cresimAtualizado).toBe(cresim);
});

it("Deve validar o tempo de sono inválido", () => {
    const tempoDormidoInvalido = -5000;
    estaOcupado.mockReturnValue(false);
    const { cresim: cresimAtualizado, tempo } = dormir(
      cresim,
      tempoDormidoInvalido
    );

    expect(tempo).toBe(0);
    expect(cresimAtualizado.energia).toBe(cresim.energia);
});

it("Deve retornar 'false' se o Cresim não tiver energia suficiente para a ação", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 5;
    const custoEnergia = 10;
    const resultado = podeExecutarAcao(cresimClone, custoEnergia);

    expect(resultado).toBe(false);
});

it("Deve retornar 'true' e exibir a mensagem correta quando o Cresim estiver sem energia", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = CONSTANTES.ENERGIA_ZERADA;
    const resultado = estaSemEnergia(cresimClone);

    expect(resultado).toBe(true);
});

it("Deve retornar 'false' quando o Cresim tiver energia", () => {
    const cresim = {
      nome: "Julia",
      energia: 10,
    };
    const resultado = estaSemEnergia(cresim);

    expect(resultado).toBe(false);
});

it("Deve impedir o treino se a energia for insuficiente", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 3;
    const habilidade = "JOGOS";
    const { cresim: cresimAtualizado, tempo } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );

    expect(cresimAtualizado.energia).toBe(cresimClone.energia);
    expect(tempo).toBe(0);
});

it("Não deve alterar energia se já estiver no máximo", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = CONSTANTES.ENERGIA_MAXIMA;
    const tempoDormido = 10000;
    const { cresim: cresimAtualizado, tempo } = dormir(
      cresimClone,
      tempoDormido
    );

    expect(cresimAtualizado.energia).toBe(CONSTANTES.ENERGIA_MAXIMA);
    expect(tempo).toBe(0);
});

it("Não deve alterar energia se o tempo dormido for zero ou negativo", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 50;
    const tempoDormido = 0;
    const { cresim: cresimAtualizado, tempo } = dormir(
      cresimClone,
      tempoDormido
    );

    expect(cresimAtualizado.energia).toBe(cresimClone.energia);
    expect(tempo).toBe(0);
});

it("Deve permitir execução de ação se energia for suficiente", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 50;
    const custoEnergia = 30;
    const resultado = podeExecutarAcao(cresimClone, custoEnergia);

    expect(resultado).toBe(true);
 
});

it("Não deve permitir execução de ação se energia for insuficiente", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 20;
    const custoEnergia = 30;
    const resultado = podeExecutarAcao(cresimClone, custoEnergia);

    expect(resultado).toBe(false);
});

it("Deve impedir o trabalho caso a energia seja insuficiente", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 2;
    const emprego = empregos[0];
    const {
      cresim: cresimAtualizado,
      tempo,
      salario,
    } = trabalhar(cresimClone, emprego);

    expect(tempo).toBe(0);
    expect(salario).toBe(0);
    expect(cresimAtualizado.energia).toBe(cresimClone.energia);
});

it("Deve retornar tempo 0 se tempoDormido for exatamente 0", () => {
    const tempoDormidoZero = 0;
    estaOcupado.mockReturnValue(false);
    const { cresim: cresimAtualizado, tempo } = dormir(cresim, tempoDormidoZero);

    expect(tempo).toBe(0);
    expect(cresimAtualizado.energia).toBe(cresim.energia);
});

it("Deve retornar tempo 0 se tempoDormido for negativo", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 50;
    const tempoDormido = -1;
    const { cresim: cresimAtualizado, tempo } = dormir(
      cresimClone,
      tempoDormido
    );

    expect(tempo).toBe(0);
    expect(cresimAtualizado.energia).toBe(cresimClone.energia);
})

});