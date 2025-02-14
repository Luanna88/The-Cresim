import { api } from "../src/api/api.js";
import { criarCresim } from "../src/services/cresim.js";
import { interagir,obterInteracao ,obterInteracoesDisponiveis} from "../src/services/relacionamento.js";
import { carregarCheats } from "../src/services/cheats.js";
import { estaOcupado } from "../src/services/tempo.js";

jest.mock("../src/services/tempo.js", () => ({
    ...jest.requireActual("../src/services/tempo.js"),
    estaOcupado: jest.fn(),
  }));

let cresim,
  interacoesDisponiveis,
  cheatsDisponiveis;

beforeAll(async () => {
  interacoesDisponiveis = await api.getInteracoes();
  cheatsDisponiveis = await api.getCheats();
  carregarCheats(cheatsDisponiveis);
});

beforeEach(() => {
  const nome = "Julia";
  cresim = criarCresim(nome, "JARDINAGEM");
});

describe("Testes Relacionamento", () => {

it("Deve evoluir o relacionamento de dois Cresims de AMIZADE para AMOR usando apenas interações válidas", () => {
    let cresim1 = criarCresim("Julia", "JARDINAGEM");
    let cresim2 = criarCresim("Carlos", "CULINÁRIA");
    
    cresim1.relacionamento.push({
        nome: "Carlos",
        pontos: 18,
        nivel: "AMIZADE",
    });
    cresim2.relacionamento.push({
        nome: "Julia",
        pontos: 18,
        nivel: "AMIZADE",
    });
    
    let relacaoInicial = cresim1.relacionamento.find(
        (r) => r.nome === "Carlos"
    );
    expect(relacaoInicial).toBeDefined();
    expect(relacaoInicial.nivel).toBe("AMIZADE");
    
    const interacoesAmizade = [
        "Abraçar",
        "Ficar orgulhoso",
        "Comemorar",
        "Fazer um favor",
    ];
    
    interacoesAmizade.forEach((tipoInteracao) => {
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
    expect(relacaoFinal.nivel).toBe("AMOR");
});

it("Deve retornar tempo 0 quando um ou ambos os Cresims estiverem ocupados", () => {
    const cresimClone1 = criarCresim("Julia", "JARDINAGEM");
    const cresimClone2 = criarCresim("Carlos", "JARDINAGEM");
    estaOcupado.mockImplementationOnce(() => true);
    estaOcupado.mockImplementationOnce(() => true);
    const resultado = interagir(
      cresimClone1,
      cresimClone2,
      "amizade",
      interacoesDisponiveis
    );

    expect(resultado.tempo).toBe(0);
    expect(resultado.cresim).toBe(cresimClone1);
    expect(resultado.outroCresim).toBe(cresimClone2);
});

it("Deve retornar tempo 0 quando ambos os Cresims estiverem ocupados", () => {
    const cresimClone1 = criarCresim("Julia", "JARDINAGEM");
    const cresimClone2 = criarCresim("Carlos", "JARDINAGEM");
    estaOcupado.mockImplementationOnce(() => false);
    estaOcupado.mockImplementationOnce(() => false);

    const resultado = interagir(
      cresimClone1,
      cresimClone2,
      "amizade",
      interacoesDisponiveis
    );

    expect(resultado.tempo).toBe(0);
    expect(resultado.cresim).toBe(cresimClone1);
    expect(resultado.outroCresim).toBe(cresimClone2);
});

it("Deve retornar o objeto com tempo 0 quando a interação não for encontrada", () => {
    const tipoInteracao = "interacaoInexistente";
    const interacoesDisponiveis = {
      amizade: [{ interacao: "amizade", energia: 10, pontos: 5 }],
    };
    const resultado = interagir(
      cresim,
      cresim,
      tipoInteracao,
      interacoesDisponiveis
    );
    expect(resultado).toEqual({ cresim, outroCresim: cresim, tempo: 0 });
});

it("Deve retornar o objeto com tempo 0 quando o Cresim estiver ocupado", () => {
    estaOcupado.mockReturnValue(true);
    const tipoInteracao = "amizade";
    const interacoesDisponiveis = {
      amizade: [{ interacao: "amizade", energia: 10, pontos: 5 }],
    };
    const resultado = interagir(
      cresim,
      cresim,
      tipoInteracao,
      interacoesDisponiveis
    );
    expect(resultado).toEqual({ cresim, outroCresim: cresim, tempo: 0 });
});

it("Deve retornar null quando não encontrar a interação solicitada", () => {
    const interacoesDisponiveis = {
      categoria1: [
        { interacao: "interacao1", energia: 5, pontos: 10 },
        { interacao: "interacao2", energia: 3, pontos: 5 },
      ],
      categoria2: [{ interacao: "interacao3", energia: 4, pontos: 7 }],
    };
    const interacao = obterInteracao("interacaoInexistente");
    expect(interacao).toBeNull();
});

it("Deve retornar tempo 0 quando apenas um dos Cresims estiver ocupado", () => {
  const cresimClone1 = criarCresim("Julia", "JARDINAGEM");
  const cresimClone2 = criarCresim("Carlos", "JARDINAGEM");
  estaOcupado.mockImplementationOnce(() => true);
  estaOcupado.mockImplementationOnce(() => false);
  const resultado = interagir(
    cresimClone1,
    cresimClone2,
    "amizade",
    interacoesDisponiveis
  );
  expect(resultado.tempo).toBe(0);
  expect(resultado.cresim).toBe(cresimClone1);
  expect(resultado.outroCresim).toBe(cresimClone2);
});

it("Deve retornar as interações disponíveis corretamente", () => {
    const interacoesTestadas = {
        AMIZADE: [
            { id: 1, interacao: "Abraçar", energia: 1, pontos: 3 },
            { id: 2, interacao: "Ficar orgulhoso", energia: 1, pontos: 2 },
            { id: 3, interacao: "Comemorar", energia: 2, pontos: 2 },
            { id: 4, interacao: "Fazer um favor", energia: 3, pontos: 4 },
        ],
        AMOR: [
            { id: 1, interacao: "Beijar", energia: 2, pontos: 3 },
            { id: 2, interacao: "Fazer carinho", energia: 1, pontos: 1 },
            { id: 3, interacao: "Abraçar romanticamente", energia: 1, pontos: 2 },
        ],
        INIMIZADE: [
            { id: 1, interacao: "Gritar", energia: 2, pontos: -4 },
            { id: 2, interacao: "Bater", energia: 4, pontos: -8 },
            { id: 3, interacao: "Discutir", energia: 2, pontos: -4 },
            { id: 4, interacao: "Ridicularizar", energia: 2, pontos: -6 },
        ],
        NEUTRO: [
            { id: 1, interacao: "Cumprimentar", energia: 0, pontos: 1 },
            { id: 2, interacao: "Dar uma dica", energia: 1, pontos: 1 },
            { id: 3, interacao: "Elogiar", energia: 1, pontos: 4 },
            { id: 4, interacao: "Conversar", energia: 2, pontos: 2 },
            { id: 5, interacao: "Piada", energia: 1, pontos: 2 },
            { id: 6, interacao: "Criticar", energia: 2, pontos: -3 },
            { id: 7, interacao: "Falar sobre politica", energia: 2, pontos: -2 },
            { id: 8, interacao: "Reclamar", energia: 2, pontos: -2 },
            { id: 9, interacao: "Ignorar", energia: 0, pontos: -1 },
        ],
    };
    interacoesDisponiveis = interacoesTestadas;

    const resultado = obterInteracoesDisponiveis();

    expect(resultado).toEqual(interacoesTestadas);
})

});