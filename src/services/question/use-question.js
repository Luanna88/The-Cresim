import readline from "readline";
import { processarCheat } from "../cheats.js";
import { updateLocalStorage, selecionarCresim } from "../local-storage/funcoes-menu.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

export const useQuestion = (str, cresimAtual) => {
  return new Promise((resolve) => {
    rl.question(`${str}\n> `, (result) => {
      
      const cresimCheat = processarCheat(result, cresimAtual);

      if (cresimCheat !== cresimAtual) {
        console.log("\n⚡ Cheat ativado!\n");

        updateLocalStorage(cresimCheat);
        selecionarCresim(cresimCheat.id);

        return resolve(null); 
      }

      resolve(result);
    });
  });
};

process.on("exit", () => rl.close());
