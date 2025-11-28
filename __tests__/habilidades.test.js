import { comprarItem ,habilidades,treinar} from "../src/services/habilidades";

jest.useFakeTimers();

describe("Testes categoria Habilidades", () => {

 it("Deve validar ao tentar comprar um item de habilidade sem Cresceleons suficientes", () => {
  const cresim = {
    nome: "Luna",
    dinheiro: 500,
    itens: []
  };

  const item = {
    id: 2,
    nome: "Makita cortadora de cebola",
    preco: 1000
  };

  const resultado = comprarItem({ cresim, item });

  expect(resultado).toBeNull();
  expect(cresim.itens.length).toBe(0); 
  expect(cresim.dinheiro).toBe(500); 
});

 it("Deve conseguir concluir um ciclo de treino com habilidade que não é aspiração e receber os pontos corretamente ", () => {
    habilidades.length = 0; 
    habilidades.push({
      nome: "gastronomia",
      pontos: 0,
      nivel: "JÚNIOR"
    });

    const cresim = {
      energia: 20,
      aspiracao: "pintura" 
    };

    const item = {
      nome: "Panela elétrica mágica",
      pontos: 7
    };

    let resultadoCallback;

    treinar({
      nomeHabilidade: "gastronomia",
      itemUsado: item,
      cresim: cresim,
      callback: (resultado) => {
        resultadoCallback = resultado;
      }
    });

    jest.advanceTimersByTime(8000);

    expect(habilidades[0].pontos).toBe(7);
    expect(habilidades[0].nivel).toBe("JÚNIOR");
    expect(cresim.energia).toBe(16);

    expect(resultadoCallback).toBeDefined();
    expect(resultadoCallback.habilidade.pontos).toBe(7);
    expect(resultadoCallback.energia).toBe(16);
  });

  it("Deve conseguir concluir um ciclo de treino com habilidade que é sua aspiração e receber os pontos corretamente", () => {
  habilidades.length = 0;
  habilidades.push({
    nome: "gastronomia",
    pontos: 0,
    nivel: "JÚNIOR"
  });

  const cresim = {
    energia: 20,
    aspiracao: "gastronomia"
  };

  const item = {
    nome: "Frigideira da Polishop",
    pontos: 5
  };

  let callbackResultado = null;

  treinar({
    nomeHabilidade: "gastronomia",
    itemUsado: item,
    cresim,
    callback: (res) => {
      callbackResultado = res;
    }
  });

  jest.advanceTimersByTime(8000);

  expect(habilidades[0].pontos).toBe(6);
  expect(habilidades[0].nivel).toBe("JÚNIOR");
  expect(cresim.energia).toBe(16);

  expect(callbackResultado).toBeDefined();
  expect(callbackResultado.habilidade.pontos).toBe(6);
  expect(callbackResultado.energia).toBe(16);
});

it("Deve avançar o nivel de habilidade quando completar os pontos necessarios", () => {
  habilidades.length = 0;

  habilidades.push({
    nome: "pintura",
    pontos: 15,          
    nivel: "JÚNIOR"
  });

  const cresim = {
    energia: 20,
    aspiracao: "gastronomia" 
  };

  const item = {
    nome: "Tinta azul premium",
    pontos: 2              
  };

  let resultadoCallback;

  treinar({
    nomeHabilidade: "pintura",
    itemUsado: item,
    cresim,
    callback: (res) => {
      resultadoCallback = res;
    }
  });

  jest.advanceTimersByTime(8000);


  expect(habilidades[0].pontos).toBe(17);
  expect(habilidades[0].nivel).toBe("PLENO");

  expect(cresim.energia).toBe(16);

  expect(resultadoCallback).toBeDefined();
  expect(resultadoCallback.habilidade.nivel).toBe("PLENO");
  expect(resultadoCallback.habilidade.pontos).toBe(17);
});


});