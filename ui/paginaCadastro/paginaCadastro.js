import { buscarHabilidadesDisponiveis } from "../../motor/vagas.js";
import { ativarAlerta, acionarModoExibicao } from "../../motor/utilidades.js";
import { buscarCandidatos } from "../../motor/candidatos.js";

// ==========================
// Fluxo principal do cadastro
// ==========================

// Fluxo de tema e navegação: alterna o modo visual e salva o estado no localStorage.
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

async function emailExistente(email) {
    let candidatos = await buscarCandidatos();

    if (candidatos.some(candidato => candidato.email === email)) {
        return true;
    } else {
        return false;
    }
}

let navHeader = document.getElementById("nav-header")

let link = document.createElement("a");
if (localStorage.getItem("usuarioAtual")) {
    link.textContent = "perfil";
    link.href = "./../paginaPerfil/paginaPerfil.html";
    navHeader.appendChild(link);
} 

// Fluxo de persistência do formulário: guarda os dados parcialmente preenchidos para recuperação.
let candidatosCadastrados = [];

let cadastro = {
    nome: "",
    email: "",
    senha: "",
    area: "nenhum",
    experiencia: "",
    habilidades: [],
}

function buscarCandidatosCadastradosLocalStorage() {


    if (localStorage.getItem("candidatos-cadastrados")) {

        let string = localStorage.getItem("candidatos-cadastrados");
        candidatosCadastrados = JSON.parse(string);

    }

}

function buscarCadastro() {

    if (localStorage.getItem("cadastro")) {
        let string = localStorage.getItem("cadastro");
        let objeto = JSON.parse(string);

        if (objeto.nome) {
            cadastro.nome = objeto.nome;
        }
        if (objeto.email) {
            cadastro.email = objeto.email;
        }
        if (objeto.area) {
            cadastro.area = objeto.area;
        }
        if (objeto.experiencia) {
            cadastro.experiencia = objeto.experiencia;
        }
        if (objeto.habilidades) {
            cadastro.habilidades = objeto.habilidades;
        }
    }

}

function atualizarForm () {
    nome.value = cadastro.nome;
    email.value = cadastro.email;
    for (const option of area.options) {
        if (option.value === cadastro.area) {
            option.selected = true;
        }
    }
    
    experiencia.value = cadastro.experiencia;

}

let form = document.getElementById("form");

let habilidadesCadastro = document.getElementById("habilidades-cadastro");

async function carregarHabilidades() {

    let habilidadesDisponiveis = await buscarHabilidadesDisponiveis();

    for (const habilidade of habilidadesDisponiveis) {
        let checkbox = document.createElement("div");
        checkbox.classList.add("item-checkbox");

        checkbox.innerHTML = ` 
        <input type="checkbox" class="habilidade-cadastro" name="habilidade-cadastro" id="${habilidade}-cadastro" value="${habilidade}">
        <label for="${habilidade}-cadastro">${habilidade}</label>
        `;

        if (!document.getElementById(`${habilidade}-cadastro`)) {

            habilidadesCadastro.appendChild(checkbox);
        }

        let input = document.getElementById(`${habilidade}-cadastro`);

        
        if (localStorage.getItem("cadastro")) {
            
            if (cadastro.habilidades.some(habilidadeCadastro => habilidadeCadastro === habilidade)) {
                input.checked = true;
            }
        }
    }

}

// Fluxo de carregamento das habilidades: popula as opções do formulário com base nas vagas.
let nome = document.getElementById("nome");
nome.addEventListener("change", ()=> {
    cadastro.nome = nome.value;
    let string = JSON.stringify(cadastro);
    localStorage.setItem("cadastro", string);
})
let email = document.getElementById("email");
email.addEventListener("change", ()=> {
    cadastro.email = email.value;
    let string = JSON.stringify(cadastro);
    localStorage.setItem("cadastro", string);
})
let senha = document.getElementById("senha");

let area = document.getElementById("area");
area.addEventListener("change", ()=> {
    cadastro.area = area.value;
    let string = JSON.stringify(cadastro);
    localStorage.setItem("cadastro", string);
})
let experiencia = document.getElementById("experiencia");
experiencia.addEventListener("change", ()=> {
    cadastro.experiencia = experiencia.value;
    
    let string = JSON.stringify(cadastro);
    localStorage.setItem("cadastro", string);
    
})

buscarCandidatosCadastradosLocalStorage();
buscarCadastro();
atualizarForm();
await carregarHabilidades();

let habilidadeCadastroCheckboxes = document.querySelectorAll(".habilidade-cadastro");

for (const habilidadeCheckbox of habilidadeCadastroCheckboxes) {
    habilidadeCheckbox.addEventListener("change", ()=> {
        if (habilidadeCheckbox.checked) {
            if (!cadastro.habilidades.some(habilidade => habilidade === habilidadeCheckbox.value)) {
                cadastro.habilidades.push(habilidadeCheckbox.value);
            }
        } else {
            cadastro.habilidades = cadastro.habilidades.filter(
                habilidade => habilidade !== habilidadeCheckbox.value
            );
        }

        let string = JSON.stringify(cadastro);
        localStorage.setItem("cadastro", string);
    })
}

let alerta = document.getElementById("alerta");

// Fluxo de envio do formulário: valida campos, evita e-mails duplicados e salva o cadastro.
function buscarHabilidadesEscolhidas() {

    let habilidadesEscolhidas = [];

    for (const habilidade of habilidadeCadastroCheckboxes) {
        if (habilidade.checked) {
            habilidadesEscolhidas.push(habilidade.value);
        }
    }

    return habilidadesEscolhidas;

}

function salvarCadastro(habilidadesEscolhidas) {

    cadastro.nome = nome.value;
    cadastro.email = email.value;
    cadastro.senha = senha.value;

    cadastro.area = area.value;
    cadastro.experiencia = experiencia.value;

    cadastro.habilidades = habilidadesEscolhidas;

    if (!localStorage.getItem("candidatos-cadastrados")) {

        let array = [cadastro];
        let string = JSON.stringify(array);

        localStorage.setItem("candidatos-cadastrados", string);
    } else {
        candidatosCadastrados.push(cadastro);
        let string = JSON.stringify(candidatosCadastrados);

        localStorage.setItem("candidatos-cadastrados", string);
    }

    localStorage.removeItem("cadastro");

}

form.addEventListener("submit", async (event)=> {

    event.preventDefault();

    if (nome.value === "" || email.value === "" || senha.value === "" || area.value === "nenhum") {
        ativarAlerta(alerta, "Preencha os campos do formulário");
        return;
    }

    let habilidadesEscolhidas = buscarHabilidadesEscolhidas();

    if (habilidadesEscolhidas.length === 0) {
        ativarAlerta(alerta, "Preencha os campos do formulário");
        return;
    }

    let emailJaExiste = await emailExistente(email.value);

    if (emailJaExiste) {
        ativarAlerta(alerta, "Email já cadastrado.")
        return;
    }

    salvarCadastro(habilidadesEscolhidas);

    window.location.href = "./../paginaLogin/paginaLogin.html";

})

// Fluxo do wizard de etapas: controla a navegação entre os passos do cadastro.
let etapaAtual = 1;
let btnAvancar = document.getElementById("btn-avancar");
let btnVoltar = document.getElementById("btn-voltar");
let etapasCadastro = document.getElementById("etapas-cadastro");

let btnCadastro = document.getElementById("btn-cadastro");

let etapa1 = document.getElementById("etapa-1")
let etapa2 = document.getElementById("etapa-2")
let etapa3 = document.getElementById("etapa-3")

function mudarEtapas() {
    switch (etapaAtual) {

        case 1:
            etapa1.classList.add("etapa-atual");
            etapa2.classList.remove("etapa-atual");
            etapa3.classList.remove("etapa-atual");
            btnCadastro.style.display = "none";
            etapasCadastro.style.transform = `translateX(0)`;            
            etapasCadastro.style.height = `200px`;
            etapasCadastro.style.minHeight = ``;
            
            break;
            
            case 2:
            etapa1.classList.remove("etapa-atual");
            etapa2.classList.add("etapa-atual");
            etapa3.classList.remove("etapa-atual");      
            btnCadastro.style.display = "none";
            etapasCadastro.style.transform = `translateX(calc(-100% - 80px))`;            
            etapasCadastro.style.height = `125px`;
            etapasCadastro.style.minHeight = ``;
            break;
            
            case 3:
            etapa1.classList.remove("etapa-atual");
            etapa2.classList.remove("etapa-atual");
            etapa3.classList.add("etapa-atual");
            btnCadastro.style.display = "block";
            etapasCadastro.style.transform = `translateX(calc(-200% - 160px))`;            
            etapasCadastro.style.height = `100%`;
            etapasCadastro.style.minHeight = `200px`;
    
        default:
            break;
    }
}

btnVoltar.addEventListener("click", ()=> {
    if (etapaAtual !== 1) {
        btnVoltar.classList.remove("btn-inativo")
        btnAvancar.classList.remove("btn-inativo")
        etapaAtual--;
    }

    if (etapaAtual === 1) {
        btnVoltar.classList.add("btn-inativo")
    }

    mudarEtapas();
})

btnAvancar.addEventListener("click", ()=> {

    if (etapaAtual === 1 && (nome.value === "" || email.value === "" || senha.value === "")) {
        ativarAlerta(alerta, "Preencha os campos para avançar.")
        return;
    }

    if (etapaAtual === 2 && (area.value === "nenhum" || experiencia === "")) {
        ativarAlerta(alerta, "Preencha os campos para avançar.")
        return;
    }

    if (etapaAtual !== 3) {
        btnVoltar.classList.remove("btn-inativo")
        btnAvancar.classList.remove("btn-inativo")
        etapaAtual++;
    }

    if (etapaAtual === 3) {
        btnAvancar.classList.add("btn-inativo")
    }
    
    mudarEtapas();
    
})

let btnResetar = document.getElementById("btn-resetar");
btnResetar.addEventListener("click", ()=>{
    etapaAtual = 1;
    mudarEtapas();

    localStorage.removeItem("cadastro");

})