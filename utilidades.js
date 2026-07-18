// ==========================
// Módulo de utilidades compartilhadas
// ==========================

// Copia os atributos de um objeto JSON para uma instância já existente, útil para reconstruir classes a partir do localStorage.
export function transformarLocalstorage(json, objeto) {
  for (const [atributo] of Object.entries(objeto)) {
    objeto[atributo] = json[atributo];
  }
}

// Exibe uma mensagem temporária na tela para feedback visual do usuário.
export function ativarAlerta(alerta, mensagem) {
  alerta.style.bottom = "20px";
  alerta.textContent = mensagem;

  let timeout = setTimeout(() => {
    alerta.style.bottom = "-100px";
  }, 2000);

  alerta.addEventListener("mouseenter", () => {
    clearTimeout(timeout);
  });

  alerta.addEventListener("mouseleave", () => {
    timeout = setTimeout(() => {
      alerta.style.bottom = "-100px";
    }, 5000);
  });
}

// Anima o indicador de carregamento para dar feedback visual durante operações assíncronas.
export function animarCirculoCarregamento(circulo) {
  let interval = setInterval(() => {
    if (circulo.style.width === "35px") {
      circulo.style.height = "75px";
      circulo.style.width = "75px";
    } else {
      circulo.style.height = "35px";
      circulo.style.width = "35px";
    }
  }, 1000);

  return interval;
}

// Alterna as cores da interface conforme o modo claro ou escuro selecionado.
export function acionarModoExibicao(document, modo) {
  switch (modo) {
    case "claro":
      document.documentElement.style.setProperty("--fundo-secundario", "#F3F7F0");
      document.documentElement.style.setProperty("--cor-fonte", "#191A1B");
      document.documentElement.style.setProperty("--cor-destaque", "#7584af");
      document.documentElement.style.setProperty("--fundo-principal", "#5a6166");
      break;

    case "escuro":
      document.documentElement.style.setProperty("--fundo-secundario", "#191A1B");
      document.documentElement.style.setProperty("--cor-fonte", "#F3F7F0");
      document.documentElement.style.setProperty("--cor-destaque", "#8CA0D7");
      document.documentElement.style.setProperty("--fundo-principal", "#32373B");
      break;

    default:
      document.documentElement.style.setProperty("--fundo-secundario", "#191A1B");
      document.documentElement.style.setProperty("--cor-fonte", "#F3F7F0");
      document.documentElement.style.setProperty("--cor-destaque", "#8CA0D7");
      document.documentElement.style.setProperty("--fundo-principal", "#32373B");
      break;
  }
}
