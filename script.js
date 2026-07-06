import { buscarVagas } from "./skillmatch.js";
import { realizarLogin } from "./skillmatch.js";
import { contarBuscas } from "./skillmatch.js";

async function inicializar() {
    
    let resposta = await buscarVagas();

    let resposta2 = await realizarLogin("ana@email.com", "123");
    
}

inicializar();