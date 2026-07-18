import { Candidato } from "./../../skillmatch.js";
import { transformarLocalstorage, acionarModoExibicao } from "./../../skillmatch.js";

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

let btnSair = document.getElementById("btn-sair");

btnSair.addEventListener("click", ()=> {
    localStorage.removeItem("usuarioAtual");
    localStorage.removeItem("filtro");
    window.location.href = "./../paginaLogin/paginaLogin.html";
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