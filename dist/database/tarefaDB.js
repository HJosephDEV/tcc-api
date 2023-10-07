"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTarefa = exports.updateTarefa = exports.addTarefa = exports.getTarefa = exports.getTarefas = void 0;
const index_1 = __importDefault(require("./index"));
function getTarefas() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield index_1.default.query('SELECT * FROM tarefa');
        return result.rows;
    });
}
exports.getTarefas = getTarefas;
function getTarefa(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM tarefa where id = $1';
        const result = yield index_1.default.query(query, [id]);
        return result.rows[0];
    });
}
exports.getTarefa = getTarefa;
function addTarefa(tarefa) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO tarefa (nome, conteudo, tipo, tarefa_exp, id_modulo) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [tarefa.nome, tarefa.conteudo, tarefa.tipo, tarefa.exp, tarefa.idModulo];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.addTarefa = addTarefa;
function updateTarefa(id, updatedTarefa) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE tarefa SET nome = $1, conteudo = $2, tipo = $3, tarefa_exp = $4, id_modulo = $5 WHERE id = $6';
        const values = [updatedTarefa.nome, updatedTarefa.conteudo, updatedTarefa.tipo, updatedTarefa.exp, updatedTarefa.idModulo, id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.updateTarefa = updateTarefa;
function deleteTarefa(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM tarefa WHERE id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.deleteTarefa = deleteTarefa;
