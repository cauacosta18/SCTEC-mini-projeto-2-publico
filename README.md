# SkillMatch JS

## Sobre o projeto

O **SkillMatch JS** é um simulador de compatibilidade entre candidatos e vagas de desenvolvimento Front-End Júnior, desenvolvido.

O sistema compara as habilidades de um candidato com os requisitos exigidos pelas vagas cadastradas e apresenta:

- percentual de compatibilidade;
- habilidades encontradas;
- habilidades faltantes;
- classificação da compatibilidade;
- vaga mais compatível;
- recomendações de estudo.

O projeto foi desenvolvido com foco na prática dos principais conceitos estudados no módulo de programação e desenvolvimento Front-End e está organizado em uma estrutura multi-página com fluxo de login, cadastro, perfil e vagas.

## Link do projeto

- [Acessar projeto no GitHub Pages](https://cauacosta18.github.io/SCTEC-mini-projeto-2-publico/ui/paginaLogin/paginaLogin.html)

## Link do Trello

- [Quadro no Trello](https://trello.com/invite/b/6a0bbe22bc0ad62df6e6208e/ATTIf97ca15e442ac1f47e3e176c40c2ecb325401D71/sctec-mini-projeto)

---

## Funcionalidades implementadas

### 1. Sistema de login

O usuário pode realizar login utilizando e-mail e senha de candidatos cadastrados no sistema.

### 2. Cadastro de candidatos

É possível cadastrar novos candidatos, com nome, e-mail, senha, área, experiência e habilidades. Os dados são persistidos no localStorage.

### 3. Tela de perfil

A página de perfil exibe os dados do usuário logado, incluindo nome, e-mail, área, experiência e habilidades.

### 4. Visualização de vagas

O sistema exibe vagas com informações como:

- empresa;
- cargo;
- requisitos;
- salário;
- modalidade;
- nível da vaga.

### 5. Compatibilidade entre candidato e vaga

O sistema calcula automaticamente a compatibilidade entre o usuário logado e cada vaga com base nas habilidades atendidas.

### 6. Classificação automática

As vagas são classificadas em:

- Alta compatibilidade;
- Média compatibilidade;
- Baixa compatibilidade.

### 7. Recomendação de estudos

O projeto identifica requisitos não atendidos e sugere habilidades prioritárias para estudo.

### 8. Tema claro/escuro

A interface possui alternância entre modo claro e escuro, com persistência no localStorage.

### 9. Feedback visual

O sistema exibe alertas e animações de carregamento para melhorar a experiência do usuário.

---

## Conceitos utilizados

O projeto foi desenvolvido utilizando conceitos de:

- lógica de programação;
- JavaScript;
- tipos de dados;
- condicionais;
- operadores;
- escopo;
- laços de repetição;
- funções;
- arrow functions;
- arrays;
- métodos de array como map, find, filter e every;
- objetos;
- Programação Orientada a Objetos (POO);
- classes;
- construtores;
- herança;
- uso do this;
- callbacks;
- closures;
- Promises;
- async/await;
- fetch para carregar dados locais;
- HTML 5
- CSS 3
- flexbox
- LocalStorage;
- Git e GitHub;
- Kanban.

---

## Estrutura do projeto

```txt
sctec-mini-projeto-2/
│
├── README.md
├── index.html
├── dados/
│   ├── candidatos.json
│   └── vagas.json
├── estilo/
│   └── style.css
├── img/
│   ├── icones/
│   │    ├── about.txt
│   │    ├── favicon.ico
│   │    └── site.webmanifest
│   └── candidatos/
│       ├── ana.svg
│       ├── carlos.svg
│       ├── default.svg
│       ├── fernanda.svg
│       ├── juliana.svg
│       ├── lucas.svg
│       ├── marina.svg
│       ├── pedro.svg
│       └── rafel.svg
├── motor/
│   ├── candidatos.js
│   ├── vagas.js
│   ├── utilidades.js
│   └── skillmatch.js
├── ui/
│   ├── paginaLogin/
│   │   ├── paginaLogin.html
│   │   ├── paginaLogin.css
│   │   └── paginaLogin.js
│   ├── paginaCadastro/
│   │   ├── paginaCadastro.html
│   │   ├── paginaCadastro.css
│   │   └── paginaCadastro.js
│   ├── paginaPerfil/
│   │   ├── paginaPerfil.html
│   │   ├── paginaPerfil.css
│   │   └── paginaPerfil.js
│   └── paginaVagas/
│       ├── paginaVagas.html
│       ├── paginaVagas.css
│       └── paginaVagas.js
└── planejamento/
    └── tarefas-kanbam.md
```

### Arquitetura atual

- A pasta [motor](motor) concentra os módulos JavaScript reutilizáveis com a lógica de candidatos, vagas, compatibilidade e utilidades.
- A pasta [ui](ui) reúne as páginas do sistema, cada uma com seu próprio HTML, CSS e JavaScript.
- Os arquivos JSON em [dados](dados) simulam a base de candidatos e vagas do projeto.
- O arquivo [index.html](index.html) funciona como ponto de entrada e redireciona para a tela de login.

---

## Tecnologias utilizadas

- JavaScript
- HTML 5
- CSS 3
- Git
- GitHub
- VS Code

---

## Como executar o projeto

Para visualizar o projeto corretamente, recomenda-se abrir a pasta no VS Code e utilizar uma extensão como Live Server para servir os arquivos localmente.

### Passo a passo

1. Clone o repositório.
2. Abra a pasta no VS Code.
3. Inicie um servidor local, como o Live Server.
4. Abra a página de login em:
   - [ui/paginaLogin/paginaLogin.html](ui/paginaLogin/paginaLogin.html)
5. Faça login com um dos usuários de teste abaixo.

---

## Usuários disponíveis para teste

O sistema possui candidatos cadastrados para simulação de login.

### Senha padrão

Todos os usuários utilizam a seguinte senha:

```txt
123
```

### E-mails disponíveis

| Nome     | E-mail                |
| -------- | --------------------- |
| Ana      | ana@email.com         |
| Carlos   | carlos@email.com      |
| Marina   | marina@email.com      |
| Lucas    | lucas@email.com       |
| Fernanda | fernanda@email.com    |
| Rafael   | rafael@email.com      |
| Juliana  | juliana@email.com     |
| Pedro    | pedro@email.com       |

---

## Autor

Projeto desenvolvido por Cauã Luiz Costa para o Projeto Avaliativo do curso SCTEC na trilha de desenvolvimento de software módulo 1.
