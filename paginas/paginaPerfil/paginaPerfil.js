import { Candidato } from "./../../skillmatch.js";
import { transformarLocalstorage } from "./../../skillmatch.js";

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
    localStorage.clear();
    window.location.href = "./../paginaLogin/paginaLogin.html";
})