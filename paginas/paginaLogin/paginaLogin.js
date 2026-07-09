import { realizarLogin } from "./../../skillmatch.js";

let senhaInput = document.getElementById("senha");
let emailInput = document.getElementById("email");
let btnLogin = document.getElementById("btn-login");

let navHeader = document.getElementById("nav-header");

let link = document.createElement("a");
if (localStorage.getItem("usuarioAtual")) {
    link.textContent = "perfil";
    link.href = "./../paginaPerfil/paginaPerfil.html";
} else {
    link.textContent = "login";
    link.href = "#";
}
navHeader.appendChild(link);

btnLogin.addEventListener("click", async()=>{
    if (senhaInput.value === "" || emailInput.value === "") {
        console.log("erro");
        return;
    }

    let resposta = await realizarLogin(emailInput.value, senhaInput.value);

    if (resposta.loginRealizado) {
        let string = JSON.stringify(resposta.candidato)
        localStorage.setItem("usuarioAtual", string);
        window.location.href = "./../paginaPerfil/paginaPerfil.html";
    } else {
        
    }

})