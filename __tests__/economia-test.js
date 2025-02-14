import { api } from "../src/api/api.js";
import { criarCresim } from "../src/services/cresim.js";
import { carregarCheats } from "../src/services/cheats.js";
import {
  adicionarCresceleons,
  removerCresceleons,
  temCresceleonsSuficientes,
} from "../src/services/economia.js";

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

describe("Testes Economia", () => { 

it("Não deve adicionar Cresceleons se o valor for menor ou igual a zero", () => {
    const valorInvalido = 0;
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    const cresimAntes = { ...cresimClone };
    
    const resultado = adicionarCresceleons(cresimClone, valorInvalido);
    
    expect(resultado).toEqual(cresimAntes);
});

it("Deve retornar o cresim sem alterações se o valor for menor ou igual a 0", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    const valorInvalido = -10;

    const cresimResultado = removerCresceleons(cresimClone, valorInvalido);

    expect(cresimResultado).toEqual(cresimClone);
});

it("Deve retornar o cresim sem alterações se não houver saldo suficiente", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.cresceleons = 50;
    const valorMaiorQueSaldo = 100;

    const cresimResultado = removerCresceleons(cresimClone, valorMaiorQueSaldo);

    expect(cresimResultado).toEqual(cresimClone);
});

it("Não deve permitir a compra se não houver Cresceleons suficientes", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.cresceleons = 100;
    const item = { nome: "Frigideira da Polishop", preco: 3200 };
    const cresimAtualizado = removerCresceleons(cresimClone, item.preco);

    expect(cresimAtualizado.cresceleons).toBe(cresimClone.cresceleons);
});

it("Não deve conseguir comprar o item se não houver Cresceleons suficientes", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.cresceleons = 100;
    const item = { nome: "Frigideira da Polishop", preco: 3200 };
    const podeComprar = temCresceleonsSuficientes(cresimClone, item.preco);
    const cresimAtualizado = podeComprar
      ? removerCresceleons(cresimClone, item.preco)
      : cresimClone;
      
    expect(podeComprar).toBe(false);
    expect(cresimAtualizado.cresceleons).toBe(cresimClone.cresceleons);
})
    
});