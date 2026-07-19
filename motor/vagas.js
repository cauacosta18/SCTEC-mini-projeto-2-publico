// ==========================
// Módulo de vagas e compatibilidade
// ==========================

export class CompatibilidadeInfo {
  constructor(
    idVaga,
    compatibilidade,
    requisitosAtendidos,
    requisitosNaoAtendidos,
    classificacao,
  ) {
    this.idVaga = idVaga;
    this.compatibilidade = compatibilidade;
    this.requisitosAtendidos = requisitosAtendidos;
    this.requisitosNaoAtendidos = requisitosNaoAtendidos;
    this.classificacao = classificacao;
  }
}

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
      this.mostrarCompatibilidade(compatibilidade),
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
    return super.exibirCompatibilidade(compatibilidadeInfo) + "\nNível da vaga: " + this.nivel;
  }

  // Nível da vaga adicionado nas informações apresentadas
  exibirResumo() {
    return super.exibirResumo() + "\nNível da vaga: " + this.nivel;
  }
}

class InfoVagasEncontradas {
  constructor(numVagas, numBuscas) {
    this.numBuscas = numBuscas;
    this.numVagas = numVagas;
  }
}

// Carrega as vagas simuladas a partir do JSON e converte cada item em uma instância de VagaFrontEnd.
async function buscarVagasSimuladas() {
  let resposta = await fetch("./../../dados/vagas.json");

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  let vagas = await resposta.json();

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

// Aplica um callback sobre as vagas para padronizar o processamento de resultados.
function processarVagas(vagas, callback) {
  let respostaProcessamento = callback(vagas);
  return respostaProcessamento;
}

// Monta os dados resumidos sobre a quantidade de vagas encontradas para o fluxo de busca.
function processarInfoVagas(vagas) {
  let infoVagasEncontradas = new InfoVagasEncontradas(vagas.length, 1);
  return infoVagasEncontradas;
}

// Expõe o resultado completo da busca de vagas, incluindo a lista carregada e a informação resumida.
export async function buscarVagas() {
  const vagasCarregadas = await buscarVagasSimuladas();

  let respostaBusca = {
    vagasCarregadas: vagasCarregadas,
    infoVagasEncontradas: null,
  };

  respostaBusca.infoVagasEncontradas = processarVagas(vagasCarregadas, processarInfoVagas);

  return respostaBusca;
}

// Calcula as sugestões de estudo e identifica a vaga com maior compatibilidade com o candidato.
export function buscarSugestoesVagas(candidato, vagas, vagasTotais) {
  let tecnologias = [];
  let recomendacaoDeEstudo = [];

  let vagaComMaiorCompatibilidade = {
    compatibilidade: null,
    vaga: null,
    requisitosNaoAtendidos: [],
  };

  for (const vaga of vagas) {
    let compatibilidadeInfo = vaga.calcularCompatibilidade(candidato);
    let requisitosNaoAtendidos = compatibilidadeInfo.requisitosNaoAtendidos;
    let compatibilidade = compatibilidadeInfo.compatibilidade;

    if (
      vagaComMaiorCompatibilidade.compatibilidade === null ||
      vagaComMaiorCompatibilidade.compatibilidade < compatibilidade
    ) {
      vagaComMaiorCompatibilidade.compatibilidade = compatibilidade;
      vagaComMaiorCompatibilidade.vaga = vaga;
      vagaComMaiorCompatibilidade.requisitosNaoAtendidos = requisitosNaoAtendidos;
    }
  }

  for (const vaga of vagasTotais) {
    for (const requisito of vaga.requisitos) {
      if (!tecnologias.some((tecnologia) => tecnologia === requisito)) {
        tecnologias.push(requisito);
      }
    }

    let compatibilidadeInfo = vaga.calcularCompatibilidade(candidato);
    let requisitosNaoAtendidos = compatibilidadeInfo.requisitosNaoAtendidos;

    for (const requisito of requisitosNaoAtendidos) {
      if (recomendacaoDeEstudo.some((recomendacao) => recomendacao === requisito)) {
        continue;
      }
      recomendacaoDeEstudo.push(requisito);
    }
  }

  return {
    recomendacaoDeEstudo: recomendacaoDeEstudo,
    vagaComMaiorCompatibilidade: vagaComMaiorCompatibilidade,
    tecnologias: tecnologias,
  };
}

// Centraliza a montagem das sugestões para a página de vagas, reunindo compatibilidades e recomendações.
export function buscarSugestoes(candidato, vagas, vagasTotais) {
  let respostaBusca = {
    compatibilidadesInfoPorVaga: [],
    recomendacaoDeEstudo: null,
    vagaComMaiorCompatibilidade: null,
    requisitosNaoAtendidos: [],
    tecnologias: [],
  };

  for (const vaga of vagas) {
    respostaBusca.compatibilidadesInfoPorVaga.push(vaga.calcularCompatibilidade(candidato));
  }

  let respostaSugestao = buscarSugestoesVagas(candidato, vagas, vagasTotais);

  respostaBusca.vagaComMaiorCompatibilidade = respostaSugestao.vagaComMaiorCompatibilidade;
  respostaBusca.recomendacaoDeEstudo = respostaSugestao.recomendacaoDeEstudo;
  respostaBusca.requisitosNaoAtendidos = respostaSugestao.vagaComMaiorCompatibilidade.requisitosNaoAtendidos;
  respostaBusca.tecnologias = respostaSugestao.tecnologias;

  return respostaBusca;
}

// Coleta as habilidades presentes nas vagas para alimentar o formulário de cadastro.
export async function buscarHabilidadesDisponiveis() {
  const resposta = await buscarVagas();
  const vagas = resposta.vagasCarregadas;

  const habilidades = [];

  for (const vaga of vagas) {
    for (const requisito of vaga.requisitos) {
      if (!habilidades.includes(requisito)) {
        habilidades.push(requisito);
      }
    }
  }

  return habilidades;
}
