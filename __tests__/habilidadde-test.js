import { api } from "../src/api/api.js";
import { CONSTANTES } from "../src/utils/constants";
import { criarCresim } from "../src/services/cresim.js";
import {
  treinar,
  comprarItem,
  buscarItensHabilidades,
  buscarHabilidadePorIndex,
  obterNivelHabilidade,
} from "../src/services/habilidade.js";
import {podeExecutarAcaoHigiene} from "../src/services/higiene.js";
import { aplicarCheat, carregarCheats } from "../src/services/cheats.js";

jest.mock("../src/services/tempo.js", () => ({
  ...jest.requireActual("../src/services/tempo.js"),
  estaOcupado: jest.fn(),
}));

let cresim,
  itensHabilidades,
  cresimClone,
  cheatsDisponiveis;

beforeAll(async () => {
  itensHabilidades = await api.getItens();
  cheatsDisponiveis = await api.getCheats();
  carregarCheats(cheatsDisponiveis);
});

beforeEach(() => {
  const nome = "Julia";
  cresim = criarCresim(nome, "JARDINAGEM");
  cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
});

describe("Testes Habilidade", () => {

it("Deve retornar a habilidade correta quando a categoria for encontrada", () => {
    const idHabilidadeValida = 1;
    const resultado = buscarHabilidadePorIndex(0);

    expect(typeof resultado).toBe("object");
});

it("Deve retornar null quando a habilidade não for encontrada", async () => {
    const idHabilidadeInvalido = 999;
    const resultado = buscarHabilidadePorIndex(idHabilidadeInvalido);

    expect(resultado).toBeNull();
});

it("Deve retornar null se a categoria não existir", async () => {
    const habilidade = buscarHabilidadePorIndex(999);

    expect(habilidade).toBeNull();
});

it("Deve retornar null se não houver categoria válida", async () => {
    const habilidade = buscarHabilidadePorIndex(0);

    expect(habilidade).toBeNull();
});

it("Deve progredir para SENIOR ao atingir mais de 26 pontos", () => {
    const habilidade = "JARDINAGEM";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades[habilidade] = 26;
    cresimClone.itens.push(item);
    const { cresim: cresimAtualizado } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );
    const novoNivel = obterNivelHabilidade(
      cresimAtualizado.habilidades[habilidade]
    );

    expect(novoNivel).toBe("SENIOR");
});

it("Deve progredir para PLENO após treinar e alcançar 17 pontos", () => {
    const habilidade = "JARDINAGEM";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades[habilidade] = 16;
    cresimClone.itens.push(item);
    const { cresim: cresimAtualizado } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );
    const novoNivel = obterNivelHabilidade(
      cresimAtualizado.habilidades[habilidade]
    );

    expect(novoNivel).toBe("PLENO");
});

it("Deve começar como JUNIOR ao criar um Cresim", () => {
    const cloneCresim = criarCresim(cresim.nome, cresim.aspiracao);
    cloneCresim.habilidades.JARDINAGEM = 5;

    const nivel = obterNivelHabilidade(cloneCresim.habilidades.JARDINAGEM);

    expect(nivel).toBe("JUNIOR");
});

it("Deve retornar tempo 0 se a energia for insuficiente", () => {
    cresim.energia = CONSTANTES.ENERGIA_TREINO - 1;

    const resultado = treinar(cresim, "JARDINAGEM");

    expect(resultado.tempo).toBe(0);
    expect(resultado.cresim).toEqual(cresim);
});

it("Deve retornar { cresim, aplicado: false } quando a categoria do cheat for inválida", () => {
    const cheatInvalido = { codigo: "INVALIDO", categoria: "CATEGORIA_FAKE", valor: 100 };
    carregarCheats([cheatInvalido]);
    const resultado = aplicarCheat(cresimClone, "INVALIDO");
    
    expect(resultado).toEqual({ cresim: cresimClone, aplicado: false });
});

it("Deve retornar { cresim, aplicado: false } quando o código do cheat não existir", () => {
    const resultado = aplicarCheat(cresimClone, "CHEAT_INEXISTENTE");

    expect(resultado).toEqual({ cresim: cresimClone, aplicado: false });
});

it("Deve retornar 'true' quando a higiene for exatamente 1", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 1;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(true);
});

it("Deve retornar 'false' quando a higiene for negativa", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = -3;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(false);
});

it("Deve retornar 'false' quando a higiene for 0", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 0;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(false);
});

it("Deve retornar 'true' quando a higiene for maior que 0", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 5;

    expect(podeExecutarAcaoHigiene(cresimClone)).toBe(true);
});

it("Deve retornar os itens da habilidade correta quando a chave for válida", () => {
    const chaveValida = "JARDINAGEM";
    itensHabilidades = {
      JARDINAGEM: [
        { id: 1, nome: "Adubo de lixo orgânico", pontos: 2, preco: 1800 },
        { id: 2, nome: "Minhoca sapeca", pontos: 5, preco: 2600 },
        { id: 3, nome: "Composteira vegana", pontos: 9, preco: 3200 }
      ]
    };
    const resultado = buscarItensHabilidades(chaveValida);

    expect(resultado).toEqual([
      { id: 1, nome: "Adubo de lixo orgânico", pontos: 2, preco: 1800 },
      { id: 2, nome: "Minhoca sapeca", pontos: 5, preco: 2600 },
      { id: 3, nome: "Composteira vegana", pontos: 9, preco: 3200 }
    ]);
});

it("Deve retornar um array vazio quando a chave não for encontrada", () => {
    const chaveInvalida = "INEXISTENTE";
    const resultado = buscarItensHabilidades(chaveInvalida);

    expect(resultado).toEqual([]);
});

it("Deve adicionar um item à lista de itens do Cresim após compra", () => {
  const item = {
    nome: "Fórmula Secreta",
    preco: 500,
    tipo: "habilidade",
    habilidade: "JARDINAGEM",
  };
  cresim.itens = [];
  cresim.cresceleons = 1500;
  const cresimAtualizado = comprarItem(cresim, item);

  expect(cresimAtualizado.itens).toHaveLength(1);
  expect(cresimAtualizado.itens[0].nome).toBe(item.nome);
  expect(cresimAtualizado.cresceleons).toBe(1000);
});

it("Deve retornar o Cresim sem alterações se o item for null ou undefined", () => {
  const itemNull = null;
  const cresimAtualizadoNull = comprarItem(cresim, itemNull);
  expect(cresimAtualizadoNull).toBe(cresim);
  const itemUndefined = undefined;
  const cresimAtualizadoUndefined = comprarItem(cresim, itemUndefined);
  expect(cresimAtualizadoUndefined).toBe(cresim);
})

});