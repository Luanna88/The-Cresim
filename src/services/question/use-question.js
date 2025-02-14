import readline from "readline";
import { aplicarCheat, cheatsDisponiveis } from "../cheats.js";
import { updateLocalStorage, selecionarCresim } from "../cresim.js";

export const useQuestion = (str) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    rl.question(`${str}\n`, (result) => {
      rl.close();
      const cheat = cheatsDisponiveis.find((c) => c.codigo === result);
      if (cheat) {
        const { cresim: cresimAtualizado } = aplicarCheat(cheat.codigo);
        updateLocalStorage(cresimAtualizado);
        selecionarCresim(cresimAtualizado.id);
        console.log("Cheat aplicado:", cheat.descricao);
      }
      resolve(result);
    });
  });
