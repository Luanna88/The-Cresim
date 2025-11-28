import { buscarHabilidades } from "../api/api.js";
import { CONSTANTES } from "../utils/constantes.js";
import { atualizarCresim } from "../services/cresim.js";
import { temCresceleonsSuficientes } from "../services/economia.js";

export let habilidades = [];

const NIVEIS = {
  JUNIOR: { nome: "JÚNIOR", minimo: 0, maximo: 16 },
  PLENO:  { nome: "PLENO",  minimo: 17, maximo: 26 },
  SENIOR: { nome: "SÊNIOR", minimo: 27 }
};

export async function carregarHabilidades() {
  const dados = await buscarHabilidades();

  habilidades = dados.map((item) => ({
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    pontos: 0,
    nivel: "JÚNIOR",
  }));

  return habilidades;
}

export function calcularNivel(pontos) {
  if (pontos <= NIVEIS.JUNIOR.maximo) return "JÚNIOR";
  if (pontos <= NIVEIS.PLENO.maximo) return "PLENO";
  return "SÊNIOR";
}

export function getHabilidade(nome) {
  return habilidades.find((h) => h.nome === nome);
}

export function comprarItem({ cresim, item }) {
  if (!cresim || !item) return null;

  if (!Array.isArray(cresim.itens)) {
    cresim.itens = [];
  }

  const jaTem = cresim.itens.some((i) => i.id === item.id);
  if (jaTem) return null;

  if (!temCresceleonsSuficientes(cresim, item.preco)) return null;

  cresim.dinheiro -= item.preco;

  cresim.itens.push(item);

  return { ...cresim, itens: [...cresim.itens] };
}

export function treinar({
  nomeHabilidade,
  itemUsado,
  cresim,
  callback = () => {},
}) {
  const habilidade = getHabilidade(nomeHabilidade);
  if (!habilidade) return;

  if (cresim.energia < CONSTANTES.ENERGIA_TREINO) {
    callback({ erro: "Sem energia suficiente!" });
    return;
  }

  const ganhoBase = itemUsado?.pontos ?? CONSTANTES.GANHO_PONTOS_HABILIDADE;

  setTimeout(() => {
    let ganho = ganhoBase;

    if (cresim.aspiracao === habilidade.nome) {
      ganho += 1;
    }

    habilidade.pontos += ganho;
    habilidade.nivel = calcularNivel(habilidade.pontos);

    cresim.energia = Math.max(0, cresim.energia - CONSTANTES.ENERGIA_TREINO);

    atualizarCresim(cresim, { energia: cresim.energia });

    callback({
      habilidade: { ...habilidade },
      energia: cresim.energia
    });
  }, CONSTANTES.CICLO_TEMPO_TREINO);
}
