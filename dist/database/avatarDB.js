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
exports.deleteAvatar = exports.updateAvatar = exports.createAvatar = exports.getAvatar = exports.getAvatars = void 0;
const index_1 = __importDefault(require("./index"));
function getAvatars() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield index_1.default.query('SELECT * FROM avatar');
        return result.rows;
    });
}
exports.getAvatars = getAvatars;
function getAvatar(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM avatar WHERE id = $1';
        const result = yield index_1.default.query(query, [id]);
        return result.rows[0];
    });
}
exports.getAvatar = getAvatar;
function createAvatar(avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'INSERT INTO avatar (url, level_req) VALUES ($1, $2) RETURNING *';
        const values = [avatar.url, avatar.level_req];
        const result = yield index_1.default.query(query, values);
        return result.rows[0];
    });
}
exports.createAvatar = createAvatar;
function updateAvatar(id, avatar) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'UPDATE avatar SET url = $1, level_req = $2 WHERE id = $3';
        const values = [avatar.url, avatar.level_req, id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.updateAvatar = updateAvatar;
function deleteAvatar(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'DELETE FROM avatar WHERE id = $1';
        const values = [id];
        const result = yield index_1.default.query(query, values);
        return result.rowCount > 0;
    });
}
exports.deleteAvatar = deleteAvatar;
