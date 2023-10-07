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
exports.deleteModulo = exports.updateModulo = exports.addModulo = exports.getModulo = exports.getModulos = void 0;
const index_1 = __importDefault(require("./index"));
function getModulos() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield index_1.default.query('SELECT * FROM modulo');
        return result.rows;
    });
}
exports.getModulos = getModulos;
function getModulo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM modulo where id = $1';
        const result = yield index_1.default.query(query, [id]);
        return result.rows[0];
    });
}
exports.getModulo = getModulo;
function addModulo(modulo) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO modulo (nome, descricao, id_curso) VALUES ($1, $2, $3) RETURNING *';
        const values = [modulo.nome, modulo.descricao, modulo.idCurso];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.addModulo = addModulo;
function updateModulo(id, updatedModulo) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE modulo SET nome = $1, descricao = $2, id_curso = $3 WHERE id = $4';
        const values = [updatedModulo.nome, updatedModulo.descricao, updatedModulo.idCurso, id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.updateModulo = updateModulo;
function deleteModulo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM modulo WHERE id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.deleteModulo = deleteModulo;
