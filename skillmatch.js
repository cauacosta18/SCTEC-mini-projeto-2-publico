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
  mostrarCompatibilidade(compatibilidade) {
    let classificacao;

    if (compatibilidade >= 80) {
      classificacao = "Alta compatibilidade";
    } else if (compatibilidade >= 50) {
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
      this.mostrarCompatibilidade(compatibilidade)
    );
  }
}
export class VagaFrontEnd extends Vaga {
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
export class CompatibilidadeInfo {
  constructor(
    idVaga,
    compatibilidade,
    requisitosAtendidos,
    requisitosNaoAtendidos,
    classificacao
  ) {
    this.idVaga = idVaga;
    this.compatibilidade = compatibilidade;
    this.requisitosAtendidos = requisitosAtendidos;
    this.requisitosNaoAtendidos = requisitosNaoAtendidos;
    this.classificacao = classificacao;
  }
}
export class Candidato {
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
export const contarBuscas = criarContadorBuscas();

// ---------------------------------------------------------------------------

// ==========================
// Display das vagas
// ==========================

// Mostra o resumo de cada vaga
export function buscarSugestoesVagas(candidato, vagas) {
  let abasVagas = [];

  let recomendacaoDeEstudo = [];

  let vagaComMaiorCompatibilidade = {
    compatibilidade: null,
    vaga: null,
    requisitosNaoAtendidos: []
  };

  let compatibilidades = [];

  for (const vaga of vagas) {


    let compatibilidadeInfo = vaga.calcularCompatibilidade(candidato);
    let requisitosNaoAtendidos = compatibilidadeInfo.requisitosNaoAtendidos;
    let requisitosAtendidos = compatibilidadeInfo.requisitosAtendidos;
    let compatibilidade = compatibilidadeInfo.compatibilidade;

    for (const requisito of requisitosNaoAtendidos) {
      recomendacaoDeEstudo.push(requisito);
    }

    if (
      vagaComMaiorCompatibilidade.compatibilidade === null ||
      vagaComMaiorCompatibilidade.compatibilidade < compatibilidade
    ) {
      vagaComMaiorCompatibilidade.compatibilidade = compatibilidade;
      vagaComMaiorCompatibilidade.vaga = vaga;
      vagaComMaiorCompatibilidade.requisitosNaoAtendidos = requisitosNaoAtendidos;
    }

    compatibilidades.push(compatibilidadeInfo);

  }

  let sugestoes = {
    recomendacaoDeEstudo: recomendacaoDeEstudo,
    vagaComMaiorCompatibilidade: vagaComMaiorCompatibilidade
  }

  return sugestoes;
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
  const candidatosCarregados = await buscarCandidatosSimulados();
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
export async function realizarLogin(email, senha) {

  let resposta = await verificarEmailSenha({ email: email, senha: senha });

  return resposta;
}

// ---------------------------------------------------------------------------

// ==========================
// Processo de Busca de Vagas
// ==========================

class InfoVagasEncontradas {
  constructor (numVagas, numBuscas) {
    this.numBuscas = numBuscas;
    this.numVagas = numVagas;
  }
}

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
  let respostaProcessamento = callback(vagas);
  return respostaProcessamento;
}

// Mostra a quantidade de vagas cadastradas
function processarInfoVagas(vagas) {
  let infoVagasEncontradas = new InfoVagasEncontradas(vagas.length, contarBuscas());
  return infoVagasEncontradas;
}

// Busca as vagas cadastradas
export async function buscarVagas() {
  const vagasCarregadas = await buscarVagasSimuladas();

  let respostaBusca = {
    vagasCarregadas: vagasCarregadas,
    infoVagasEncontradas: null,
  }

  respostaBusca.infoVagasEncontradas = processarVagas(vagasCarregadas, processarInfoVagas);

  return respostaBusca;
}

// Busca as vagas cadastradas
export function buscarSugestoes(candidato, vagas) {

  let respostaBusca = {
    compatibilidadesInfoPorVaga: [],
    recomendacaoDeEstudo: null,
    vagaComMaiorCompatibilidade: null,
    requisitosNaoAtendidos: []
  }

  for (const vaga of vagas) {
    respostaBusca.compatibilidadesInfoPorVaga.push(vaga.calcularCompatibilidade(candidato));
  }

  let respostaSugestao = buscarSugestoesVagas(candidato, vagas);

  respostaBusca.vagaComMaiorCompatibilidade = respostaSugestao.vagaComMaiorCompatibilidade;
  respostaBusca.recomendacaoDeEstudo = respostaSugestao.recomendacaoDeEstudo;
  respostaBusca.requisitosNaoAtendidos = respostaSugestao.vagaComMaiorCompatibilidade.requisitosNaoAtendidos;

  return respostaBusca;
}

// ---------------------------------------------------------------------------

export function transformarLocalstorage(json, objeto) {
    for (const [atributo, valor] of Object.entries(objeto)) {
        objeto[atributo] = json[atributo];
    }
}