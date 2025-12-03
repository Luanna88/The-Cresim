import readline from "readline";
import { aplicarCheat, cheatsDisponiveis } from "../cheats.js";
import { updateLocalStorage } from "../cresim.js";

export const useQuestion = (pergunta, cresim = null) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(`${pergunta}\n> `, (resposta) => {
      rl.close();

      if (cresim) {
        const cheat = cheatsDisponiveis.find(
          (c) => c.codigo === resposta.toUpperCase()
        );
        if (cheat) {
          const { cresim: cresimAtualizado, aplicado } = aplicarCheat(cresim, cheat.codigo);
          if (aplicado) {
            updateLocalStorage(cresimAtualizado);
            console.log(`\n🤖 Cheat aplicado: ${cheat.codigo}`);
          }
          return resolve(""); 
        }
      }

      resolve(resposta);
    });
  });
};