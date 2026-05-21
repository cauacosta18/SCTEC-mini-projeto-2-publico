# SkillMatch JS

## Sobre o projeto

O **SkillMatch JS** é um simulador de compatibilidade entre candidatos e vagas de desenvolvimento Front-End Júnior, desenvolvido em JavaScript puro.

O sistema compara as habilidades de um candidato com os requisitos exigidos pelas vagas cadastradas e apresenta:

* percentual de compatibilidade;
* habilidades encontradas;
* habilidades faltantes;
* classificação da compatibilidade;
* vaga mais compatível;
* recomendações de estudo.

O projeto foi desenvolvido com foco na prática dos principais conceitos estudados no Módulo 01 do curso de Programação Front-End React.

---

## Funcionalidades

### Sistema de Login

O usuário pode realizar login utilizando email e senha de candidatos cadastrados no sistema.

### Visualização de vagas

O sistema exibe todas as vagas disponíveis com:

* empresa;
* cargo;
* requisitos;
* salário;
* modalidade;
* nível da vaga.

### Compatibilidade entre candidato e vaga

O sistema calcula automaticamente a compatibilidade do candidato com cada vaga com base nas habilidades atendidas.

### Classificação automática

As vagas são classificadas em:

* Alta compatibilidade;
* Média compatibilidade;
* Baixa compatibilidade.

### Recomendação de estudos

O sistema identifica habilidades faltantes e sugere conteúdos prioritários para estudo.

### Simulação de carregamento

As vagas e candidatos são carregados utilizando `Promise` e `async/await`, simulando uma busca em servidor.

### Contador de buscas

O projeto utiliza um `closure` para armazenar a quantidade de buscas realizadas durante a execução.

---

## Conceitos utilizados

O projeto foi desenvolvido utilizando os seguintes conceitos:

* lógica de programação;
* JavaScript;
* tipos de dados;
* condicionais;
* operadores;
* escopo;
* laços de repetição;
* funções;
* arrow functions;
* arrays;
* métodos de array (`map`, `find`, `every`);
* objetos;
* Programação Orientada a Objetos (POO);
* classes;
* construtores;
* herança;
* uso do `this`;
* callbacks;
* closures;
* Promises;
* async/await;
* Git e GitHub;
* Kanban.

---

## Estrutura do projeto

```txt
sctec-mini-projeto/
│
├── index.html
├── README.md
├── skillmatch.js
└── planejamento/
    └── tarefas-kanban.md
```

---

## Tecnologias utilizadas

* JavaScript
* Git
* GitHub
* VS Code

---

## Métodos de Array utilizados

O projeto utiliza diversos métodos de array para manipulação dos dados:

| Método    | Utilização                                               |
| --------- | -------------------------------------------------------- |
| `map()`   | Transformar candidatos e vagas em instâncias de classes  |
| `find()`  | Buscar vagas e candidatos específicos                    |
| `every()` | Verificar se todos os requisitos da vaga foram atendidos |

---

## Conceitos de POO aplicados

O projeto aplica conceitos de Programação Orientada a Objetos utilizando:

### Classe base

```js
class Vaga
```

### Herança

```js
class VagaFrontEnd extends Vaga
```

## Callback utilizado

O projeto utiliza callback na função:

```js
processarVagas(vagas, callback)
```

Após o processamento das vagas, uma função é executada para exibir a quantidade de vagas encontradas.

---

## Closure utilizado

O projeto utiliza closure para criar um contador de buscas:

```js
function criarContadorBuscas()
```

O valor da variável interna permanece armazenado entre as execuções da função.

---

## Simulação de servidor

O projeto utiliza:

* `Promise`
* `setTimeout`
* `async/await`

para simular carregamento de dados vindos de um servidor.

---

## Como executar o projeto

O projeto foi desenvolvido utilizando JavaScript puro e pode ser executado diretamente no navegador.

### Passo a passo

1. Clone o repositório:

```bash id="qkg6y7"
git clone <url-do-repositorio>
```

2. Abra a pasta do projeto no VS Code.

3. Abra o seguinte arquivo no navegador:

```txt id="7jlwmv"
index.html
```

4. O sistema iniciará automaticamente.

5. Faça o login e acesse as funcionalidades do sistema.

---

## Usuários disponíveis para teste

O sistema possui candidatos cadastrados para simulação de login.

### Senha padrão

Todos os usuários utilizam a seguinte senha:

```txt id="y4wb14"
123
```

### Emails disponíveis

| Nome     | Email                |
| -------- | -------------------- |
| Ana      | `ana@email.com`      |
| Carlos   | `carlos@email.com`   |
| Marina   | `marina@email.com`   |
| Lucas    | `lucas@email.com`    |
| Fernanda | `fernanda@email.com` |
| Rafael   | `rafael@email.com`   |
| Juliana  | `juliana@email.com`  |
| Pedro    | `pedro@email.com`    |

---

## Autor

Projeto desenvolvido por Cauã Luiz Costa para o Mini-Projeto Avaliativo do Módulo 01 de Programação Front-End React.