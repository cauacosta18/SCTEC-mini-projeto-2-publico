import { Candidato } from "./../../candidatos.js";
import { transformarLocalstorage, acionarModoExibicao } from "./../../utilidades.js";

// ==========================
// Fluxo principal do perfil
// ==========================

// Fluxo de carregamento do usuário: redireciona para login quando não há sessão ativa.
if (!localStorage.getItem("usuarioAtual")) {
    window.location.href = "./../paginaLogin/paginaLogin.html";
}

let json = JSON.parse(localStorage.getItem("usuarioAtual"));

let usuarioAtual = new Candidato();

transformarLocalstorage(json, usuarioAtual);

let nomeUsuario = document.getElementById("nome-usuario");
let emailUsuario = document.getElementById("email-usuario");
let areaUsuario = document.getElementById("area-usuario");
let experienciaUsuario = document.getElementById("experiencia-usuario");
let habilidadesUsuario = document.getElementById("habilidades-usuario");

nomeUsuario.textContent = usuarioAtual.nome;
emailUsuario.textContent = usuarioAtual.email;
areaUsuario.textContent = usuarioAtual.area;
experienciaUsuario.textContent = `${usuarioAtual.experienciaMeses} meses`;

habilidadesUsuario.innerHTML = "";

for (const habilidade of usuarioAtual.habilidades) {
    habilidadesUsuario.innerHTML += `<div>${habilidade}</div>`;
}

// Fluxo de logout e navegação: encerra a sessão atual e volta para a tela de login.
let btnSair = document.getElementById("btn-sair");

btnSair.addEventListener("click", ()=> {
    localStorage.removeItem("usuarioAtual");
    localStorage.removeItem("filtro");
    window.location.href = "./../paginaLogin/paginaLogin.html";
})

// Fluxo de tema e navegação: alterna o modo visual e reaplica as cores da interface.
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