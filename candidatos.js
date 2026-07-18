// ==========================
// Módulo de candidatos e autenticação
// ==========================

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

// Carrega os candidatos simulados a partir do JSON local e também inclui os cadastrados no localStorage.
async function buscarCandidatosSimulados() {
  let resposta = await fetch("./../../dados/candidatos.json");

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  let candidatos = await resposta.json();

  if (localStorage.getItem("candidatos-cadastrados")) {
    let string = localStorage.getItem("candidatos-cadastrados");
    let candidatosCadastrados = JSON.parse(string);

    for (const candidatoLocalStorage of candidatosCadastrados) {
      let candidato = {
        nome: candidatoLocalStorage.nome,
        area: candidatoLocalStorage.area,
        email: candidatoLocalStorage.email,
        senha: candidatoLocalStorage.senha,
        habilidades: candidatoLocalStorage.habilidades,
        experienciaMeses: candidatoLocalStorage.experiencia,
      };

      candidatos.push(candidato);
    }
  }

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

// Expõe a lista final de candidatos já convertida em instâncias da classe Candidato.
export async function buscarCandidatos() {
  const candidatosCarregados = await buscarCandidatosSimulados();
  return candidatosCarregados;
}

// Compara email e senha informados com a lista de candidatos para decidir se o login é válido.
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

// Interface pública para autenticação, retornando o resultado do login com o candidato encontrado.
export async function realizarLogin(email, senha) {
  let resposta = await verificarEmailSenha({ email: email, senha: senha });
  return resposta;
}
