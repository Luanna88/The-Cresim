// ================= IMPORTS =================
import { useQuestion } from "../services/question/use-question.js";
import { 
  criarCresim, salvarNovoCresim, findCresim, selecionarCresim, buscarTodosAtivos, updateLocalStorage 
} from "../services/cresim.js";
import { treinar, comprarItem, carregarHabilidades, itensHabilidades ,listarItensHabilidade} from "../services/habilidades.js";
import { dormir } from "../services/energia.js";
import { tomarBanho } from "../services/higiene.js";
import { trabalhar, carregarEmpregos, getEmprego} from "../services/trabalho.js";
import { interagir } from "../services/relacionamento.js";
import { aplicarCheat, carregarCheats, cheatsDisponiveis } from "../services/cheats.js";

// ================= VARIÁVEIS =================
let cresim;
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

// ================= HABILIDADES =================
const habilidadesDisponiveis = ["GASTRONOMIA", "PINTURA", "JOGOS", "JARDINAGEM", "MUSICA"];

export const selecionarHabilidades = async () => {
  console.log("\n===== SELECIONE A ASPIRAÇÃO DO CRESIM =====");
  habilidadesDisponiveis.forEach((h, index) => console.log(`${index + 1}. ${h}`));

  const escolha = await useQuestion("Escolha uma habilidade (número):");

  const indice = parseInt(escolha, 10) - 1;
  if (indice >= 0 && indice < habilidadesDisponiveis.length) {
    console.log(`✅ Habilidade selecionada: ${habilidadesDisponiveis[indice]}`);
    return habilidadesDisponiveis[indice];
  } else {
    console.log("❌ Opção inválida. Tente novamente.");
    return selecionarHabilidades();
  }
};

// ================= FUNÇÕES AUXILIARES =================
const clear = () => console.clear();

const boasVindas = () => {
  clear();
  console.log(`
████████╗██╗  ██╗███████╗     ██████╗██████╗ ███████╗███████╗██╗███╗   ███╗███████╗
╚══██╔══╝██║  ██║██╔════╝    ██╔════╝██╔══██╗██╔════╝██╔════╝██║████╗ ████║██╔════╝
   ██║   ███████║█████╗      ██║     ██████╔╝█████╗  ███████╗██║██╔████╔██║███████╗
   ██║   ██╔══██║██╔══╝      ██║     ██╔══██╗██╔══╝  ╚════██║██║██║╚██╔╝██║╚════██║
   ██║   ██║  ██║███████╗    ╚██████╗██║  ██║███████╗███████║██║██║ ╚═╝ ██║███████║
   ╚═╝   ╚═╝  ╚═╝╚══════╝     ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝     ╚═╝╚══════╝
██████████████████████████████████████████████████████████████████████ Versão 1.0.0
`);
};

// ================= MENU PRINCIPAL =================
const menu = async () => {
  carregarCheats(); // Carrega cheats disponíveis
  clear();
  boasVindas();
  await delay(2000);
  await menuInicial();
};

const menuInicial = async () => {
  clear();
  let rodando = true;

  while (rodando) {
    console.log("\n===== INICIO =====");
    if (cresim) exibirCresim();

    console.log("\n1. 🆕 Criar personagens");
    const crescims = buscarTodosAtivos();
    if (crescims.length > 0) console.log("2. 🔍 Selecionar personagens");
    if (cresim) console.log("3. 🎮 Menu do jogador");
    console.log("E. 🚪 Encerrar jogo");

    const escolha = (await useQuestion("Escolha uma opção:", cresim)).toUpperCase();

    if (cheatsDisponiveis.includes(escolha) && cresim) {
      aplicarCheat(cresim, escolha);
      console.log(`🤖 Cheat ${escolha} aplicado!`);
      await delay(1500);
      continue;
    }

    switch (escolha) {
      case "1": await criarPersonagem(); break;
      case "2": if (crescims.length > 0) await selecaoDePersonagem(); break;
      case "3": if (cresim) await menuJogador(); break;
      case "E": console.log("👋 Saindo do jogo..."); rodando = false; process.exit();
      default: console.log("❌ Opção inválida."); await delay(2000);
    }
    clear();
  }
};

// ================= MENU DO JOGADOR =================
// ================= MENU DO JOGADOR =================
const menuJogador = async () => {
  let rodando = true;

  while (rodando) {
    clear();
    exibirCresim();

    console.log("\n===== AÇÕES CRESIM =====");
    console.log("1. Dormir");
    console.log("2. Tomar banho");
    console.log("3. Estudar");
    console.log("4. Trabalhar");
    console.log("5. Socializar");
    console.log("V. Voltar");

    const escolha = (await useQuestion("Escolha uma opção:", cresim)).toUpperCase();

    if (cheatsDisponiveis.includes(escolha) && cresim) {
      aplicarCheat(cresim, escolha);
      console.log(`🤖 Cheat ${escolha} aplicado!`);
      await delay(1500);
      continue;
    }

    switch (escolha) {
      case "1": await acaoDormir(); break;
      case "2": await acaoTomarBanho(); break;
      case "3": await acaoEstudar(); break;
      case "4": await acaoTrabalhar(); break;
      case "5": await acaoSocializar(); break;
      case "V": rodando = false; break;
      default: 
        console.log("❌ Opção inválida."); 
        await delay(1500);
    }

    // Atualiza o Cresim após qualquer ação
    if (cresim) await atualizarCresimSelecionado();
  }
};

// ================= AÇÕES =================
const acaoDormir = async () => {
  const tempoDormir = 5000;
  console.log(`😴 ${cresim.nome} está dormindo...`);
  await delay(tempoDormir);
  dormir(cresim, tempoDormir);
};

const acaoTomarBanho = async () => {
  console.log(`🛁 ${cresim.nome} está tomando banho...`);
  await delay(3000);
  tomarBanho(cresim);
};


const acaoEstudar = async () => {
  if (!cresim) return console.log("❌ Nenhum Cresim selecionado.");

  const todasHabilidades = Object.keys(cresim.habilidades).map(h => h.toUpperCase());
  console.log("\n📚 Habilidades disponíveis para treinar:");
  todasHabilidades.forEach((h, i) => console.log(`${i + 1}. ${h}`));

  const escolha = await useQuestion("Escolha uma habilidade para treinar (número):");
  const indice = parseInt(escolha, 10) - 1;
  if (isNaN(indice) || indice < 0 || indice >= todasHabilidades.length) return console.log("❌ Opção inválida.");

  const nomeHabilidade = todasHabilidades[indice];
  const itensDisponiveis = itensHabilidades.filter(i => i.habilidade.toUpperCase() === nomeHabilidade);

  let itemEscolhido = null;
  if (itensDisponiveis.length) {
    console.log(`\n📦 Itens disponíveis para treinar ${nomeHabilidade}:`);
    itensDisponiveis.forEach((item, i) => console.log(`${i + 1}. ${item.nome} (Pontos: ${item.pontos}, Preço: $${item.preco})`));
    
    const escolhaItem = await useQuestion("Escolha um item para treinar (número) ou ENTER para treinar sem item:");
    if (escolhaItem) {
      const indiceItem = parseInt(escolhaItem, 10) - 1;
      if (!isNaN(indiceItem) && indiceItem >= 0 && indiceItem < itensDisponiveis.length) {
        itemEscolhido = itensDisponiveis[indiceItem];
        if (!cresim.itens) cresim.itens = [];
        if (!cresim.itens.some(i => i.id === itemEscolhido.id)) cresim.itens.push(itemEscolhido);
      }
    }
  }

  console.log(`📚 ${cresim.nome} está treinando ${nomeHabilidade}...`);

  try {
    // Treina e retorna cresim atualizado
    cresim = await treinar({ cresim, nomeHabilidade, itemUsado: itemEscolhido });
    clear();
    exibirCresim();
    console.log("✅ Treino concluído!");
  } catch (erro) {
    console.log(`❌ Erro no treino: ${erro}`);
  }
};


const acaoTrabalhar = async () => {
  const listaEmpregos = await carregarEmpregos();
  if (!listaEmpregos.length) {
    console.log("❌ Nenhum emprego disponível.");
    return;
  }


  console.log("\n===== EMPREGOS DISPONÍVEIS =====");
  listaEmpregos.forEach((e, i) => console.log(`${i + 1}. ${e.cargo || "Sem nome"}`));


  const escolha = await useQuestion("Escolha um emprego (número):");
  const indice = parseInt(escolha, 10) - 1;

  if (isNaN(indice) || indice < 0 || indice >= listaEmpregos.length) {
    console.log("❌ Emprego inválido.");
    return;
  }

  const empregoSelecionado = listaEmpregos[indice];

  console.log(`💼 ${cresim.nome} está trabalhando em ${empregoSelecionado.cargo}...`);

  const resultado = await trabalhar(cresim, empregoSelecionado);
  console.log(resultado.mensagem);

  cresim = resultado.cresim;
};


const acaoSocializar = async () => {
  console.log(`💬 ${cresim.nome} está interagindo...`);
  await interagir(cresim);
};

// ================= AUXILIARES =================
const atualizarCresimSelecionado = async () => {
  if (cresim) {
    updateLocalStorage(cresim);
    await selecionarCresim(cresim.id);
  }
};

const selecaoDePersonagem = async () => {
  let rodando = true;
  while (rodando) {
    exibirSelecaoPersonagem();
    const id = await useQuestion("Informe o Id para selecionar seu Cresim ou V (VOLTAR):", cresim);
    if (id.toUpperCase() === "V") return;

    const idNumerico = parseInt(id, 10);
    const cresimSelecionado = findCresim(idNumerico);

    if (isNaN(idNumerico) || !cresimSelecionado) {
      console.log("❌ Comando inválido, tente novamente.");
      await delay(3000);
      clear();
    } else {
      cresim = cresimSelecionado;
      await selecionarCresim(cresim.id);
      console.log(`✅ ${cresim.nome} selecionado.`);
      rodando = false;
      await delay(1500);
    }
  }
};

const criarPersonagem = async () => {
  const nome = await useQuestion("Informe o nome do seu novo Cresim:", cresim);
  if (!nome || nome.length < 2) return console.log("❌ Nome inválido.");
  const habilidade = await selecionarHabilidades();
  const novoCresim = criarCresim(nome, habilidade);
  salvarNovoCresim(novoCresim);
  await delay(1500);
  clear();
  await menuInicial();
};

// ================= EXIBIÇÃO =================
const exibirCresims = () => {
  const crescims = buscarTodosAtivos();
  if (!crescims.length) return console.log("❌ Nenhum Cresim encontrado.");
  crescims.forEach(c => console.log(`🧑 Id: ${c.id} | ${c.nome}`));
};

const exibirSelecaoPersonagem = () => {
  clear();
  console.log("\n===== MENU | SELEÇÃO DE PERSONAGEM =====\n");
  exibirCresims();
};

// ================= EXIBIÇÃO =================
const exibirCresim = () => {
  if (!cresim) return;
  console.log("\n🧑 Personagem selecionado:", cresim.nome);
  console.log(`⏳ Tempo de vida: ${cresim.tempo}`);
  console.log(`💰 Cresceleons: $${cresim.cresceleons}`);
  console.log(`⚡ Energia: ${cresim.energia}`);
  console.log(`🛁 Higiene: ${cresim.higiene}`);
  console.log(`🏅 Pontos de habilidade: ${cresim.pontosHabilidade}`);
  console.log(`🎯 Aspiração: ${cresim.aspiracao}`); // Mostra a habilidade escolhida na criação
  console.log(`📚 Habilidades treinadas: [${exibirHabilidades(cresim.habilidades)}]`);
  console.log(`💬 Relacionamentos: ${exibirRelacionamentos(cresim.relacionamentos)}`);
};

const exibirHabilidades = (habilidades) => {
  if (!habilidades || Object.keys(habilidades).length === 0) return "Nenhuma";

  return Object.entries(habilidades)
    .filter(([_, h]) => h.pontos > 0)
    .map(([nome, h]) => {
      const item = cresim.itens?.find(i => i.habilidade.toUpperCase() === nome.toUpperCase());
      return item ? `${nome} (${item.nome})` : `${nome}`;
    })
    .join(" | ");
};



const exibirRelacionamentos = (relacionamentos) => {
  if (!relacionamentos || relacionamentos.length === 0) return "Nenhum";
  return relacionamentos.map(r => `${r.nome} (${r.nivel})`).join(", ");
};

// ================= EXPORTS =================
export { menu, delay};
