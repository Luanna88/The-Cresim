import { useQuestion } from "../services/question/use-question.js";
import {
  buscarTodosAtivos,
  findCresim,
  criarCresim,
  salvarNovoCresim,
  selecionarCresim,
  updateLocalStorage,
} from "../services/cresim.js";
import {
  buscarHabilidades,
  buscarItensHabilidades,
  obterNivelHabilidade,
  treinar,
} from "../services/habilidade.js";
import { dormir } from "../services/energia.js";
import { tomarBanho } from "../services/higiene.js";
import {
  interagir,
  obterInteracoesDisponiveis,
} from "../services/relacionamento.js";
import { CONSTANTES } from "../utils/constants.js";
import {
  buscarTodosOsTrabalhos,
  buscarTrabalho,
  trabalhar,
} from "../services/trabalho.js";

const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

let cresim;

const clear = () => {
  console.clear();
};

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

export const menu = async () => {
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
    if (cresim) {
      exibirCresim();
    }
    console.log("\n1. 🆕 Criar personagens");
    const crescims = buscarTodosAtivos();
    if (crescims.length > 0) {
      console.log("2. 🔍 Selecionar personagens");
    }
    if (cresim) {
      console.log("3. 🎮 Menu do jogador");
    }
    console.log("E. 🚪 Encerrar jogo");

    const escolha = (await useQuestion("Escolha uma opção:")).toUpperCase();

    switch (escolha) {
      case "1":
        await criarPersonagem();
        break;
      case "2":
        if (crescims.length > 0) {
          await selecaoDePersonagem();
        } else {
          console.log(
            "❌ Opção inválida, nenhum personagem disponível para selecionar."
          );
          await delay(3000);
          clear();
        }
        break;
      case "3":
        if (cresim) {
          await menuJogador();
        } else {
          console.log("❌ Opção inválida, nenhum personagem selecionado.");
          await delay(3000);
          clear();
        }
        break;
      case "E":
        console.log("👋 Saindo do jogo...");
        rodando = false;
        process.exit();
      default:
        {
          console.log("❌ Opção inválida. Tente novamente.");
          await delay(3000);
          clear();
        }
        clear();
    }
  }
};

const menuJogador = async () => {
  clear();
  console.log("\n===== MENU | PERSONAGEM | AÇÕES =====");
  exibirCresim();
  let rodando = true;
  while (rodando) {
    console.log("\n===== AÇÕES CRESIM =====");
    console.log("1. Dormir");
    console.log("2. Tomar banho");
    console.log("3. Estudar");
    console.log("4. Trabalhar");
    console.log("5. Socializar");
    console.log("V. Voltar");

    const escolha = (await useQuestion("Escolha uma opção:")).toUpperCase();

    switch (escolha) {
      case "1":
        await acaoDormir();
        await atualizarCresimSelecionado(cresim.id);
        await voltarInicio();
        break;
      case "2":
        await acaoTomarBanho();
        await atualizarCresimSelecionado(cresim.id);
        await voltarInicio();
        break;
      case "3":
        await acaoEstudar();
        await atualizarCresimSelecionado(cresim.id);
        await voltarInicio();
        break;
      case "4":
        await acaoTrabalhar();
        await atualizarCresimSelecionado(cresim.id);
        await voltarInicio();
        break;
      case "5":
        await acaoSocializar();
        await atualizarCresimSelecionado(cresim.id);
        await voltarInicio();
        break;
      case "V":
        rodando = false;
        await menuInicial();
        break;
      default:
        console.log("❌ Opção inválida. Tente novamente.");
        await delay(3000);
    }
  }
};

const selecaoDePersonagem = async () => {
  let rodando = true;
  while (rodando) {
    exibirSelecaoPersonagem();
    const id = await useQuestion(
      "Informe o Id para selecionar seu Cresim ou V (VOLTAR):"
    );
    if (id.toUpperCase() === "V") {
      await menuInicial();
      return;
    }
    const idNumerico = parseInt(id, 10);
    const cresimSelecionado = findCresim(idNumerico);
    if (isNaN(idNumerico) || !cresimSelecionado) {
      console.log("❌ Comando inválido, tente novamente.");
      await delay(3000);
      clear();
    } else {
      cresim = cresimSelecionado;
      await selecionarCresim(cresim.id);
      console.log(`\n   ✅ ${cresim.nome} selecionado.`);
      rodando = false;
    }
  }
  await delay(3000);
  await menuJogador();
};

const exibirCresims = () => {
  const crescims = buscarTodosAtivos();
  if (crescims.length === 0) {
    console.log("❌ Nenhum Cresim encontrado.");
    return;
  }
  crescims.forEach((c) => {
    console.log(`   🧑 Id: ${c.id} | ${c.nome}`);
  });
};

const exibirSelecaoPersonagem = () => {
  clear();
  console.log("\n===== MENU | SELEÇÃO DE PERSONAGEM =====\n");
  exibirCresims();
};

const criarPersonagem = async () => {
  menuCriacaoPersonagem();
  let nome = await useQuestion("Informe o nome do seu novo Cresim:");
  while (!isValideName(nome)) {
    console.log("❌ Nome inválido, mínimo 2 caracteres.");
    menuCriacaoPersonagem();
    nome = await useQuestion("Informe o nome do seu novo Cresim:");
  }
  const habilidade = await selecionarHabilidades();
  const novoCrescim = criarCresim(nome, habilidade);
  salvarNovoCresim(novoCrescim);
  await delay(1500);
  await menuInicial();
};

const isValideName = (nomeCresim) => {
  return nomeCresim.length > 2;
};

const selecionarHabilidades = async () => {
  listarSelecaoHabilidade();
  const habilidades = buscarHabilidades();
  let habilidade = null;
  while (!habilidade) {
    const habilidadeId = await useQuestion(
      "Informe o ID da habilidade escolhida:"
    );
    const index = parseInt(habilidadeId, 10) - 1;
    if (index >= 0 && index < habilidades.length) {
      habilidade = habilidades[index];
    } else {
      console.log("❌ Habilidade não encontrada, tente novamente.");
      await delay(3000);
    }
  }
  return habilidade;
};

const listarSelecaoHabilidade = () => {
  clear();
  console.log("\n===== MENU | SELEÇÃO DE HABILIDADE =====\n");
  console.log(`📚 Selecione uma habilidade:`);
  console.log("1 - 🍳 Gastronomia");
  console.log("2 - 🎨 Pintura");
  console.log("3 - 🎮 Games");
  console.log("4 - 🌿 Jardinagem");
  console.log("5 - 🎵 Música");
};

const menuCriacaoPersonagem = () => {
  clear();
  console.log("\n===== MENU | CRIAÇÃO DE PERSONAGEM =====\n");
};

const voltarInicio = async () => {
  await delay(5000);
  clear();
  await menuInicial();
};

const atualizarCresimSelecionado = async (cresimId) => {
  cresim = await selecionarCresim(cresimId);
};

// AÇÃO DORMIR
const acaoDormir = async () => {
  const tempo = await selecionarTempoSoninho();
  console.log("💤 Dormindo...");
  const cresimAtualizado = dormir(cresim, tempo);
  updateLocalStorage(cresimAtualizado["cresim"]);
};

const selecionarTempoSoninho = async () => {
  exibirMenuPersonagem();
  console.log("\n🌙 Quanto tempo deseja dormir?");
  console.log("  1 - 5000ms");
  console.log("  2 - 10000ms");
  console.log("  3 - 15000ms");
  const opcao = parseInt(await escolherOpcao(1, 3), 10);
  switch (opcao) {
    case 1:
      return CONSTANTES.CICLO_SIMPLES_DE_SONO;
    case 2:
      return CONSTANTES.CICLO_DUPLO_DE_SONO;
    case 3:
      return CONSTANTES.CICLO_TRIPLO_DE_SONO;
    default:
      return 0;
  }
};

// AÇÃO BANHO
const acaoTomarBanho = async () => {
  console.log("🚿 Tomando banho...");
  const { cresim: cresimAtualizado } = tomarBanho(cresim);
  updateLocalStorage(cresimAtualizado);
};

// AÇÃO ESTUDAR
const acaoEstudar = async () => {
  console.log("📖 Estudando...");
  const habilidade = await selecionarHabilidades();
  const itemHabilidade = await selecionarItensHabilidade(habilidade);

  const nivelAtual = obterNivelHabilidade(cresim.habilidades[habilidade]);

  const { cresim: cresimAtualizado } = treinar(cresim, itemHabilidade);

  console.log(
    `Nível da habilidade ${habilidade}: ${nivelAtual} → ${obterNivelHabilidade(
      cresimAtualizado.habilidades[habilidade]
    )}`
  );

  updateLocalStorage(cresimAtualizado);

  console.log(
    `📚 Habilidade ${habilidade} aprimorada! Novo nível: ${obterNivelHabilidade(
      cresimAtualizado.habilidades[habilidade]
    )}`
  );
};

const selecionarItensHabilidade = async (habilidade) => {
  listarItensHabilidade(habilidade);
  let item = null;
  while (!item) {
    const itemId = await useQuestion("Informe o ID do item escolhido:");
    if (habilidade) {
      item = buscarItensHabilidades(habilidade).find(
        (i) => i.id === parseInt(itemId, 10)
      );
    }
    if (!item) {
      console.log("❌ Item não encontrado, tente novamente.");
      await delay(3000);
    }
  }
  return item;
};

const listarItensHabilidade = (habilidades) => {
  clear();
  console.log("\n===== MENU | SELEÇÃO DE ITENS =====\n");
  console.log(`📚 Habilidade selecionada: ${habilidades}`);
  buscarItensHabilidades(habilidades).forEach((item) => {
    console.log(
      ` ➡️    ${item.id} - ${item.nome} [ 🏅 Pontos: ${item.pontos} | ⏳ Preço: $${item.preco}]`
    );
  });
};

// AÇÃO TRABALHAR
const acaoTrabalhar = async () => {
  const emprego = await selecaoDeTrabalho();

  if (!emprego || !emprego.salario) {
    console.log("❌ Trabalho inválido ou não encontrado.");
    return;
  }

  console.log("💼 Trabalhando...");
  const cresimAtualizado = trabalhar(cresim, emprego);
  updateLocalStorage(cresimAtualizado["cresim"]);
};

const selecaoDeTrabalho = async () => {
  exibirMenuPersonagem();
  console.log("\n💼 Qual trabalho deseja realizar (id)?");

  listarSelecaoDeTrabalho(cresim.nome);
  let trabalho = null;

  while (!trabalho) {
    const trabalhoId = parseInt(
      await useQuestion("Informe o ID do trabalho escolhido:"),
      10
    );
    trabalho = await buscarTrabalho(trabalhoId); // Agora é assíncrona

    if (!trabalho) {
      console.log("❌ Trabalho não encontrado, tente novamente.");
      await delay(3000);
    }
  }

  return trabalho; // Retorna o objeto inteiro, e não apenas a categoria
};

const listarSelecaoDeTrabalho = (nomeCresim) => {
  clear();
  console.log("\n===== MENU | SELEÇÃO DE TRABALHO =====\n");
  console.log("\n💼 Qual trabalho quer fazer?");
  buscarTodosOsTrabalhos().forEach((trabalho) => {
    console.log(`  ${trabalho.id} - ${trabalho.cargo}`);
  });
};

// AÇÃO SOCIALIZAR
const acaoSocializar = async () => {
  const outroCresimId = await escolherOutroCresim();
  const tipoInteracao = await escolherTipoInteracao();

  const outroCresim = findCresim(outroCresimId);

  if (!outroCresim) {
    console.log("❌ Outro Cresim não encontrado.");
    return;
  }
  const interacoesDisponiveis = obterInteracoesDisponiveis();
  const resultado = interagir(
    cresim,
    outroCresim,
    tipoInteracao,
    interacoesDisponiveis
  );

  resultado.tempo = Math.max(0, resultado.tempo);

  console.log("TEMPO INTERACAO", resultado.tempo);
  if (resultado.tempo > 0) {
    console.log("💬 Socializando...");
    updateLocalStorage(resultado.cresim);
    updateLocalStorage(resultado.outroCresim);
  } else {
    console.log("❌ Falha na interação.");
  }
};

const escolherOutroCresim = async () => {
  console.log("\n🔄Escolha o Cresim com o qual deseja interagir:");
  const cresims = buscarTodosAtivos();
  cresims.forEach(
    (c) => c.id !== cresim.id && console.log(`  ${c.id} - ${c.nome}`)
  );
  return await useQuestion("Informe o ID do Cresim escolhido:");
};

const escolherTipoInteracao = async () => {
  console.log("\n🔄 Escolha o tipo de interação:");
  const opcoesInteracao = ["Conversar", "Brincar", "Ajudar"];
  opcoesInteracao.forEach((interacao, index) => {
    console.log(`  ${index + CONSTANTES.CORRECAO_INDICE} - ${interacao}`);
  });

  const opcao = await escolherOpcao(1, opcoesInteracao.length);
  return opcoesInteracao[opcao - 1];
};

const exibirCresim = () => {
  console.log("\n  🧑 Personagem selecionado: ", cresim.nome);
  console.log(`      ⏳ Tempo de vida: ${cresim.tempo}`);
  console.log(`      💰 Cresceleons: $${cresim.cresceleons}`);
  console.log(`      ⚡ Energia: ${cresim.energia}`);
  console.log(`      🛁 Higiene: ${cresim.higiene}`);
  console.log(`      🏅 Pontos de habilidade: ${cresim.pontosHabilidade}`);
  console.log(
    `      📚 Habilidades: [${exibirHabilidades(cresim.habilidades)}]`
  );
  console.log(
    `      💬 Relacionamentos: ${exibirRelacionamentos(cresim.relacionamentos)}`
  );
};

const exibirHabilidades = (habilidades) => {
  if (!habilidades) {
    return "Nenhuma";
  }
  return Object.entries(habilidades)
    .map(([chave, valor]) => `${chave}: ${valor}`)
    .join(" | ");
};

const exibirRelacionamentos = (relacionamentos) => {
  return relacionamentos ? relacionamentos.join(", ") : "Nenhum";
};

const escolherOpcao = async (min, max) => {
  let opcao = await useQuestion("Escolha uma opção: ");
  const opcaoNumerica = parseInt(opcao, 10);
  if (opcaoNumerica >= min && opcaoNumerica <= max) {
    return opcaoNumerica;
  }
  console.log("❌ Opção inválida. Tente novamente.");
  return escolherOpcao(min, max);
};

const exibirMenuPersonagem = () => {
  // const cresimAtualizado = findCresim(cresim.id);
  // if (!cresimAtualizado) {
  //   console.log("❌ Cresim não encontrado.");
  //   return;
  // }
  clear();
  console.log("\n===== MENU | PERSONAGEM | AÇÕES =====");
  exibirCresim();
};

export { selecionarHabilidades, delay };
