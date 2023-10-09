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
exports.addInscricaoCurso = exports.checkCursoInscrito = exports.checkUsuarioCursoExists = exports.deleteCurso = exports.updateCurso = exports.addCurso = exports.getCurso = exports.getCursos = void 0;
const index_1 = __importDefault(require("./index"));
function getCursos() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield index_1.default.query('SELECT * FROM curso');
        return result.rows;
    });
}
exports.getCursos = getCursos;
function getCurso(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM curso where id = $1';
        const result = yield index_1.default.query(query, [id]);
        return result.rows[0];
    });
}
exports.getCurso = getCurso;
function addCurso(curso) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO curso (nome, imagem) VALUES ($1, $2) RETURNING *';
        const values = [curso.nome, curso.imagem];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.addCurso = addCurso;
function updateCurso(id, updatedCurso) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE curso SET nome = $1, imagem = $2 WHERE id = $3';
        const values = [updatedCurso.nome, updatedCurso.imagem, id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.updateCurso = updateCurso;
function deleteCurso(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM curso WHERE id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.deleteCurso = deleteCurso;
function checkUsuarioCursoExists(idUser, idCourse) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'select exists(select 1 from usuario where id = $1) and exists(select 1 from curso where id = $2) as existe';
        const values = [idUser, idCourse];
        const result = yield index_1.default.query(query, values);
        return result.rows[0]['existe'];
    });
}
exports.checkUsuarioCursoExists = checkUsuarioCursoExists;
function checkCursoInscrito(idUser, idCourse) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'select exists(select 1 as existe from curso_inscrito where id_usuario = $1 and id_curso = $2) as existe';
        const values = [idUser, idCourse];
        const result = yield index_1.default.query(query, values);
        return result.rows[0]['existe'];
    });
}
exports.checkCursoInscrito = checkCursoInscrito;
function addInscricaoCurso(idUser, idCourse) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO curso_inscrito (id_curso, id_usuario) values ($1, $2)';
        const values = [idCourse, idUser];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.addInscricaoCurso = addInscricaoCurso;
