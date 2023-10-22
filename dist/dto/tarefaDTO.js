"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TarefaDTO {
    constructor(id, nome, conteudo, tipo, tarefa_exp, idModulo, respostas) {
        this.id = id;
        this.nome = nome;
        this.conteudo = conteudo;
        this.tipo = tipo;
        this.tarefa_exp = tarefa_exp;
        this.idModulo = idModulo;
        this.respostas = respostas;
    }
}
exports.default = TarefaDTO;
