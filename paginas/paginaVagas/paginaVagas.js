import { transformarLocalstorage } from "./../../skillmatch.js";
import { buscarVagas } from "./../../skillmatch.js";
import { Candidato } from "./../../skillmatch.js";
import { VagaFrontEnd } from "./../../skillmatch.js";
import { CompatibilidadeInfo } from "./../../skillmatch.js";
import { buscarSugestoes } from "./../../skillmatch.js";



let navHeader = document.getElementById("nav-header");
let sugestoes = document.getElementById("sugestoes");
let link = document.createElement("a");
let usuarioAtual = null;

let vagasCadastradas = [];
let numVagasCadastradas;

let vagas = document.getElementById("vagas");

async function buscarVagasCadastradas() {
    let resposta = await buscarVagas();
    vagasCadastradas = [];
    

    for (const vagaJson of resposta.vagasCarregadas) {
        let vaga = new VagaFrontEnd();
        transformarLocalstorage(vagaJson, vaga);
        vagasCadastradas.push(vaga);
    }

    numVagasCadastradas = resposta.infoVagasEncontradas?.numVagas ?? vagasCadastradas.length;
    return vagasCadastradas;
}

let paginaAtual = 1;
let vagasPorPagina = 6;

function separarVagas() {
    let inicio = (paginaAtual-1) * vagasPorPagina;
    let fim = inicio + vagasPorPagina;

    let vagasDaPagina = vagasCadastradas.slice(inicio, fim);

    return vagasDaPagina
}

function prepararVagas() {
    vagas.innerHTML = "";

    let vagasDaPagina = separarVagas();    
    
    for (const [index, vaga] of vagasDaPagina.entries()) {

        let requisitos = "";
        for (const requisito of vaga.requisitos) {
            requisitos += `<div>${requisito}</div>`
        }

        let requisitosFaltantes = "";
        if (localStorage.getItem("usuarioAtual")) {
            
            if (compatibilidadesInfoPorVaga[index].requisitosNaoAtendidos.length === 0) {
                requisitosFaltantes = `<p>Não há nenhum requisito faltante.</p>`
            }
            for (const requisito of compatibilidadesInfoPorVaga[index].requisitosNaoAtendidos) {
                requisitosFaltantes += `<div>${requisito}</div>`;
            }
        } else {
            requisitosFaltantes = `<p>Faça o login para ver os requisitos faltantes.</p>`
        }
        
        
        vagas.innerHTML += `
            <section class="vaga" data-index="${index}">
                <p>${vaga.empresa}</p>
                <h3>${vaga.cargo}</h3>
                <p>Requisitos:</p>
                <section class="requisitos-vaga">
                    ${requisitos}
                </section>
                <p>Salário:</p>
                <p>R$ ${(vaga.salario.toFixed(2))}</p>
                <div>
                    <div>
                        <p>Modalidade:</p>
                        <p>${vaga.modalidade}</p>
                    </div>
                    <div>
                        <p>Nível da vaga:</p>
                        <p>${vaga.nivel}</p>
                    </div>
                </div>
                <p>Requisitos faltantes:</p>
                <section class="requisitos-faltantes-vaga">
                    ${requisitosFaltantes}
            </section>
        `;

        
    }

    listaVagas = document.querySelectorAll(".vaga");
    

    
    if (localStorage.getItem("usuarioAtual")) {
        
        for (const vaga of listaVagas) {
            
            vaga.addEventListener("click", ()=> {
                
                acionarAnalise(vaga)
    
            })
        }
    }
    
    
}

let listaVagas;


let classificacaoAnalise = document.getElementById("classificacao-analise");
let compatibilidadeAnalise = document.getElementById("compatibilidade-analise");
let nomeEmpresaAnalise = document.getElementById("nome-empresa-analise");
let nivelVagaAnalise = document.getElementById("nivel-vaga-analise");
let habilidadesEncontradasAnalise = document.getElementById("habilidades-encontradas-analise");
let habilidadesFaltantesAnalise = document.getElementById("habilidades-faltantes-analise");

let analise = document.getElementById("analise");

function acionarAnalise(vaga) {
    let vagaCadastrada = vagasCadastradas[vaga.dataset.index];
    let compatibilidade = compatibilidadesInfoPorVaga[vaga.dataset.index];
    
    let habilidadesEncontradas = "";
    if (compatibilidade.requisitosAtendidos.length === 0) {
        habilidadesEncontradas = "<p>Nenhum habilidade em comum.</p>"
    }
    for (const habilidade of compatibilidade.requisitosAtendidos) {
        habilidadesEncontradas += `<div>${habilidade}</div>`;
    }

    let habilidadesFaltantes = "";
    if (compatibilidade.requisitosNaoAtendidos.length === 0) {
        habilidadesFaltantes = "<p>Nenhum habilidade faltante.</p>"
    }
    for (const habilidade of compatibilidade.requisitosNaoAtendidos) {
        habilidadesFaltantes += `<div>${habilidade}</div>`;
    }

    analise.style.display = "flex";
    analise.innerHTML = `
        <h2>Análise</h2>
        <p>Classificação:</p>
        <p id="classificacao-analise">${compatibilidade.classificacao}</p>
        <p>Compatibilidade:</p>
        <p id="compatibilidade-analise">${compatibilidade.compatibilidade}%</p>

        <p>Nome da Empresa:</p>
        <p id="nome-empresa-analise">${vagaCadastrada.empresa}</p>

        <p>Nível da vaga:</p>
        <p id="nivel-vaga-analise">${vagaCadastrada.nivel}</p>

        <p>Habilidades encontradas:</p>
        <section id="habilidades-encontradas-analise">
            ${habilidadesEncontradas}
        </section>

        <p>Habilidades faltantes:</p>
        <section id="habilidades-faltantes-analise">
            ${habilidadesFaltantes}
        </section>
    `;
}



async function inicializarPaginaVagas() {
    if (localStorage.getItem("usuarioAtual")) {
        link.textContent = "perfil";
        link.href = "./../paginaPerfil/paginaPerfil.html";

        let json = JSON.parse(localStorage.getItem("usuarioAtual"));
        usuarioAtual = new Candidato();

        transformarLocalstorage(json, usuarioAtual);

        await buscarVagasCadastradas();
        prepararSugestões();

        prepararVagas();
    } else {
        link.textContent = "login";
        link.href = "./../paginaLogin/paginaLogin.html";
        await buscarVagasCadastradas();
        prepararVagas();
    }
    navHeader.append(link)
}

inicializarPaginaVagas();

let vagaComMaiorCompatibilidade;
let requisitosFaltantesVagaComMaiorCompatibilidade = [];

let nomeEmpresaVagaDestaque = document.getElementById("nome-empresa-vaga-destaque");
let cargoVagaDestaque = document.getElementById("cargo-vaga-destaque");
let modalidadeVagaDestaque = document.getElementById("modalidade-vaga-destaque");
let nivelVagaDestaque = document.getElementById("nivel-vaga-destaque");
let salarioVagaDestaque = document.getElementById("salario-vaga-destaque");
let requisitosFaltantesVagaDestaque = document.getElementById("requisitos-faltantes-vaga-destaque");
let requisitosVagaDestaque = document.getElementById("requisitos-vaga-destaque");
let recomendacoesEstudo = document.getElementById("recomendacoes-estudo");

let compatibilidadesInfoPorVaga = [];

function prepararSugestões() {
    sugestoes.style.display = "flex";

    let resposta = buscarSugestoes
    (usuarioAtual, vagasCadastradas);

    for (const compatibilidadeIndojson of resposta.compatibilidadesInfoPorVaga) {
        let compatibilidadeInfo = new CompatibilidadeInfo();

        transformarLocalstorage(compatibilidadeIndojson, compatibilidadeInfo);

        compatibilidadesInfoPorVaga.push(compatibilidadeInfo);
    }
    
    
    let sugestao = resposta.vagaComMaiorCompatibilidade;

    vagaComMaiorCompatibilidade = new VagaFrontEnd();
    transformarLocalstorage(sugestao.vaga, vagaComMaiorCompatibilidade);
    
    let recomendacaoDeEstudo = resposta.recomendacaoDeEstudo;
    requisitosFaltantesVagaComMaiorCompatibilidade = [];
    for (const requisito of sugestao.requisitosNaoAtendidos) {
        requisitosFaltantesVagaComMaiorCompatibilidade.push(requisito);
    }

    nomeEmpresaVagaDestaque.textContent = vagaComMaiorCompatibilidade.empresa;
    cargoVagaDestaque.textContent = vagaComMaiorCompatibilidade.cargo;
    modalidadeVagaDestaque.textContent = vagaComMaiorCompatibilidade.modalidade;
    nivelVagaDestaque.textContent = vagaComMaiorCompatibilidade.nivel;
    salarioVagaDestaque.textContent = `R$ ${(vagaComMaiorCompatibilidade.salario).toFixed(2)}`;

    requisitosVagaDestaque.innerHTML = "";
    for (const requisito of vagaComMaiorCompatibilidade.requisitos) {
        requisitosVagaDestaque.innerHTML += `<div>${requisito}</div>`;
    }    
    
    if (requisitosFaltantesVagaComMaiorCompatibilidade.length === 0) {
        requisitosFaltantesVagaDestaque.innerHTML = "<p>Não há nenhum requisito faltante.</p>";
        requisitosFaltantesVagaDestaque.style.display = "flex"
    }
    
    for (const requisito of requisitosFaltantesVagaComMaiorCompatibilidade) {
        requisitosFaltantesVagaDestaque.innerHTML += `<div>${requisito}</div>`;
    }

    recomendacoesEstudo.innerHTML= "";
    for (const recomendacao of recomendacaoDeEstudo) {
        recomendacoesEstudo.innerHTML += `<div>${recomendacao}</div>`
    }
}

