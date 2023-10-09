"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = exports.gerarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function gerarToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.SECRET, { expiresIn: '1h' });
}
exports.gerarToken = gerarToken;
function verificarToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
exports.verificarToken = verificarToken;
