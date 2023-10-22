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
exports.updateVidas = exports.unblockUser = exports.blockUser = exports.getLogin = exports.getLoginEmail = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const index_1 = __importDefault(require("./index"));
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield index_1.default.query('SELECT * FROM usuario');
        return result.rows;
    });
}
exports.getUsers = getUsers;
function getUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT nome, sobrenome, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin FROM usuario WHERE id = $1';
        const result = yield index_1.default.query(query, [id]);
        return result.rows[0];
    });
}
exports.getUser = getUser;
function createUser(user) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO usuario (nome, sobrenome, login, email, senha, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)' +
            'RETURNING nome, sobrenome, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin';
        const values = [user.nome, user.sobrenome, user.login, user.email, user.senha, (_a = user.user_level) !== null && _a !== void 0 ? _a : 1, (_b = user.user_exp) !== null && _b !== void 0 ? _b : 0, (_c = user.user_next_level_exp) !== null && _c !== void 0 ? _c : 100, (_d = user.bloqueado) !== null && _d !== void 0 ? _d : false, (_e = user.vidas) !== null && _e !== void 0 ? _e : 3, user.id_avatar, (_f = user.is_admin) !== null && _f !== void 0 ? _f : false];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.createUser = createUser;
function updateUser(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE usuario SET nome = $1, login = $2, email = $3, senha = $4, user_level = $5, user_exp = $6, user_next_level_exp = $7, bloqueado = $8, vidas = $9 WHERE id = $10';
        const values = [user.nome, user.login, user.email, user.senha, user.user_level, user.user_exp, user.user_next_level_exp, user.bloqueado, user.vidas, id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.updateUser = updateUser;
function deleteUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM usuario WHERE id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.deleteUser = deleteUser;
function getLoginEmail(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT nome, sobrenome, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin FROM usuario WHERE email = $1 AND senha = $2';
        const result = yield index_1.default.query(query, [email, senha]);
        return result.rows[0];
    });
}
exports.getLoginEmail = getLoginEmail;
function getLogin(login, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT nome, sobrenome, login, email, user_level, user_exp, user_next_level_exp, bloqueado, vidas, id_avatar, is_admin FROM usuario WHERE login = $1 AND senha = $2';
        const result = yield index_1.default.query(query, [login, senha]);
        return result.rows[0];
    });
}
exports.getLogin = getLogin;
function blockUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE usuario SET bloqueado = true WHERE id = $1 and bloqueado = false';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.blockUser = blockUser;
function unblockUser(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE usuario SET bloqueado = false WHERE id = $1 and bloqueado = true';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.unblockUser = unblockUser;
function updateVidas(id, vidas) {
    return __awaiter(this, void 0, void 0, function* () {
        var user = yield getUser(id);
        if (user.vidas < 3) {
            const query = 'UPDATE usuario SET vidas = $1 WHERE id = $2';
            const values = [user.vidas + vidas, id];
            const result = yield index_1.default.query(query, values);
            return result.rowCount > 0;
        }
        else {
            return false;
        }
    });
}
exports.updateVidas = updateVidas;
