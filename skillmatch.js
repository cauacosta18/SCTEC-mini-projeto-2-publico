const candidato = {
    nome: "Ana",
    area: "Front-End",
    habilidades: ["JavaScript", "GitHub", "Lógica de Programação", "Kanban"],
    experienciaMeses: 3
};

const vagas = [
    {
    id: 1,
    empresa: "TechStart",
    cargo: "Desenvolvedor Front-End Júnior",
    requisitos: ["JavaScript", "GitHub", "Lógica de Programação"],
    salario: 2800,
    modalidade: "Remoto",
    nivel: "Júnior"
    },
    {
    id: 2,
    empresa: "CodeLab",
    cargo: "Estágio Front-End",
    requisitos: ["JavaScript", "Kanban", "GitHub"],
    salario: 1800,
    modalidade: "Híbrido",
    nivel: "Estágio"
    },
    {
    id: 3,
    empresa: "WebSolutions",
    cargo: "Programador JavaScript Júnior",
    requisitos: ["JavaScript", "Arrays", "Objetos", "Funções"],
    salario: 3000,
    modalidade: "Presencial",
    nivel: "Júnior"
    }
];

function calcularCompatibilidade(candidato, vaga) {
  const requisitosAtendidos = [];
  const requisitosNaoAtendidos = [];

  for (const requisito of vaga.requisitos) {
    if (candidato.habilidades.includes(requisito)) {
      requisitosAtendidos.push(requisito);
    } else {
      requisitosNaoAtendidos.push(requisito);
    }
  }

  const compatibilidade =
    (requisitosAtendidos.length /
      vaga.requisitos.length) * 100;

  let classificacao = "";

  if (compatibilidade >= 80) {
    classificacao = "Alta compatibilidade";
  } else if (compatibilidade >= 50) {
    classificacao = "Média compatibilidade";
  } else {
    classificacao = "Baixa compatibilidade";
  }

  console.log("Empresa: "+vaga.empresa+
    "\nCargo: "+vaga.cargo+
    "\mCompatibilidade: "+compatibilidade+"%"+
    "\nHabilidades encontradas: "+requisitosAtendidos.join(", ")+
    "\nHabilidades faltantes: "+requisitosNaoAtendidos.join(", ")+
    "\nClassificação: "+classificacao
  );
}

for (const vaga of vagas) {
  calcularCompatibilidade(candidato, vaga);
}