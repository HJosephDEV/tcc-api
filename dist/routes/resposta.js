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
const express_1 = __importDefault(require("express"));
const respostaDB_1 = require("../database/respostaDB");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.default = router;
router.get('/respostas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, respostaDB_1.getRespostas)(id.toString());
            if (result != undefined) {
                res.status(201).json({ message: 'Respostas encontradas', respostas: result });
            }
            else {
                res.status(404).json({ message: 'Respostas não encontradas' });
            }
        }
        else {
            res.status(500).json({ message: 'Código de tarefa não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.put('/resposta', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const updatedAnswer = req.body;
        if (updatedAnswer != undefined) {
            const result = yield (0, respostaDB_1.updateResposta)(updatedAnswer.id.toString(), updatedAnswer);
            if (result) {
                res.status(201).json({ message: 'Resposta Atualizada' });
            }
            else {
                res.status(404).json({ message: 'Resposta não encontrada' });
            }
        }
        else {
            res.status(500).json({ message: 'Informações incorretas' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/resposta/enviar', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const idUser = verificacao['id'];
        const idResposta = req.query['idResposta'];
        console.log("responder pergunta");
        res.status(201).json({ message: 'Resposta Sucesso' });
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
function verificarTokenRequest(req) {
    const token = req.header('Authorization');
    const decoded = (0, auth_1.verificarToken)(token);
    return decoded;
}
