import { comprarItem ,habilidades,treinar} from "../src/services/habilidadeServices";

jest.useFakeTimers();

describe("Testes categoria Habilidades", () => {
  
it("Deve conseguir comprar um item de habilidade", () => {
    const crescim = {
      nome: "Luna",
      dinheiro: 1500,
      itens: []
    };

    const item = {
      id: 1,
      nome: "Lápis mordido",
      preco: 1200
    };

    const comprado = comprarItem({ crescim, item });

    expect(comprado).not.toBeNull();      
    expect(crescim.itens.length).toBe(1); 
    expect(crescim.dinheiro).toBe(300); 
    expect(crescim.itens[0]).toEqual(item);
  });

 it("Deve validar ao tentar comprar um item de habilidade sem Cresceleons suficientes", () => {
  const crescim = {
    nome: "Luna",
    dinheiro: 500,
    itens: []
  };

  const item = {
    id: 2,
    nome: "Makita cortadora de cebola",
    preco: 1000
  };

  const resultado = comprarItem({ crescim, item });

  expect(resultado).toBeNull();
  expect(crescim.itens.length).toBe(0); 
  expect(crescim.dinheiro).toBe(500); 
});

 it("Deve concluir ciclo de treino sem aspiração e receber pontos corretamenteDeve conseguir concluir um ciclo de treino com habilidade que não é aspiração e receber os pontos corretamente", () => {
    habilidades.length = 0; 
    habilidades.push({
      nome: "gastronomia",
      pontos: 0,
      nivel: "JÚNIOR"
    });

    const crescim = {
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
      crescim: crescim,
      callback: (resultado) => {
        resultadoCallback = resultado;
      }
    });

    jest.advanceTimersByTime(8000);

    expect(habilidades[0].pontos).toBe(7);
    expect(habilidades[0].nivel).toBe("JÚNIOR");
    expect(crescim.energia).toBe(16);

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

  const crescim = {
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
    crescim,
    callback: (res) => {
      callbackResultado = res;
    }
  });

  jest.advanceTimersByTime(8000);

  expect(habilidades[0].pontos).toBe(6);
  expect(habilidades[0].nivel).toBe("JÚNIOR");
  expect(crescim.energia).toBe(16);

  expect(callbackResultado).toBeDefined();
  expect(callbackResultado.habilidade.pontos).toBe(6);
  expect(callbackResultado.energia).toBe(16);
});

});