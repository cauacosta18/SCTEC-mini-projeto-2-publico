import { ativarAlerta, transformarLocalstorage } from "./../../skillmatch.js";
import { buscarVagas } from "./../../skillmatch.js";
import { Candidato } from "./../../skillmatch.js";
import { VagaFrontEnd } from "./../../skillmatch.js";
import { CompatibilidadeInfo } from "./../../skillmatch.js";
import { buscarSugestoes } from "./../../skillmatch.js";
import { animarCirculoCarregamento } from "./../../skillmatch.js";

//QUANDO CLICA NA VAGA MOSTRA A MENSAGEM E SE CLICA EM OUTRA TEM QUE REINICIAR O TIMER

let navHeader = document.getElementById("nav-header");
let sugestoes = document.getElementById("sugestoes");
let link = document.createElement("a");
let usuarioAtual = null;

let vagasCadastradas = [];
let numVagasCadastradas;

let carregando = false;

let main = document.querySelector("main");

let carregandoDiv = document.getElementById("carregando");

let circulo = document.getElementById("circulo-carregando");

function toggleCarregando() {
    let interval;
    if (!carregando) {
        main.style.display = "none";
        carregandoDiv.style.display = "flex";
        interval = animarCirculoCarregamento(circulo);
        carregando = true;
    } else {
        main.style.display = "flex";
        carregandoDiv.style.display = "none";
        clearInterval(interval);

    }
}

let vagas = document.getElementById("vagas");

async function buscarVagasCadastradas() {
    try {
        toggleCarregando();
        let resposta = await buscarVagas();
    
        vagasCadastradas = [];
        
        for (const vagaJson of resposta.vagasCarregadas) {
            let vaga = new VagaFrontEnd();
            transformarLocalstorage(vagaJson, vaga);
            vagasCadastradas.push(vaga);
        }
    
        numVagasCadastradas = resposta.infoVagasEncontradas?.numVagas ?? vagasCadastradas.length;

        setTimeout(()=>{
            toggleCarregando();
        }, 5000);
        numeroDePaginas = Math.ceil(numVagasCadastradas / vagasPorPagina);
        for (let index = 1; index <= numeroDePaginas; index++) {
            paginasDisponiveis.innerHTML += `<span class="span-pagina" >${index}</span>`
            
        }
        
        spansPaginas = document.querySelectorAll(".span-pagina");
        spansPaginas[0].id = "pagina-atual"
        

        return vagasCadastradas;

    } catch (error) {
        ativarAlerta(alerta, "Erro ao buscar vagas.")
    }
}

let paginaAtual = 1;
let vagasPorPagina = 3;

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
        

        let indice = vagasCadastradas.findIndex(vagaCadastrada => vagaCadastrada === vaga);

        let indexVagaAtiva = -1;

        
        
        if (vagaAtiva) {

            indexVagaAtiva = Number(vagaAtiva.dataset.index); 
            
        }
        
        
        
        
        

        let requisitos = "";
        for (const requisito of vaga.requisitos) {
            requisitos += `<div>${requisito}</div>`
        }

        let requisitosFaltantes = "";
        if (localStorage.getItem("usuarioAtual")) {
            
            if (compatibilidadesInfoPorVaga[indice].requisitosNaoAtendidos.length === 0) {
                requisitosFaltantes = `<p>Não há nenhum requisito faltante.</p>`
            }
            for (const requisito of compatibilidadesInfoPorVaga[indice].requisitosNaoAtendidos) {
                requisitosFaltantes += `<div>${requisito}</div>`;
            }
        } else {
            requisitosFaltantes = `<p>Faça o login para ver os requisitos faltantes.</p>`
        }


        let sectionVaga = document.createElement("section");
        sectionVaga.classList.add("vaga")
        sectionVaga.classList.add("card")
        indice === indexVagaAtiva ? sectionVaga.classList.add("vaga-ativa") : null;
        sectionVaga.dataset.index = indice;

        sectionVaga.innerHTML = `
            <div>
                <p class="descricao">${vaga.empresa}</p>
                <h3>${vaga.cargo}</h3>
            </div>
            <div>
                <p class="descricao">Requisitos:</p>
                <section class="requisitos-vaga conjunto conjunto-ativado">
                    ${requisitos}
                </section>
            </div>
            <div>
                <p class="descricao">Salário:</p>
                <p>R$ ${(vaga.salario.toFixed(2))}</p>
            </div>
            <div class="container-duplo">
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
            <section class="requisitos-faltantes-vaga conjunto conjunto-desativado">
                ${requisitosFaltantes}
            </section>
        `;
        if (sectionsVagas.some(x => x.dataset.index === sectionVaga.dataset.index)) {
            let indiceSubstituir = sectionsVagas.findIndex(x => x.dataset.index === sectionVaga.dataset.index);
            
            
            sectionsVagas[indiceSubstituir] = sectionVaga;
            
        } else {

            sectionsVagas.push(sectionVaga);
        }
        
        vagas.appendChild(sectionVaga);
        indice === indexVagaAtiva ? (vagaAtiva = sectionVaga) : null;

        
    }

    listaVagas = document.querySelectorAll(".vaga");
    

    
    if (localStorage.getItem("usuarioAtual")) {
        
        for (const vaga of listaVagas) {
            
            vaga.addEventListener("click", (event)=> {
                event.stopPropagation();
                acionarAnalise(vaga)
    
            })
        }

    } else {
        for (const vaga of listaVagas) {
            vaga.addEventListener("click", ()=>{
                ativarAlerta(alerta, "Faça o login para realizar a análise de compatibilidade.")
            })
        }
    }
    
    
}

let alerta = document.getElementById("alerta");



// document.addEventListener("dblclick", (event)=> {
//     if (!event.target.closest("#analise")) {
//         desativarAnalise();        
        
//     }
    
// })

let listaVagas;

let paginaVagas = document.getElementById("pagina-vagas");

let classificacaoAnalise = document.getElementById("classificacao-analise");
let compatibilidadeAnalise = document.getElementById("compatibilidade-analise");
let nomeEmpresaAnalise = document.getElementById("nome-empresa-analise");
let nivelVagaAnalise = document.getElementById("nivel-vaga-analise");
let habilidadesEncontradasAnalise = document.getElementById("habilidades-encontradas-analise");
let habilidadesFaltantesAnalise = document.getElementById("habilidades-faltantes-analise");

let analise = document.getElementById("analise");
let principal = document.getElementById("principal");


let btnFecharAnalise = document.getElementById("btn-fechar-analise");

btnFecharAnalise.addEventListener("click", ()=>{
    desativarAnalise();
})



function desativarAnalise() {

    const largura = document.documentElement.clientWidth;
    
    if (largura > 1100) {
        analise.style.right = "-1000px";
        principal.style.width = "100%";
        analise.style.transform = "translateX(0)";
        analise.offsetWidth;
        principal.offsetWidth;
        paginaVagas.offsetWidth;
        
    } else {
        analise.style.transform = "translateX(calc((100vw)*1))"
        analise.style.display = "none";
        analise.offsetWidth;
        principal.style.display = "flex";
        principal.offsetWidth;
        principal.style.transform = "translateX(0)"
        paginaVagas.style.transform = "translateX(0)";
        document.body.offsetHeight;
        analise.offsetHeight;
        principal.offsetHeight;
        
        
    }
}

function limparEstilosResponsivos() {

    principal.style.removeProperty("display");
    principal.style.removeProperty("width");
    principal.style.removeProperty("transform");

    analise.style.removeProperty("display");
    analise.style.removeProperty("transform");
    analise.style.removeProperty("right");

    paginaVagas.style.removeProperty("transform");

}

let resizeTimer;

const temToque = window.matchMedia("(pointer: coarse)").matches;

if (!temToque) {
    analise.style.display = "flex";
    
    window.addEventListener("resize", ()=> {
    
        clearTimeout(resizeTimer);
    
        resizeTimer = setTimeout(() => {
    
            limparEstilosResponsivos()
            desativarAnalise();
            
    
        }, 200);
    
            
    })
} else {
    analise.style.display = "none";
}



let vagaAtiva;



function displayAnalise(vaga) {

    const largura = document.documentElement.clientWidth;
    

    if (vaga) {
        
        vaga.classList.add("vaga-ativa");
    }
    if (largura > 1100) {
        analise.style.display = "flex";
        analise.style.right = "20px";
        principal.style.width = "calc((100% / 3) * 2 - 20px)";
    } else {

        principal.style.transform = "translateX(calc((100vw)*-1))"
        principal.style.display = "none";
        principal.offsetWidth;
        analise.style.display = "flex";
        analise.offsetWidth;
        analise.style.transform = "translateX(0)"
        paginaVagas.style.transform = "translateX(0)";
        document.body.offsetHeight;
        analise.offsetHeight;
        
        // paginaVagas.style.left = "calc((100%)*-1)"
    }
    
}

function acionarAnalise(vaga) {

    

    if (vagaAtiva) {
        if (vagaAtiva.dataset.index === vagaDestaque.dataset.index) {
            
            vagaDestaque.classList.remove("vaga-ativa");
        }
        vagaAtiva.classList.remove("vaga-ativa");
    }

    
    vagaAtiva = vaga;

    if (vagaAtiva.dataset.index === vagaDestaque.dataset.index) {

        vagaAtiva.classList.add("vaga-ativa")
        vagaDestaque.classList.add("vaga-ativa")
    }

    
    displayAnalise(vaga);
    window.scrollTo(0, 0)

    

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
    // Atualizar apenas os elementos específicos
    document.getElementById("classificacao-analise").textContent = compatibilidade.classificacao;
    document.getElementById("compatibilidade-analise").textContent = `${compatibilidade.compatibilidade}%`;
    document.getElementById("nome-empresa-analise").textContent = vagaCadastrada.empresa;
    document.getElementById("nivel-vaga-analise").textContent = vagaCadastrada.nivel;
    document.getElementById("habilidades-encontradas-analise").innerHTML = habilidadesEncontradas;
    document.getElementById("habilidades-faltantes-analise").innerHTML = habilidadesFaltantes;

    
    
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

let sectionsVagas = [];

let vagaComMaiorCompatibilidade;
let requisitosFaltantesVagaComMaiorCompatibilidade = [];

let vagaDestaque = document.getElementById("vaga-destaque");

vagaDestaque.addEventListener("click", (event)=> {
    event.stopPropagation();
    let vagaCorrespondente = sectionsVagas.find(sectionVaga => sectionVaga.dataset.index === vagaDestaque.dataset.index);
    vagaDestaque.classList.add("vaga-ativa");
    
    
    
    acionarAnalise(vagaCorrespondente);
})

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
    sugestoes.style.display = "grid";

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

    let index = vagasCadastradas.findIndex(vaga => vaga.id === vagaComMaiorCompatibilidade.id);

    vagaDestaque.dataset.index = index;

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

let btnAvancarVagas = document.getElementById("btn-avancar-vagas");
let btnVoltarVagas = document.getElementById("btn-voltar-vagas");
let numeroDePaginas;

btnAvancarVagas.addEventListener("click", ()=>{
    vagasAvancarVoltar(true)
})

btnVoltarVagas.addEventListener("click", ()=>{
    vagasAvancarVoltar(false)
})


let paginasDisponiveis = document.getElementById("paginas-disponiveis");
let spansPaginas = [];

let translateXAtual = 40;


function vagasAvancarVoltar(avancar) {
    if (avancar) {
        if (paginaAtual === numeroDePaginas) {
            return;
        }
        paginaAtual++;
        translateXAtual -= 40;
        paginasDisponiveis.style.transform = `translateX(${translateXAtual}px)`;
        spansPaginas[paginaAtual - 1].id = "pagina-atual";
        spansPaginas[paginaAtual-2].id = "";
        window.scrollTo(0,0)
        prepararVagas();
        
    } else {
        if (paginaAtual === 1) {
            return;
        }
        paginaAtual--;
        translateXAtual += 40;
        paginasDisponiveis.style.transform = `translateX(${translateXAtual}px)`;
        spansPaginas[paginaAtual - 1].id = "pagina-atual";
        spansPaginas[paginaAtual].id = "";
        window.scrollTo(0,0)
        prepararVagas();
    }
}