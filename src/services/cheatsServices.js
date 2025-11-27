export const CHEATS = {
  SORTENAVIDA: "SORTENAVIDA",
  DEITADONAREDE: "DEITADONAREDE",
  TERAPIA: "TERAPIA",
  DESODORANTE: "DESODORANTE",
  WHEYPROTEIN: "WHEYPROTEIN",
  SINUSITE: "SINUSITE",
};

export function processarCheat(comando, crescim) {
  if (!comando || typeof comando !== "string") return;
  if (!crescim) {
    console.warn("Nenhum Cresim selecionado. Cheat ignorado.");
    return;
  }

  const cheat = comando.trim().toUpperCase();

  switch (cheat) {
    case CHEATS.SORTENAVIDA:
      crescim.cresceleons += 1000;
      console.log("💰 Cheat ativado: +1000 cresceleons!");
      break;

    case CHEATS.DEITADONAREDE:
      crescim.energia += 10;
      console.log("🔋 Cheat ativado: +10 energia!");
      break;

    case CHEATS.TERAPIA:
      if (Array.isArray(crescim.relacionamentos)) {
        crescim.relacionamentos = crescim.relacionamentos.map((r) => ({
          ...r,
          pontos: r.pontos + 5,
        }));
      }
      console.log("❤️ Cheat ativado: +5 relacionamento com todos!");
      break;

    case CHEATS.DESODORANTE:
      crescim.higiene += 15;
      console.log("🚿 Cheat ativado: +15 higiene!");
      break;

    case CHEATS.WHEYPROTEIN:
      crescim.vida += 100000;
      console.log("💪 Cheat ativado: +100.000ms de vida!");
      break;

    case CHEATS.SINUSITE:
      crescim.vida = 0;
      console.log("💀 Cheat ativado: vida zerada!");
      break;

    default:
      console.warn("Cheat não reconhecido:", comando);
  }

  return crescim;
}
