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
exports.salvarTarefaFeita = exports.verificarTarefaFeita = void 0;
const index_1 = __importDefault(require("./index"));
function verificarTarefaFeita(idTarefa, idUsuario) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * from tarefa_feita WHERE id_tarefa = $1 AND id_usuario = $2';
        const values = [idTarefa, idUsuario];
        const result = yield index_1.default.query(query, values);
        return result.rowCount == 0;
    });
}
exports.verificarTarefaFeita = verificarTarefaFeita;
function salvarTarefaFeita(idTarefa, idUsuario) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO tarefa_feita (id_tarefa, id_usuario) VALUES ($1, $2) RETURNING *';
        const values = [idTarefa, idUsuario];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.salvarTarefaFeita = salvarTarefaFeita;
