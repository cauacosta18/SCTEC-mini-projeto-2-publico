import { realizarLogin } from "./../../skillmatch.js";
import { ativarAlerta } from "./../../skillmatch.js";

let senhaInput = document.getElementById("senha");
let emailInput = document.getElementById("email");
let btnLogin = document.getElementById("btn-login");

let navHeader = document.getElementById("nav-header");

let form = document.getElementById("form");

let link = document.createElement("a");
if (localStorage.getItem("usuarioAtual")) {
    link.textContent = "perfil";
    link.href = "./../paginaPerfil/paginaPerfil.html";
} else {
    link.textContent = "login";
    link.href = "#";
}
navHeader.appendChild(link);

form.addEventListener("submit", async(event)=>{
    
    event.preventDefault();

    if (senhaInput.value === "" || emailInput.value === "") {
        ativarAlerta(alerta, "Preencha os campos do formulário.");
        return;
    }

    let resposta = await realizarLogin(emailInput.value, senhaInput.value);

    if (resposta.loginRealizado) {
        let string = JSON.stringify(resposta.candidato)
        localStorage.setItem("usuarioAtual", string);
        window.location.href = "./../paginaPerfil/paginaPerfil.html";
    } else {
        ativarAlerta(alerta, "Login não concluído.");
    }

})

let alerta = document.getElementById("alerta");

