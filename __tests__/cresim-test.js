import { criarCresim, atualizarCresim } from "../src/services/cresim.js";
import { CONSTANTES } from "../src/utils/constants.js";

jest.mock("../src/services/local-storage/use-local-storage.js");

describe("Cresim Service", () => {

it("Deve criar um novo Cresim com valores iniciais corretos", () => {
    const nome = "Julia";
    const aspiracao = "JARDINAGEM";
    const cresim = criarCresim(nome, aspiracao);

    expect(cresim.nome).toBe(nome);
    expect(cresim.aspiracao).toBe(aspiracao);
    expect(cresim.habilidades).toEqual({
      gastronomia: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      pintura: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      jogos: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      jardinagem: CONSTANTES.VALORES_INICIAIS_ZERADOS,
      musica: CONSTANTES.VALORES_INICIAIS_ZERADOS,
    });

    expect(cresim.cresceleons).toBe(CONSTANTES.CRESCELEONS_INICIAIS);
    expect(cresim.tempo).toBe(CONSTANTES.TEMPO_DE_VIDA_INICIAL);
    expect(cresim.energia).toBe(CONSTANTES.ENERGIA_INICIAL);
    expect(cresim.higiene).toBe(CONSTANTES.HIGIENE_MAXIMA);
    expect(cresim.relacionamento).toEqual([]);
    expect(cresim.pontosHabilidade).toBe(CONSTANTES.VALORES_INICIAIS_ZERADOS);
    expect(cresim.itens).toEqual([]);
});

it("Deve atualizar um Cresim com novos valores", () => {
    const cresim = criarCresim("Julia", "JARDINAGEM");
    const updates = { energia: 20, higiene: 15 };
    const cresimAtualizado = atualizarCresim(cresim, updates);

    expect(cresimAtualizado.energia).toBe(20);
    expect(cresimAtualizado.higiene).toBe(15);
})

});
