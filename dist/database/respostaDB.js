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
exports.deleteResposta = exports.updateResposta = exports.addResposta = exports.getResposta = exports.getRespostas = void 0;
const index_1 = __importDefault(require("./index"));
function getRespostas(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM resposta where id_tarefa = $1';
        const value = [id];
        const result = yield index_1.default.query(query, value);
        return result.rows;
    });
}
exports.getRespostas = getRespostas;
function getResposta(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM resposta where id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.getResposta = getResposta;
function addResposta(resposta, idTarefa) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO resposta (descricao, resposta_correta, id_tarefa) VALUES ($1, $2, $3) RETURNING *';
        const values = [resposta.descricao, resposta.resposta_correta, idTarefa];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.addResposta = addResposta;
function updateResposta(id, updatedResposta) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE resposta SET descricao = $1, resposta_correta = $2, id_tarefa = $3 WHERE id = $4';
        const values = [updatedResposta.descricao, updatedResposta.resposta_correta, updatedResposta.idTarefa, id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.updateResposta = updateResposta;
function deleteResposta(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM resposta WHERE id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.deleteResposta = deleteResposta;
