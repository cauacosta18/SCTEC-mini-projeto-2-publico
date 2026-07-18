import { realizarLogin } from "./../../candidatos.js";
import { ativarAlerta, acionarModoExibicao } from "./../../utilidades.js";

// ==========================
// Fluxo principal de login
// ==========================

// Fluxo de autenticação: valida os campos e tenta realizar o login com o candidato informado.
let senhaInput = document.getElementById("senha");
let emailInput = document.getElementById("email");
let btnLogin = document.getElementById("btn-login");

let navHeader = document.getElementById("nav-header");

let form = document.getElementById("form");

let link = document.createElement("a");
if (localStorage.getItem("usuarioAtual")) {
    link.textContent = "perfil";
    link.href = "./../paginaPerfil/paginaPerfil.html";
    navHeader.appendChild(link);
} 

form.addEventListener("submit", async(event)=>{
    
    event.preventDefault();

    if (senhaInput.value === "" || emailInput.value === "") {
        ativarAlerta(alerta, "Preencha os campos do formulário.");
        return;
    }

    let resposta = await realizarLogin(emailInput.value, senhaInput.value);

    if (resposta.loginRealizado) {
        resposta.candidato.senha = "";
        let string = JSON.stringify(resposta.candidato)
        localStorage.setItem("usuarioAtual", string);
        window.location.href = "./../paginaPerfil/paginaPerfil.html";
    } else {
        ativarAlerta(alerta, "Login não concluído.");
    }

})

let alerta = document.getElementById("alerta");

// Fluxo de tema e navegação: aplica o modo visual e salva a preferência no localStorage.
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