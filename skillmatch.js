// |\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/|
// |    SkillMatch JS: Simulador de Compatibilidade com Vaga Front-End Júnior   |
// |/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\|

// ---------------------------------------------------------------------------

// ==========================
// Classes
// ==========================
class Vaga {
  constructor(id, empresa, cargo, requisitos, salario, modalidade) {
    this.id = id;
    this.empresa = empresa;
    this.cargo = cargo;
    this.requisitos = requisitos;
    this.salario = salario;
    this.modalidade = modalidade;
  }

  // Classifica a compatibilidade
  mostrarCompatibilidade(compatibilidadeInfo) {
    let classificacao;

    if (compatibilidadeInfo.compatibilidade >= 80) {
      classificacao = "Alta compatibilidade";
    } else if (compatibilidadeInfo.compatibilidade >= 50) {
      classificacao = "Média compatibilidade";
    } else {
      classificacao = "Baixa compatibilidade";
    }

    return classificacao;
  }

  // Mostra as informações de compatibilidade da vaga com um candidato
  exibirCompatibilidade(compatibilidadeInfo) {
    return (
      "Empresa: " +
      this.empresa +
      "\nCargo: " +
      this.cargo +
      "\nCompatibilidade: " +
      compatibilidadeInfo.compatibilidade +
      "%" +
      "\nHabilidades encontradas: " +
      (compatibilidadeInfo.requisitosAtendidos.length > 0
        ? compatibilidadeInfo.requisitosAtendidos.join(", ")
        : "Nenhum requisito foi atendido") +
      "\nHabilidades faltantes: " +
      (compatibilidadeInfo.requisitosNaoAtendidos.length > 0
        ? compatibilidadeInfo.requisitosNaoAtendidos.join(", ")
        : "Todos os requisitos foram atendidos") +
      "\nClassificação: " +
      this.mostrarCompatibilidade(compatibilidadeInfo)
    );
  }

  // Mostra um resumo das informações da vaga
  exibirResumo() {
    return (
      "Id: " +
      this.id +
      "\nEmpresa: " +
      this.empresa +
      "\nCargo: " +
      this.cargo +
      "\nRequisitos: " +
      this.requisitos.join(", ") +
      "\nSalário: R$" +
      this.salario.toFixed(2) +
      "\nModalidade: " +
      this.modalidade
    );
  }

  // Calcula a compatibilidade de uma vaga com um candidato
  calcularCompatibilidade(candidato) {
    let requisitosNaoAtendidos = [];
    let requisitosAtendidos = [];
    let compatibilidade;

    if (
      !this.requisitos.every((requisito) =>
        candidato.habilidades.includes(requisito),
      )
    ) {
      for (const requisito of this.requisitos) {
        if (candidato.habilidades.includes(requisito)) {
          requisitosAtendidos.push(requisito);
        } else {
          requisitosNaoAtendidos.push(requisito);
        }
      }
      compatibilidade =
        (requisitosAtendidos.length / this.requisitos.length) * 100;
    } else {
      requisitosAtendidos = this.requisitos;
      compatibilidade = 100;
    }

    return new CompatibilidadeInfo(
      this.id,
      Number(compatibilidade.toFixed(2)),
      requisitosAtendidos,
      requisitosNaoAtendidos,
    );
  }
}
class VagaFrontEnd extends Vaga {
  constructor(id, empresa, cargo, requisitos, salario, modalidade, nivel) {
    super(id, empresa, cargo, requisitos, salario, modalidade);
    this.nivel = nivel;
  }

  // Nível da vaga adicionado nas informações apresentadas
  exibirCompatibilidade(compatibilidadeInfo) {
    return super.exibirCompatibilidade(compatibilidadeInfo) + "\nNível da vaga: "+this.nivel;
  }

  // Nível da vaga adicionado nas informações apresentadas
  exibirResumo() {
    return super.exibirResumo() + "\nNível da vaga: "+this.nivel;
  }
}
class CompatibilidadeInfo {
  constructor(
    idVaga,
    compatibilidade,
    requisitosAtendidos,
    requisitosNaoAtendidos,
  ) {
    this.idVaga = idVaga;
    this.compatibilidade = compatibilidade;
    this.requisitosAtendidos = requisitosAtendidos;
    this.requisitosNaoAtendidos = requisitosNaoAtendidos;
  }
}
class Candidato {
  constructor(nome, area, email, senha, habilidades, experienciaMeses) {
    this.nome = nome;
    this.area = area;
    this.email = email;
    this.senha = senha;
    this.habilidades = habilidades;
    this.experienciaMeses = experienciaMeses;
  }

  // Mostra um resumo das informações do candidato
  exibirResumo() {
    return (
      "Nome: " +
      this.nome +
      "\nEmail: " +
      this.email +
      "\nArea: " +
      this.area +
      "\nHabilidades: " +
      this.habilidades.join(", ") +
      "\nExperiência: " +
      this.experienciaMeses +
      " meses"
    );
  }
}

// ---------------------------------------------------------------------------

// ==========================
// Contador de Buscas
// ==========================

// Cria o contador de buscas
function criarContadorBuscas() {
  let buscas = 0;

  return function () {
    buscas++;
    return buscas;
  };
}

// Instancia o contador de buscas
const contarBuscas = criarContadorBuscas();

// ---------------------------------------------------------------------------

// ==========================
// Display das vagas
// ==========================

// Mostra o resumo de cada vaga
function verVagas(candidato, vagas) {
  let abasVagas = [];

  let recomendacaoDeEstudo = [];

  let vagaComMaiorCompatibilidade = {
    id: null,
    compatibilidade: null,
  };

  let compatibilidades = [];
  let indice = 0;

  for (const vaga of vagas) {

    abasVagas[indice] = "";

    let compatibilidadeInfo = vaga.calcularCompatibilidade(candidato);
    let requisitosNaoAtendidos = compatibilidadeInfo.requisitosNaoAtendidos;
    let requisitosAtendidos = compatibilidadeInfo.requisitosAtendidos;
    let compatibilidade = compatibilidadeInfo.compatibilidade;

    for (const requisito of requisitosNaoAtendidos) {
      recomendacaoDeEstudo.push(requisito);
    }

    abasVagas[indice] += vaga.exibirResumo();

    if (requisitosNaoAtendidos.length === 0) {
      abasVagas[indice] +=
        "\n\nPara a vaga da " + vaga.empresa + ", não falta nenhum requisito";
    } else {
      abasVagas[indice] +=
        "\n\nPara a vaga da " +
        vaga.empresa +
        ", faltam:\n" +
        "- " +
        requisitosNaoAtendidos.join("\n- ");
    }

    if (
      vagaComMaiorCompatibilidade.compatibilidade === null ||
      vagaComMaiorCompatibilidade.compatibilidade < compatibilidade
    ) {
      vagaComMaiorCompatibilidade.id = vaga.id;
      vagaComMaiorCompatibilidade.compatibilidade = compatibilidade;
    }

    compatibilidades.push(compatibilidadeInfo);

    indice++;
  }

  let vagaEncontrada = vagas.find(
    (vaga) => vaga.id === vagaComMaiorCompatibilidade.id,
  );

  let mensagem =
    "Primeira vaga mais compatível:\n" +
    vagaEncontrada.empresa +
    " - " +
    vagaEncontrada.cargo +
    "\nCompatibilidade: " +
    vagaComMaiorCompatibilidade.compatibilidade +
    "%";

  if (recomendacaoDeEstudo.length !== 0) {
    mensagem +=
      "\n\nRecomendações de estudo:\n" +
      "Priorize estudar " +
      recomendacaoDeEstudo.join(", ") +
      ", pois esses conteúdos aparecem nas vagas analisadas.";
  }

  let input;

  let pergunta = "\n\nQual aba deseja abrir? ";

  for (let i = 0; i < abasVagas.length; i++) {
    pergunta += i + 1 + " / ";
  }

  pergunta += "x - sair";

  do {
    input = prompt(mensagem + pergunta);

    input = input.toLowerCase();

    if (isNaN(Number(input)) && input !== "x") {
      alert("Digite uma opção válida");
      continue;
    }

    if (input === "x") {
      continue;
    }

    alert(abasVagas[Number(input) - 1]);
  } while (input !== "x");

  return compatibilidades;
}

// Permite o candidato ver mais informações sobre uma vaga
function mostrarVagas(candidato, vagas = []) {
  let compatibilidades = verVagas(candidato, vagas);

  let input;

  do {
    input = prompt(
        "O que deseja fazer?\n" +
        "1 - Rever vagas\n" +
        "2 - Ver sua compatibilidade com uma vaga\n" +
        "x - Voltar a tela de início",
    );

    input = input.toLowerCase();

    switch (input) {
      case "1":
        verVagas(candidato, vagas);
        break;

      case "2":
        let escolha = prompt("Digite o id da vaga desejada");
        let vaga = vagas.find((vaga) => vaga.id === Number(escolha));

        if (vaga !== undefined) {
          let compatibilidadeInfo = compatibilidades.find(
            (compatibilidade) => compatibilidade.idVaga === Number(escolha),
          );

          alert(vaga.exibirCompatibilidade(compatibilidadeInfo));
        } else {
          alert("Opção inválida.");
        }
        break;

      default:
        if (input !== "x") {
          alert("Opção inválida.");
        }
        break;
    }
  } while (input !== "x");
}

// ---------------------------------------------------------------------------

// ==========================
// Processo de Login
// ==========================

// Armazena os candidatos e os retorna em forma de classe
function buscarCandidatosSimulados() {
  const candidatos = [
    {
      nome: "Ana",
      area: "Front-End",
      email: "ana@email.com",
      senha: "123",
      habilidades: ["JavaScript", "GitHub", "Lógica de Programação", "Kanban"],
      experienciaMeses: 3,
    },
    {
      nome: "Carlos",
      area: "Front-End",
      email: "carlos@email.com",
      senha: "123",
      habilidades: ["HTML", "CSS", "JavaScript", "React"],
      experienciaMeses: 8,
    },
    {
      nome: "Marina",
      area: "Front-End",
      email: "marina@email.com",
      senha: "123",
      habilidades: ["JavaScript", "GitHub", "Figma"],
      experienciaMeses: 5,
    },
    {
      nome: "Lucas",
      area: "Front-End",
      email: "lucas@email.com",
      senha: "123",
      habilidades: ["JavaScript", "TypeScript", "React", "GitHub"],
      experienciaMeses: 12,
    },
    {
      nome: "Fernanda",
      area: "Front-End",
      email: "fernanda@email.com",
      senha: "123",
      habilidades: ["HTML", "CSS", "Bootstrap", "Kanban"],
      experienciaMeses: 2,
    },
    {
      nome: "Rafael",
      area: "Front-End",
      email: "rafael@email.com",
      senha: "123",
      habilidades: ["JavaScript", "Vue.js", "Git", "Lógica de Programação"],
      experienciaMeses: 10,
    },
    {
      nome: "Juliana",
      area: "Front-End",
      email: "juliana@email.com",
      senha: "123",
      habilidades: ["React", "GitHub", "Kanban", "APIs"],
      experienciaMeses: 6,
    },
    {
      nome: "Pedro",
      area: "Front-End",
      email: "pedro@email.com",
      senha: "123",
      habilidades: ["JavaScript", "Node.js", "Git", "SCRUM"],
      experienciaMeses: 9,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        candidatos.map(
          (candidato) =>
            new Candidato(
              candidato.nome,
              candidato.area,
              candidato.email,
              candidato.senha,
              candidato.habilidades,
              candidato.experienciaMeses,
            ),
        ),
      );
    }, 1000);
  });
}

// Busca os candidatos cadastrados
async function buscarCandidatos() {
  alert("Buscando candidatos...");
  const candidatosCarregados = await buscarCandidatosSimulados();
  alert("Candidatos encontrados.");
  return candidatosCarregados;
}

// Verifica o email e senha do candidato
async function verificarEmailSenha(input) {
  let resultado = {
    candidato: undefined,
    loginRealizado: false,
  };
  const candidatosCarregados = await buscarCandidatos();

  let candidatoEncontrado = candidatosCarregados.find(
    (candidato) => candidato.email === input.email,
  );

  if (candidatoEncontrado !== undefined) {
    resultado.candidato = candidatoEncontrado;
    resultado.loginRealizado = candidatoEncontrado.senha === input.senha;

    return resultado;
  } else {
    return resultado;
  }
}

// Recebe o email e senha do candidato
async function realizarLogin() {
  let email = prompt("Digite o seu email");
  let senha = prompt("Digite a sua senha");

  let resposta = await verificarEmailSenha({ email: email, senha: senha });

  return resposta;
}

// ---------------------------------------------------------------------------

// ==========================
// Processo de Busca de Vagas
// ==========================

// Armazena as vagas e as retorna em forma de classe
function buscarVagasSimuladas() {
  const vagas = [
    {
      id: 1,
      empresa: "TechStart",
      cargo: "Desenvolvedor Front-End Júnior",
      requisitos: ["JavaScript", "GitHub", "Lógica de Programação"],
      salario: 2800,
      modalidade: "Remoto",
      nivel: "Júnior",
    },
    {
      id: 2,
      empresa: "CodeLab",
      cargo: "Estágio Front-End",
      requisitos: ["JavaScript", "Kanban", "GitHub"],
      salario: 1800,
      modalidade: "Híbrido",
      nivel: "Estágio",
    },
    {
      id: 3,
      empresa: "WebSolutions",
      cargo: "Programador JavaScript Júnior",
      requisitos: ["JavaScript", "Arrays", "Objetos", "Funções"],
      salario: 3000,
      modalidade: "Presencial",
      nivel: "Júnior",
    },
    {
      id: 4,
      empresa: "PixelForge",
      cargo: "Desenvolvedor React Júnior",
      requisitos: ["React", "JavaScript", "GitHub"],
      salario: 3500,
      modalidade: "Remoto",
      nivel: "Júnior",
    },
    {
      id: 5,
      empresa: "NextWave",
      cargo: "Front-End Trainee",
      requisitos: ["HTML", "CSS", "JavaScript"],
      salario: 2200,
      modalidade: "Híbrido",
      nivel: "Trainee",
    },
    {
      id: 6,
      empresa: "VisionTech",
      cargo: "Desenvolvedor Vue.js",
      requisitos: ["Vue.js", "JavaScript", "Git"],
      salario: 4000,
      modalidade: "Remoto",
      nivel: "Júnior",
    },
    {
      id: 7,
      empresa: "DevConnect",
      cargo: "Estágio em Desenvolvimento Web",
      requisitos: ["HTML", "CSS", "Kanban"],
      salario: 1600,
      modalidade: "Presencial",
      nivel: "Estágio",
    },
    {
      id: 8,
      empresa: "SkySystems",
      cargo: "Desenvolvedor Front-End React",
      requisitos: ["React", "APIs", "GitHub"],
      salario: 4200,
      modalidade: "Híbrido",
      nivel: "Pleno",
    },
    {
      id: 9,
      empresa: "ByteLabs",
      cargo: "Programador TypeScript",
      requisitos: ["TypeScript", "React", "GitHub"],
      salario: 4500,
      modalidade: "Remoto",
      nivel: "Pleno",
    },
    {
      id: 10,
      empresa: "InovaWeb",
      cargo: "Desenvolvedor Web Júnior",
      requisitos: ["JavaScript", "SCRUM", "Git"],
      salario: 3200,
      modalidade: "Presencial",
      nivel: "Júnior",
    },
    {
      id: 11,
      empresa: "AlphaCode",
      cargo: "Front-End com Bootstrap",
      requisitos: ["HTML", "CSS", "Bootstrap"],
      salario: 2600,
      modalidade: "Híbrido",
      nivel: "Júnior",
    },
    {
      id: 12,
      empresa: "CreativeApps",
      cargo: "UI Front-End Developer",
      requisitos: ["Figma", "CSS", "JavaScript"],
      salario: 3400,
      modalidade: "Remoto",
      nivel: "Júnior",
    },
    {
      id: 13,
      empresa: "RocketDev",
      cargo: "Desenvolvedor Node.js Júnior",
      requisitos: ["Node.js", "JavaScript", "Git"],
      salario: 3900,
      modalidade: "Remoto",
      nivel: "Júnior",
    },
    {
      id: 14,
      empresa: "SoftVision",
      cargo: "Assistente Front-End",
      requisitos: ["JavaScript", "GitHub", "Kanban"],
      salario: 2400,
      modalidade: "Presencial",
      nivel: "Assistente",
    },
    {
      id: 15,
      empresa: "FutureTech",
      cargo: "Desenvolvedor Front-End Pleno",
      requisitos: ["React", "TypeScript", "APIs", "GitHub"],
      salario: 5500,
      modalidade: "Híbrido",
      nivel: "Pleno",
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        vagas.map(
          (vaga) =>
            new VagaFrontEnd(
              vaga.id,
              vaga.empresa,
              vaga.cargo,
              vaga.requisitos,
              vaga.salario,
              vaga.modalidade,
              vaga.nivel,
            ),
        ),
      );
    }, 1000);
  });
}

// Mostra uma mensagem no fim do processamento das vagas
function processarVagas(vagas, callback) {
  alert("Vagas processadas com sucesso!");

  callback(vagas);
}

// Mostra a quantidade de vagas cadastradas
function mostrarQuantidadeVagas(vagas) {
  alert("Foram encontradas " + vagas.length + " vagas.");
  alert("Foram feitas ("+contarBuscas()+") buscas até o momento.")
}

// Busca as vagas cadastradas
async function buscarVagas() {
  alert("Buscando vagas...");
  const vagasCarregadas = await buscarVagasSimuladas();

  processarVagas(vagasCarregadas, mostrarQuantidadeVagas);

  return vagasCarregadas;
}

// ---------------------------------------------------------------------------

// ==========================
// Tela de início
// ==========================

// Permite o candidato acessar o sistema
async function introducao() {
  let loginRealizado = false;

  let input = "";

  let candidatoAtual;

  do {
    input = prompt(
      "Bem-vindo ao SkillMatch JS\n\n" +
        "O que deseja fazer?\n" +
        "1 - mostrar todas vagas disponíveis\n" +
        "2 - mostrar perfil do usuário\n" +
        "3 - fazer o login\n" +
        "x - sair",
    );

    input = input.toLowerCase();

    switch (input) {
      case "1":
        if (loginRealizado === false) {
          alert("Faça o login para acessar");
          break;
        }
        let vagas = await buscarVagas();

        mostrarVagas(candidatoAtual, vagas);
        break;

      case "2":
        if (loginRealizado === false) {
          alert("Faça o login para acessar");
          break;
        }
        alert(candidatoAtual.exibirResumo());
        break;

      case "3":
        let resposta = await realizarLogin();
        if (resposta.loginRealizado) {
          candidatoAtual = resposta.candidato;
          loginRealizado = true;
          alert("Login realizado com sucesso");
        } else {
          alert("Login não realizado");
        }
        break;

      default:
        if (input !== "x") {
          alert("Opção inválida.");
        }
        break;
    }
  } while (input !== "x");
}

// Inicia o sistema
introducao();

console.log(typeof introducao);