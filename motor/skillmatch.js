// Arquivo legado mantido apenas como camada de compatibilidade.
// A lógica principal agora ficou separada em módulos menores.

import { Candidato, buscarCandidatos, realizarLogin } from "./candidatos.js";
import {
  CompatibilidadeInfo,
  VagaFrontEnd,
  buscarVagas,
  buscarSugestoesVagas,
  buscarSugestoes,
  buscarHabilidadesDisponiveis,
} from "./vagas.js";
import {
  transformarLocalstorage,
  ativarAlerta,
  animarCirculoCarregamento,
  acionarModoExibicao,
} from "./utilidades.js";

function criarContadorBuscas() {
  let buscas = 0;

  return function () {
    buscas++;
    return buscas;
  };
}

export const contarBuscas = criarContadorBuscas();

export {
  Candidato,
  buscarCandidatos,
  realizarLogin,

  CompatibilidadeInfo,
  VagaFrontEnd,
  buscarHabilidadesDisponiveis,
  buscarSugestoes,
  buscarSugestoesVagas,
  buscarVagas,

  acionarModoExibicao,
  animarCirculoCarregamento,
  ativarAlerta,
  transformarLocalstorage,
};
