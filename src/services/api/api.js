const ITENS_HABILIDADES = "https://emilyspecht.github.io/the-cresim/itens-habilidades.json";
const ITENS_EMPREGOS  = "https://emilyspecht.github.io/the-cresim/empregos.json";

async function buscar(url) {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar ${url}: ${resposta.status}`);
    }
    return await resposta.json();
  } catch (erro) {
    console.error("Erro na API:", erro);
    return []; 
  }
}

export function buscarHabilidades() {
  return buscar(ITENS_HABILIDADES);
}

export function buscarEmpregos() {
  return buscar(ITENS_EMPREGOS);
}