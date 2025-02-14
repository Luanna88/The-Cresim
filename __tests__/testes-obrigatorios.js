import { api } from "../src/api/api.js";
import { criarCresim } from "../src/services/cresim.js";
import {
    treinar,
    comprarItem,
    obterNivelHabilidade,
  } from "../src/services/habilidade.js";
import {
    reduzirEnergia,
    dormir,
  } from "../src/services/energia.js";
import { trabalhar } from "../src/services/trabalho.js";
import {tomarBanho} from "../src/services/higiene.js";
import { interagir } from "../src/services/relacionamento.js";
import { aplicarCheat, 
    carregarCheats } from "../src/services/cheats.js";

let cresim,
  itensHabilidades,
  empregos,
  interacoesDisponiveis,
  cheatsDisponiveis;

beforeAll(async () => {
  itensHabilidades = await api.getItens();
  empregos = await api.getEmpregos();
  interacoesDisponiveis = await api.getInteracoes();
  cheatsDisponiveis = await api.getCheats();
  carregarCheats(cheatsDisponiveis);
});

beforeEach(() => {
  const nome = "Julia";
  cresim = criarCresim(nome, "JARDINAGEM");
});

describe("Testes Obrigatórios", () => {
    
it("Deve conseguir criar um novo Cresim com nome, pontos de higiene e energia carregados e 1500 Cresceleons", () => {
    expect(cresim.nome).toBe("Julia");
    expect(cresim.higiene).toBe(28);
    expect(cresim.energia).toBe(32);
    expect(cresim.cresceleons).toBe(1500);
});

it("Deve conseguir atribuir uma aspiração ao Cresim", () => {
    expect(cresim.aspiracao).toBe("JARDINAGEM");
    });

it("Deve validar os pontos de energia do personagem para que não passem de 32 pontos", () => {
    cresim.energia = 30;
    const { cresim: cresimAtualizado } = dormir(cresim, 10000);
    
    expect(cresimAtualizado.energia).toBeLessThanOrEqual(32);
});

it("Deve validar os pontos de energia do personagem para que não fiquem negativados", async () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 5;

    const custoEnergia = 10;
    const { cresim: cresimAtualizado, sucesso } = reduzirEnergia(
      cresimClone,
      custoEnergia
    );

    expect(cresimAtualizado.energia).toBe(5);
    expect(sucesso).toBe(false);
});

it("Deve conseguir dormir e receber seus pontos de energia", async () => {
    cresim.energia = 5;

    const tempoDormido = 15000;
    const { cresim: cresimAtualizado, tempo } = dormir(cresim, tempoDormido);

    expect(cresimAtualizado.energia).toBeGreaterThan(cresim.energia);
    expect(cresimAtualizado.energia).toBeLessThanOrEqual(32);
    expect(tempo).toBe(tempoDormido);
});

it("Deve conseguir comprar um item de habilidade", () => {
    const habilidade = "MUSICA";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    
    cresimClone.cresceleons = item.preco + 500;
    
    const cresimAtualizado = comprarItem(cresimClone, item);
    
    expect(cresimAtualizado.cresceleons).toBe(cresimClone.cresceleons - item.preco);
    expect(cresimAtualizado.itens).toContainEqual(item);
});

it("Deve validar ao tentar comprar um item de habilidade sem Cresceleons suficientes", () => {
    const habilidade = "MUSICA";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.cresceleons = item.preco - 500;
    const cresimAtualizado = comprarItem(cresimClone, item);
   
    expect(cresimAtualizado.cresceleons).toBe(cresimClone.cresceleons);
    expect(cresimAtualizado.itens).not.toContainEqual(item);
});

it("Deve conseguir concluir um ciclo de treino com habilidade que não é aspiração e receber os pontos corretamente", () => {
    const habilidade = "JOGOS";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades = { JOGOS: 5 };
    cresimClone.itens = [item];
    const { cresim: cresimAtualizado, tempo } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );
    expect(tempo).toBe(8000);
    expect(cresimAtualizado.habilidades[habilidade]).toBe(7);
    expect(cresimAtualizado.pontosHabilidade).toBe(2);
});

it("Deve conseguir concluir um ciclo de treino com habilidade que é sua aspiração e receber os pontos corretamente", () => {
    const habilidade = "JOGOS";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades = { JOGOS: 5 };
    cresimClone.itens = [item];
    cresimClone.aspiracao = "JOGOS";
    const { cresim: cresimAtualizado, tempo } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );
    expect(tempo).toBe(8000);
    expect(cresimAtualizado.habilidades[habilidade]).toBe(8);
    expect(cresimAtualizado.pontosHabilidade).toBe(3);
});

it("Deve perder pontos de energia ao terminar um ciclo de treino", () => {
    const habilidade = "JOGOS";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades = { JOGOS: 5 };
    cresimClone.itens = [item];
    const { cresim: cresimAtualizado } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );
    expect(cresimAtualizado.energia).toBe(cresimClone.energia - 4);
});

it("Deve perder pontos de higiene ao terminar um ciclo de treino", () => {
    const habilidade = "JOGOS";
    const item = itensHabilidades[habilidade][0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 10;
    cresimClone.habilidades = { JOGOS: 5 };
    cresimClone.itens = [item];
    const { cresim: cresimAtualizado } = treinar(
      cresimClone,
      habilidade,
      itensHabilidades
    );
    expect(cresimAtualizado.higiene).toBeLessThan(cresimClone.higiene);
});

it("Deve avançar o nível de habilidade quando completar os pontos necessários", () => {
    const habilidade = "JOGOS";
    const item = itensHabilidades[habilidade][0];
    let cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades = { JOGOS: 5 };
    cresimClone.itens = [item];
    cresimClone.pontosHabilidade = 15;
    while (cresimClone.habilidades[habilidade] < 17) {
      const resultado = treinar(cresimClone, habilidade, itensHabilidades);
      cresimClone = resultado.cresim;
    }
    const nivelHabilidade = obterNivelHabilidade(
      cresimClone.habilidades[habilidade]
    );
    expect(nivelHabilidade).toBe("PLENO");
});

it("Deve perder pontos de energia ao trabalhar uma jornada padrão", () => {
    const emprego = empregos[1];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    const energiaInicial = cresimClone.energia;
    const { cresim: cresimAtualizado } = trabalhar(cresimClone, emprego);
    const energiaEsperada = energiaInicial - (emprego.custoEnergia || 10);
    expect(cresimAtualizado.energia).toBeLessThan(energiaInicial);
    expect(cresimAtualizado.energia).toBe(energiaEsperada);
});

it("Deve receber o salario do dia ao trabalhar uma jornda padrão", () => {
    const emprego = empregos[0];
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades[emprego.categoria] = 10;
    const nivel = obterNivelHabilidade(
      cresimClone.habilidades[emprego.categoria]
    );
    const salarioEsperado =
      emprego.salario.find((s) => s.nivel === nivel)?.valor || 0;
    const { salario } = trabalhar(cresimClone, emprego);
    expect(salario).toBe(salarioEsperado);
});

it("Deve receber o salário equivalente quando começar a trabalhar com os pontos de energia menores que 10", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 8;
    const emprego = empregos[0];
    const { salario, cresim: cresimAtualizado } = trabalhar(
      cresimClone,
      emprego
    );
    const nivel = obterNivelHabilidade(
      cresimClone.habilidades[emprego.categoria]
    );
    const salarioEsperado =
      emprego.salario.find((s) => s.nivel === nivel)?.valor || 0;
    expect(salario).toBeGreaterThan(0);
    expect(salario).toBeLessThanOrEqual(salarioEsperado);
    expect(cresimAtualizado.energia).toBeLessThan(cresimClone.energia);
});

it("Deve ajustar o salário ao trabalhar com energia baixa e higiene menor que 4", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 5;
    cresimClone.higiene = 3;
    const { salario, cresim: cresimAtualizado } = trabalhar(
      cresimClone,
      empregos[2]
    );
    expect(salario).toBeGreaterThan(0);
    expect(cresimAtualizado.energia).toBeLessThan(cresimClone.energia);
    expect(cresimAtualizado.higiene).toBeLessThan(cresimClone.higiene);
});

it("Deve validar para que o Cresim não consiga começar a trabalhar com os pontos de energia menores que 4", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 3;
    const emprego = empregos[1];
    const {
      cresim: cresimAtualizado,
      tempo,
      salario,
    } = trabalhar(cresimClone, emprego);
    expect(tempo).toBe(0);
    expect(salario).toBe(0);
    expect(cresimAtualizado.energia).toBe(cresimClone.energia);
    expect(cresimAtualizado.higiene).toBe(cresimClone.higiene);
});

it("Deve descontar 10 Cresceleons ao tomar banho", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.higiene = 20;
    const { cresim: cresimAtualizado } = tomarBanho(cresimClone);
    expect(cresimAtualizado.cresceleons).toBe(cresimClone.cresceleons - 10);
    expect(cresimAtualizado.higiene).toBeGreaterThan(cresimClone.higiene);
});

it("Deve evoluir o relacionamento de dois Cresims para AMIZADE", () => {
    let cresim1 = criarCresim("Julia", "JARDINAGEM");
    let cresim2 = criarCresim("Carlos", "CULINÁRIA");
    expect(cresim1.relacionamento.some((r) => r.nome === "Carlos")).toBe(false);
    expect(cresim2.relacionamento.some((r) => r.nome === "Julia")).toBe(false);
    const interacoes = ["Elogiar", "Conversar", "Elogiar", "Piada"];
    interacoes.forEach((tipoInteracao) => {
      const resultado = interagir(
        cresim1,
        cresim2,
        tipoInteracao,
        interacoesDisponiveis
      );
      cresim1 = resultado.cresim;
      cresim2 = resultado.outroCresim;
    });
    const relacaoFinal = cresim1.relacionamento.find(
      (r) => r.nome === "Carlos"
    );
    expect(relacaoFinal).toBeDefined();
    expect(relacaoFinal.nivel).toBe("AMIZADE");
});

it("Deve recuar o relacionamento de dois Cresims para INIMIZADE", () => {
    let cresim1 = criarCresim("Julia", "JARDINAGEM");
    let cresim2 = criarCresim("Carlos", "CULINÁRIA");
    expect(cresim1.relacionamento.some((r) => r.nome === "Carlos")).toBe(false);
    expect(cresim2.relacionamento.some((r) => r.nome === "Julia")).toBe(false);
    const interacoes = ["Criticar"];
    interacoes.forEach((tipoInteracao) => {
      const resultado = interagir(
        cresim1,
        cresim2,
        tipoInteracao,
        interacoesDisponiveis
      );
      cresim1 = resultado.cresim;
      cresim2 = resultado.outroCresim;
    });
    const relacaoFinal = cresim1.relacionamento.find(
      (r) => r.nome === "Carlos"
    );
    expect(relacaoFinal).toBeDefined();
    expect(relacaoFinal.nivel).toBe("INIMIZADE");
});

it("Deve descontar os pontos de energia em uma interação entre dois Cresims", () => {
    let cresim1 = criarCresim("Julia", "JARDINAGEM");
    let cresim2 = criarCresim("Carlos", "CULINÁRIA");
    const tipoInteracao = "Conversar";
    const interacao = interacoesDisponiveis.NEUTRO.find(
      (i) => i.interacao === tipoInteracao
    );
    expect(interacao).toBeDefined();
    const energiaInicialCresim1 = cresim1.energia;
    const energiaInicialCresim2 = cresim2.energia;
    const { cresim: cresim1Atualizado, outroCresim: cresim2Atualizado } =
      interagir(cresim1, cresim2, tipoInteracao, interacoesDisponiveis);
    expect(cresim1Atualizado.energia).toBe(
      energiaInicialCresim1 - interacao.energia
    );
    expect(cresim2Atualizado.energia).toBe(
      energiaInicialCresim2 - Math.ceil(interacao.energia / 2)
    );
});

it("Deve conseguir aplicar o cheat SORTENAVIDA e receber as recompensas", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    const emprego = empregos[0];
    cresimClone.habilidades[emprego.categoria.toLowerCase()] = 20;
    const nivel = obterNivelHabilidade(
      cresimClone.habilidades[emprego.categoria.toLowerCase()]
    );
    const salarioBase =
      emprego.salario.find((s) => s.nivel === nivel)?.valor || 0;
    const { salario: salarioAntesCheat } = trabalhar(cresimClone, emprego);
    const { cresim: cresimComCheat, aplicado } = aplicarCheat(
      cresimClone,
      "SORTENAVIDA"
    );
    expect(aplicado).toBe(true);
    const novoSalarioEsperado = salarioAntesCheat * 1.1;
    const { salario: salarioDepoisCheat } = trabalhar(cresimComCheat, emprego);
    expect(salarioDepoisCheat).toBeCloseTo(novoSalarioEsperado, 2);
});

it("Deve conseguir aplicar o cheat DEITADONAREDE e receber as recompensas", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.energia = 25;
    const { cresim: cresimAtualizado, aplicado } = aplicarCheat(
      cresimClone,
      "DEITADONAREDE"
    );
    expect(aplicado).toBe(true);
    const energiaEsperada = Math.min(cresimClone.energia + 5, 30);
    expect(cresimAtualizado.energia).toBe(energiaEsperada);
});

it("Deve conseguir aplicar o cheat JUNIM e aumentar a habilidade escolhida", () => {
    const habilidade = "JOGOS";
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.habilidades[habilidade] = 10;
    const { cresim: cresimAtualizado, aplicado } = aplicarCheat(
      cresimClone,
      "JUNIM",
      habilidade
    );
    expect(aplicado).toBe(true);
    const habilidadeEsperada = cresimClone.habilidades[habilidade] + 5;
    expect(cresimAtualizado.habilidades[habilidade]).toBe(habilidadeEsperada);
});

it("Deve aplicar o cheat CAROLINAS e aumentar o tempo do Cresim", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.tempo = 500000;
    const { cresim: cresimAtualizado, aplicado } = aplicarCheat(
      cresimClone,
      "CAROLINAS"
    );
    const novoTempoEsperado = cresimClone.tempo + 100000;
    expect(aplicado).toBe(true);
    expect(cresimAtualizado.tempo).toBe(novoTempoEsperado);
});

it("Deve conseguir aplicar o cheat SINUSITE e ter a vida zerada", () => {
    const cresimClone = criarCresim(cresim.nome, cresim.aspiracao);
    cresimClone.tempo = 500000;
    const { cresim: cresimAtualizado, aplicado } = aplicarCheat(
      cresimClone,
      "SINUSITE"
    );
    expect(aplicado).toBe(true);
    expect(cresimAtualizado.morto).toBe(true);
    expect(cresimAtualizado.tempo).toBe(0);
})
});