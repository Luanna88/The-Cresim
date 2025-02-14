import { api } from "../src/api/api.js";
import { CONSTANTES } from "../src/utils/constants";
import { criarCresim } from "../src/services/cresim.js";
import {carregarCheats } from "../src/services/cheats.js";
import { estaOcupado } from "../src/services/tempo.js";
import { trabalhar,  obterNivelHabilidade} from "../src/services/trabalho.js";
import { reduzirEnergia } from "../src/services/energia.js";

jest.mock("../src/services/tempo.js", () => ({
    ...jest.requireActual("../src/services/tempo.js"),
    estaOcupado: jest.fn(),
  }));

jest.mock("../src/services/energia.js", () => ({
    reduzirEnergia: jest.fn(),
  }));

  let cresim,
    empregos,
    cheatsDisponiveis;
  
  beforeAll(async () => {
    empregos = await api.getEmpregos();
    cheatsDisponiveis = await api.getCheats();
    carregarCheats(cheatsDisponiveis);
  });
  
  beforeEach(() => {
    const nome = "Julia";
    cresim = criarCresim(nome, "JARDINAGEM");
  });
  
describe("Testes The-Cresims", () => {
    
it("Deve retornar tempo 0 e salário 0 quando o Cresim estiver ocupado", () => {
    estaOcupado.mockReturnValue(true);
    const resultado = trabalhar(cresim, empregos[0]);

    expect(resultado.tempo).toBe(0);
    expect(resultado.salario).toBe(0);
    expect(resultado.cresim).toBe(cresim);
});

it("Deve retornar undefined se o nível do emprego não for encontrado", () => {
    const empregosDisponiveis = empregos;
    const emprego = empregosDisponiveis[0];
    const nivelInexistente = "EXPERT";
    const salarioBase =
      emprego.salario.find((s) => s.nivel === nivelInexistente)?.valor || 0;

    expect(salarioBase).toBe(0);
});

it("Deve retornar 'JUNIOR' quando os pontos forem menores ou iguais a CONSTANTES.PONTUACAO_JUNIOR", () => {
    const cresim = { habilidades: { JARDINAGEM: CONSTANTES.PONTUACAO_JUNIOR } };
    const resultado = obterNivelHabilidade(cresim, "JARDINAGEM");
    expect(resultado).toBe("JUNIOR");
  });

it("Deve retornar 'JUNIOR' quando a categoria não existir nas habilidades", () => {
  const cresim = { habilidades: {} };
  expect(obterNivelHabilidade(cresim, "programacao")).toBe("JUNIOR");
});

it("Deve retornar o salário correto quando o nível do Cresim for encontrado", () => {
  const emprego = empregos[0]; 
  const nivel = obterNivelHabilidade(cresim, emprego.categoria);
  const salarioEsperado = emprego.salario.find((s) => s.nivel === nivel)?.valor || 0;
    
  expect(salarioEsperado).toBeGreaterThan(0);
});

it("Deve retornar tempo 0 e salário 0 quando reduzirEnergia falhar", () => {
  const emprego = {
    categoria: "JARDINAGEM",
    salario: [{ nivel: "JUNIOR", valor: 100 }],
  };
  const cresim = {
    energia: 10,
    habilidades: { JARDINAGEM: 5 },
  };
  reduzirEnergia.mockReturnValue({ sucesso: false });
  const resultado = trabalhar(cresim, emprego);

  expect(resultado.tempo).toBe(0);
  expect(resultado.salario).toBe(0);
  expect(resultado.cresim).toBe(cresim);
})

});