"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RespostaDTO {
    constructor(id, descricao, resposta_correta, idTarefa) {
        this.id = id;
        this.descricao = descricao;
        this.resposta_correta = resposta_correta;
        this.idTarefa = idTarefa;
    }
}
exports.default = RespostaDTO;
