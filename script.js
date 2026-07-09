import { buscarVagas } from "./skillmatch.js";
import { realizarLogin } from "./skillmatch.js";
import { contarBuscas } from "./skillmatch.js";
import { buscarSugestoesVagas } from "./skillmatch.js";
import { buscarSugestoes } from "./skillmatch.js";

async function inicializar() {
    
    let resposta2 = await realizarLogin("ana@email.com", "123");
    console.log(resposta2);
    
    let resposta = await buscarVagas();
    console.log(resposta);

    // let resposta3 = resposta.vagasCarregadas[4].calcularCompatibilidade(resposta2.candidato);
    // console.log(resposta3);
    
    contarBuscas();

    // let resposta4 = buscarSugestoesVagas(resposta2.candidato, resposta.vagasCarregadas);
    // console.log(resposta4);

    let resposta5 = buscarSugestoes(resposta2.candidato, resposta.vagasCarregadas);
    console.log(resposta5);
    
    
}

inicializar();