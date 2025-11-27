import { buscarHabilidades} from "../services/api/api.js";

export let habilidades = [];

const NIVEIS = {
    JUNIOR :{nome: "JÚNIOR", minimo: 0, maximo:16},
    PLENO :{nome: "PLENO", minimo: 17, maximo:26},
    SENIOR :{nome: "SÊNIOR", minimo: 27}
};

export async function carregarHabilidades() {
  const dados = await buscarHabilidades();

  habilidades = dados.map((item) => ({
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    pontos: 0,
    nivel: "JÚNIOR"
  }));

  return habilidades;
}

export function calcularNivel(pontos) {
  if (pontos >= NIVEIS.JUNIOR.minimo && pontos <= NIVEIS.JUNIOR.maximo) {
    return "JÚNIOR";
  }
  if (pontos >= NIVEIS.PLENO.minimo && pontos <= NIVEIS.PLENO.maximo) {
    return "PLENO";
  }
  return "SÊNIOR";
}

export function getHabilidade(nome) {
  return habilidades.find((h) => h.nome === nome);
}

export function comprarItem({ crescim, item }) {
  if (!crescim || !item) {
    console.warn("Crescim ou item inválido na compra.");
    return null;
  }
  if (!Array.isArray(crescim.itens)) {
    crescim.itens = [];
  }

  const jaTem = crescim.itens.find((i) => i.id === item.id);
  if (jaTem) {
    console.log(`O Cresim já possui o item: ${item.nome}`);
    return null;
  }
  if (crescim.dinheiro < item.preco) {
    console.log(
      `Saldo insuficiente! ${crescim.nome} tem ${crescim.dinheiro} moedas e o item custa ${item.preco}.`
    );
    return null;
  }

  crescim.dinheiro -= item.preco;
  crescim.itens.push(item);
  console.log(
    `🛒 ${crescim.nome} comprou o item ${item.nome} por ${item.preco} moedas!`
  );

  return item; 
}

export function treinar({
  nomeHabilidade,
  itemUsado,
  crescim,
  callback = () => {}
}) {
  const habilidade = getHabilidade(nomeHabilidade);

  if (!habilidade) {
    console.warn("Habilidade não encontrada:", nomeHabilidade);
    return;
  }

  console.log(`Treino de ${habilidade.nome} iniciado...`);

  setTimeout(() => {
    let ganho = itemUsado.pontos;

    if (crescim.aspiracao === habilidade.nome) {
      ganho += 1;
    }

    const nivelAnterior = habilidade.nivel;

    habilidade.pontos += ganho;


    crescim.energia -= 4;

    habilidade.nivel = calcularNivel(habilidade.pontos);

    console.log(`Ganhou ${ganho} pontos em ${habilidade.nome}`);
    console.log(`Total de pontos: ${habilidade.pontos}`);
    console.log(`Nível atual: ${habilidade.nivel}`);
    console.log(`Energia restante: ${crescim.energia}`);

    if (nivelAnterior !== habilidade.nivel) {
      console.log(
        `Subiu de nível: ${nivelAnterior} → ${habilidade.nivel}!`
      );
    }

    callback({ habilidade, energia: crescim.energia});
}, 8000);
}

