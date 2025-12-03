import { api } from "../api/api.js";
import { CONSTANTES } from "../utils/constantes.js";
import { atualizarCresim } from "../services/cresim.js";
import { temCresceleonsSuficientes } from "../services/economia.js";

let itensHabilidades = [];
let habilidades = [];

const NIVEIS = {
  JUNIOR: { nome: "JÚNIOR", maximo: 16 },
  PLENO:  { nome: "PLENO",  maximo: 26 },
  SENIOR: { nome: "SÊNIOR" }
};

// Carrega habilidades e itens da API
const carregarHabilidades = async () => {
  const dados = await api.getItensHabilidades();
  if (!dados) return [];

  // Transformar o JSON em array de itens com campo "habilidade"
  itensHabilidades = Object.entries(dados).flatMap(([habilidade, itens]) =>
    itens.map(i => ({ ...i, habilidade })) // adiciona o campo habilidade
  );

  const nomes = [...new Set(itensHabilidades.map(i => i.habilidade))];

  habilidades = nomes.map(nome => ({
    nome,
    pontos: 0,
    nivel: "JÚNIOR",
    itens: itensHabilidades.filter(i => i.habilidade === nome)
  }));

  return habilidades;
};


// Inicializa carregando habilidades
carregarHabilidades().catch(() => {});

// Obter nível da habilidade baseado nos pontos
const obterNivelHabilidade = (pontos) => {
  if (pontos <= NIVEIS.JUNIOR.maximo) return "JÚNIOR";
  if (pontos <= NIVEIS.PLENO.maximo) return "PLENO";
  return "SÊNIOR";
};

const getHabilidade = (nome) => habilidades.find(h => h.nome === nome);

// Comprar item e adicionar na habilidade do Cresim
const comprarItem = ({ cresim, item }) => {
  if (!cresim || !item) return null;
  if (!Array.isArray(cresim.itens)) cresim.itens = [];
  if (cresim.itens.some(i => i.id === item.id)) return null;
  if (!temCresceleonsSuficientes(cresim, item.preco)) return null;

  // Adiciona item ao inventário do Cresim
  const atualizado = atualizarCresim(cresim, {
    cresceleons: cresim.cresceleons - item.preco,
    itens: [...cresim.itens, item]
  });

  // Adiciona item à habilidade correspondente
  if (!atualizado.habilidades[item.habilidade]) {
    atualizado.habilidades[item.habilidade] = { pontos: 0, nivel: "JÚNIOR", itens: [] };
  }

  if (!Array.isArray(atualizado.habilidades[item.habilidade].itens)) {
    atualizado.habilidades[item.habilidade].itens = [];
  }

  atualizado.habilidades[item.habilidade].itens.push(item);

  return atualizado;
};

// Treinar habilidade usando um item
const treinar = ({ nomeHabilidade, itemUsado, cresim }) => {
  return new Promise((resolve, reject) => {
    if (!cresim || !nomeHabilidade) return reject("Cresim ou habilidade inválida");

    const habilidade = cresim.habilidades[nomeHabilidade];
    if (!habilidade) return reject("Habilidade não encontrada");

    const ENERGIA_TREINO = 4;
    const TEMPO_TREINO = 8000;
    const ganhoBase = itemUsado?.pontos ?? 1;

    if (cresim.energia < ENERGIA_TREINO) return reject("Sem energia suficiente");

    setTimeout(() => {
      let ganho = ganhoBase;
      if (cresim.aspiracao === nomeHabilidade) ganho += 1;

      habilidade.pontos += ganho;
      habilidade.nivel = obterNivelHabilidade(habilidade.pontos);

      // Atualiza Cresim
      cresim.energia = Math.max(0, cresim.energia - ENERGIA_TREINO);
      cresim.higiene = Math.max(0, (cresim.higiene || 30) - 2);
      cresim.tempo = Math.max(0, cresim.tempo - TEMPO_TREINO);

      // Atualiza pontos de habilidade total
      cresim.pontosHabilidade = Object.values(cresim.habilidades)
        .reduce((t, h) => t + h.pontos, 0);

      resolve(cresim);
    }, TEMPO_TREINO);
  });
};



// Função auxiliar para exibir itens de uma habilidade
const listarItensHabilidade = (cresim, nomeHabilidade) => {
  const habilidade = cresim.habilidades[nomeHabilidade];
  if (!habilidade) return [];

  return habilidade.itens?.map(i => ({
    ...i,
    possui: cresim.itens.some(ci => ci.id === i.id)
  })) || [];
};

export {
  habilidades,
  itensHabilidades,
  carregarHabilidades,
  obterNivelHabilidade,
  getHabilidade,
  comprarItem,
  treinar,
  listarItensHabilidade
};
