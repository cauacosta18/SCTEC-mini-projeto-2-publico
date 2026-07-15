import { ativarAlerta, transformarLocalstorage } from "./../../skillmatch.js";
import { buscarVagas } from "./../../skillmatch.js";
import { Candidato } from "./../../skillmatch.js";
import { VagaFrontEnd } from "./../../skillmatch.js";
import { CompatibilidadeInfo } from "./../../skillmatch.js";
import { buscarSugestoes } from "./../../skillmatch.js";
import { animarCirculoCarregamento, contarBuscas, acionarModoExibicao } from "./../../skillmatch.js";

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

let interval;
function toggleCarregando() {
    if (!carregando) {
        carregandoDiv.style.display = "flex";
        interval = animarCirculoCarregamento(circulo);
        carregando = true;
    } else {
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

        let niveis = [];
        let modalidades = [];
        
        for (const vagaJson of resposta.vagasCarregadas) {
            let vaga = new VagaFrontEnd();
            transformarLocalstorage(vagaJson, vaga);
            vagasCadastradas.push(vaga);

            if (!niveis.some(nivel => nivel === vaga.nivel)) {
                niveis.push(vaga.nivel);
                let option = document.createElement("option");
                option.value = vaga.nivel;
                option.textContent = vaga.nivel;
                if (filtro.nivel === vaga.nivel) {
                    option.selected = true;
                }
                nivelFiltro.append(option);
            }
            if (!modalidades.some(modalidade => modalidade === vaga.modalidade)) {
                modalidades.push(vaga.modalidade);
                let option = document.createElement("option");
                option.value = vaga.modalidade;
                option.textContent = vaga.modalidade;
                if (filtro.modalidade === vaga.modalidade) {
                    option.selected = true;
                }
                modalidadeFiltro.append(option);
                
            }
            
        }
    
        numVagasCadastradas = resposta.infoVagasEncontradas?.numVagas ?? vagasCadastradas.length;

        setTimeout(()=>{
            carregando = true;
            toggleCarregando();
        }, 3000);

        

        vagasFiltradas = vagasCadastradas;
        return vagasCadastradas;

    } catch (error) {
        
        
        ativarAlerta(alerta, "Erro ao buscar vagas.");
        setTimeout(()=>{
            window.location.href = "./../paginaPerfil/paginaPerfil.html";
        },3000)
    }
}

let paginaAtual = 1;
let vagasPorPagina = 3;

function separarVagas(vagasFiltradas) {
    let inicio = (paginaAtual-1) * vagasPorPagina;
    let fim = inicio + vagasPorPagina;

    let vagasDaPagina = vagasFiltradas.slice(inicio, fim);

    return vagasDaPagina
}

function atualizarPaginacao(numVagas) {
    paginaAtual = 1;
    translateXAtual = 40;
    numeroDePaginas = Math.max(1, Math.ceil(numVagas / vagasPorPagina));

    paginasDisponiveis.innerHTML = "";
    for (let index = 1; index <= numeroDePaginas; index++) {
        paginasDisponiveis.innerHTML += `<span class="span-pagina" >${index}</span>`
    }

    paginasDisponiveis.style.transform = `translateX(${translateXAtual}px)`;

    spansPaginas = document.querySelectorAll(".span-pagina");
    spansPaginas[0].id = "pagina-atual"
}

function filtrarVagas() {
    vagasFiltradas = vagasCadastradas;
    if (filtro.cargo !== "") {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.cargo.includes(filtro.cargo))
    }
    if (filtro.empresa !== "") {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.empresa.includes(filtro.empresa))
    }
    if (filtro.minimo !== null) {
        if (filtro.maximo !== 0) {
            vagasFiltradas = vagasFiltradas.filter(vaga => vaga.salario >= filtro.minimo && vaga.salario <= filtro.maximo)
        } else {
            vagasFiltradas = vagasFiltradas.filter(vaga => vaga.salario >= filtro.minimo);
        }
    }
    if (filtro.modalidade !== "") {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.modalidade === filtro.modalidade)
    }
    if (filtro.nivel !== "") {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.nivel === filtro.nivel)
    }
    if (filtro.tecnologias.length > 0) {
        vagasFiltradas = vagasFiltradas.filter(vaga =>
            filtro.tecnologias.every(tecnologia =>
                vaga.requisitos.includes(tecnologia)
            )
        );
    }
    
    

    return vagasFiltradas;
}

let vagasFiltradas;

function prepararVagas() {
    vagas.innerHTML = "";
    
    if (vagasFiltradas.length === 0) {
        vagas.innerHTML = `
        
        <div class="card" id="nenhum-vaga">
            <p>Nenhum vaga encontrada.</p>
        </div>
        `;
    }
    
    let vagasDaPagina = separarVagas(vagasFiltradas);
    
    for (const [index, vaga] of vagasDaPagina.entries()) {
        

        let indice = vagasFiltradas.findIndex(vagaCadastrada => vagaCadastrada === vaga);

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
            requisitosFaltantes = ""
            if (compatibilidadesInfoPorVaga[indice].requisitosNaoAtendidos.length === 0) {
                requisitosFaltantes = `<p>Não há nenhum requisito faltante.</p>`;
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
        document.documentElement.style.setProperty("--overflow-html", "visible");
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
        document.documentElement.style.setProperty("--overflow-html", "scroll");
        document.body.offsetHeight;
        document.body.offsetWidth;
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
    
            
    });
    document.documentElement.style.setProperty("--overflow-html", "visible");
} else {
    analise.style.display = "none";
    document.documentElement.style.setProperty("--overflow-html", "scroll");
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
        document.documentElement.style.setProperty("--overflow-html", "visible");
    } else {

        principal.style.transform = "translateX(calc((100vw)*-1))"
        principal.style.display = "none";
        principal.offsetWidth;
        analise.style.display = "flex";
        analise.offsetWidth;
        analise.style.transform = "translateX(0)"
        paginaVagas.style.transform = "translateX(0)";
        document.documentElement.style.setProperty("--overflow-html", "scroll");
        document.body.offsetHeight;
        document.body.offsetWidth;
        
        analise.offsetHeight;
        
    }
    
}

function acionarAnalise(vaga) {

    filtroAtivado = true;

    toggleFiltros()

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
        
        iniciarFiltragem();
        filtroForm.style.display = "flex";
        navHeader.append(link)
        
    } else {
        await buscarVagasCadastradas();
        prepararVagas();
        atualizarPaginacao(vagasFiltradas.length)
    }
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

let tecnologias = [];

function prepararSugestoes(vagas) {
    sugestoes.style.display = "flex";

    

    let resposta = buscarSugestoes
    (usuarioAtual, vagas, vagasCadastradas);

    compatibilidadesInfoPorVaga = [];
    for (const compatibilidadeInfojson of resposta.compatibilidadesInfoPorVaga) {
        let compatibilidadeInfo = new CompatibilidadeInfo();

        transformarLocalstorage(compatibilidadeInfojson, compatibilidadeInfo);

        compatibilidadesInfoPorVaga.push(compatibilidadeInfo);
    }
    
    
    let sugestao = resposta.vagaComMaiorCompatibilidade;
    tecnologias = resposta.tecnologias;
    for (const tecnologia of tecnologias) {
        let checkbox = document.createElement("div");
        checkbox.classList.add("item-checkbox");
        checkbox.innerHTML = ` 
        <input type="checkbox" class="tecnologia-filtro" name="tecnologia-filtro" id="${tecnologia}-filtro" value="${tecnologia}">
        <label for="${tecnologia}-filtro">${tecnologia}</label>
        `;

        if (!document.getElementById(`${tecnologia}-filtro`)) {
            
            tecnologiasFiltro.appendChild(checkbox);
        }


        let input = document.getElementById(`${tecnologia}-filtro`);

        if (localStorage.getItem("filtro")) {
            
            
            if (filtro.tecnologias.some(tecnologiaFiltro => tecnologiaFiltro === tecnologia)) {
                input.checked = true;
            }
        }
    }
    

    if (!sugestao.vaga) {
        // Nenhuma vaga corresponde aos filtros aplicados: não há vaga em destaque para mostrar.
        vagaComMaiorCompatibilidade = undefined;
        requisitosFaltantesVagaComMaiorCompatibilidade = [];
        vagaDestaque.style.display = "none";
        requisitosVagaDestaque.innerHTML = "";
        requisitosFaltantesVagaDestaque.innerHTML = "";
    } else {
        vagaDestaque.style.display = "";

        vagaComMaiorCompatibilidade = new VagaFrontEnd();
        transformarLocalstorage(sugestao.vaga, vagaComMaiorCompatibilidade);

        requisitosFaltantesVagaComMaiorCompatibilidade = [];
        for (const requisito of sugestao.requisitosNaoAtendidos) {
            requisitosFaltantesVagaComMaiorCompatibilidade.push(requisito);
        }

        let index = vagas.findIndex(vaga => vaga.id === vagaComMaiorCompatibilidade.id);

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
        requisitosFaltantesVagaDestaque.innerHTML = ""
        if (requisitosFaltantesVagaComMaiorCompatibilidade.length === 0) {
            requisitosFaltantesVagaDestaque.innerHTML = "<p>Não há nenhum requisito faltante.</p>";
            requisitosFaltantesVagaDestaque.style.display = "flex"
        }
        
        for (const requisito of requisitosFaltantesVagaComMaiorCompatibilidade) {
            requisitosFaltantesVagaDestaque.innerHTML += `<div>${requisito}</div>`;
        }
    }

    let recomendacaoDeEstudo = resposta.recomendacaoDeEstudo;

    recomendacoesEstudo.innerHTML= "";
    
    for (const recomendacao of recomendacaoDeEstudo) {
        
        recomendacoesEstudo.innerHTML += `<div>${recomendacao}</div>`;
    }

    tecnologiasFiltroCheckboxes = document.querySelectorAll(".tecnologia-filtro");
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
        window.scrollTo(0,0);
        buscas.textContent = contarBuscas();
        
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
        window.scrollTo(0,0);
        buscas.textContent = contarBuscas();
        prepararVagas();
    }
}

let buscas = document.getElementById("buscas");

buscas.textContent = contarBuscas();

let modalidadeFiltro = document.getElementById("modalidade-filtro");
let nivelFiltro = document.getElementById("nivel-filtro");
let faixaFiltro = document.getElementById("faixa-filtro");
let cargoFiltro = document.getElementById("cargo-filtro");

let empresaFiltro = document.getElementById("empresa-filtro");

let tecnologiasFiltro = document.getElementById("tecnologias-filtro");
let tecnologiasFiltroCheckboxes = document.querySelectorAll(".tecnologia-filtro");

let btnAplicarFiltros = document.getElementById("btn-aplicar-filtros");
let filtroForm = document.getElementById("filtro-form");

let filtro = {
    modalidade: "",
    nivel: "",
    minimo: null,
    maximo: 0,
    cargo: "",
    empresa: "",
    tecnologias: [],

}

let faixaOptions = faixaFiltro.options;

if (localStorage.getItem("filtro")) {
    filtro = JSON.parse(localStorage.getItem("filtro"));

    if (filtro.minimo !== null) {
        switch (filtro.minimo) {
            case 0:
                faixaOptions[1].selected = true;
                break;
            
            case 2001:
                faixaOptions[2].selected = true;
                break;

            case 3001:
                faixaOptions[3].selected = true;
                break;
            
            case 4001:
                faixaOptions[4].selected = true;
                break;

            case 5001:
                faixaOptions[5].selected = true;
                break;
        
            default:
                break;
        }
    }
    if (filtro.cargo !== "") {
        cargoFiltro.value = filtro.cargo;
    }
    if (filtro.empresa !== "") {
        empresaFiltro.value = filtro.empresa;
    }
    
}

let btnResetarFiltros = document.getElementById("btn-resetar-filtros");

btnResetarFiltros.addEventListener("click", (event)=>{
     
       
    filtro.modalidade = "";
    

    filtro.nivel = "";
    
    filtro.minimo = null;
    filtro.maximo = 0;
 
    filtro.cargo = ""
    
    
    filtro.empresa = "";
    
    filtro.tecnologias = [];
    

    let filtroJson = JSON.stringify(filtro);

    localStorage.setItem("filtro", filtroJson);

    iniciarFiltragem();

    window.scrollTo(0,0);
    ativarAlerta(alerta, "Filtro resetado.");
    buscas.textContent = contarBuscas();
})

filtroForm.addEventListener("submit", (event)=>{

    event.preventDefault()
    
    if (modalidadeFiltro.value !== "nenhum") {    
        
        filtro.modalidade = modalidadeFiltro.value;
    } else {
        filtro.modalidade = "";
    }
    if (nivelFiltro.value !== "nenhum") {
        filtro.nivel = nivelFiltro.value;
    } else {
        filtro.nivel = "";
    }
    if (faixaFiltro.value !== "nenhum") {
        let array = JSON.parse(faixaFiltro.value);
        filtro.minimo = array[0];  
        filtro.maximo = array[1]
        
    } else {
        filtro.minimo = null;
        filtro.maximo = 0;
    }
    if (cargoFiltro.value !== "") {
        filtro.cargo = cargoFiltro.value;
    } else {
        filtro.cargo = ""
    }
    if (empresaFiltro.value !== "") {
        filtro.empresa = empresaFiltro.value;
    } else {
        filtro.empresa = "";
    }
    filtro.tecnologias = [];
    for (const tecnologiaCheckbox of tecnologiasFiltroCheckboxes) {
        if (tecnologiaCheckbox.checked) {
            filtro.tecnologias.push(tecnologiaCheckbox.value);
        }
    }

    let filtroJson = JSON.stringify(filtro);

    localStorage.setItem("filtro", filtroJson);

    iniciarFiltragem();

    window.scrollTo(0,0);
    ativarAlerta(alerta, "Filtro aplicado.");
    
    buscas.textContent = contarBuscas();
    
})


function iniciarFiltragem () {
    sectionsVagas = [];
    vagaAtiva = undefined;
    vagaDestaque.classList.remove("vaga-ativa");
    vagaComMaiorCompatibilidade

    vagasFiltradas = filtrarVagas();   // calcula primeiro    

    atualizarPaginacao(vagasFiltradas.length); // recalcula páginas com base no resultado filtrado

    prepararSugestoes(vagasFiltradas); // atualiza compatibilidades

    prepararVagas(); 
}

let btnFecharFiltros = document.getElementById("btn-fechar-filtros");
let filtros = document.getElementById("filtros");

let filtroAtivado = false;

function toggleFiltros() {
    
    if (filtroAtivado) {
        filtros.style.opacity = "0"
        filtros.style.maxHeight = "15px";
        filtros.offsetHeight;
        filtroAtivado = false;
        btnFecharFiltros.classList.add("btn-abrir")
    } else {
        filtros.style.opacity = "1"
        filtros.style.maxHeight = "400px";
        filtros.offsetHeight;
        filtroAtivado = true;
        btnFecharFiltros.classList.remove("btn-abrir")
    }
}

btnFecharFiltros.addEventListener("click", ()=>{
    desativarAnalise()
    toggleFiltros()
})

let modoAtual = "escuro";

let btnTrocarModo = document.getElementById("btn-trocar-modo");

btnTrocarModo.addEventListener("click", ()=>{
    modoAtual = modoAtual === "escuro" ? "claro" : "escuro"; 
    btnTrocarModo.textContent = `modo ${modoAtual}`;
    localStorage.setItem("modo", modoAtual);
    acionarModoExibicao(document, modoAtual);
})

if (localStorage.getItem("modo")) {
    modoAtual = localStorage.getItem("modo");
} else {
    localStorage.setItem("modo", modoAtual);
}
btnTrocarModo.textContent = `modo ${modoAtual}`;
acionarModoExibicao(document, modoAtual);
