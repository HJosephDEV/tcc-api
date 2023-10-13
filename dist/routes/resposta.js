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
const tarefaDB_1 = require("../database/tarefaDB");
const tarefaFeitaDB_1 = require("../database/tarefaFeitaDB");
const userDB_1 = require("../database/userDB");
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
        const idResposta = req.query['idResposta'];
        const idTarefa = req.query['idTarefa'];
        if (idResposta == undefined || idTarefa == undefined) {
            res.status(500).json({ message: 'Informações incompleta' });
            return;
        }
        const idUser = verificacao['id'];
        const user = yield (0, userDB_1.getUser)(idUser);
        if (user.vidas <= 0) {
            res.status(500).json({ message: 'Sem vidas restantes' });
            return;
        }
        var resposta = yield (0, respostaDB_1.getResposta)(idResposta.toString());
        if (resposta == undefined) {
            res.status(500).json({ message: 'Reposta não encontrada' });
            return;
        }
        if (resposta.resposta_correta) {
            const tarefa = yield (0, tarefaDB_1.getTarefa)(idTarefa.toString());
            var upouNivel = yield ajustarExp(user, tarefa);
            yield salvarConclusaoTarefa(tarefa.id, user.id);
            res.status(201).json({ message: 'Resposta Correta', acertou: true, exp: tarefa.tarefa_exp, vidas: user.vidas, levelup: upouNivel });
        }
        else {
            let vidasRestantes = user.vidas - 1;
            yield (0, userDB_1.updateVidas)(user.id.toString(), vidasRestantes);
            res.status(201).json({ message: 'Resposta Incorreta', acertou: false, vidas: vidasRestantes });
        }
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
function ajustarExp(user, tarefa) {
    return __awaiter(this, void 0, void 0, function* () {
        var currentExp = user.user_exp + tarefa.tarefa_exp;
        var upouNivel = false;
        if (currentExp >= user.user_next_level_exp) {
            user.user_exp = currentExp - user.user_next_level_exp;
            user.user_level += 1;
            user.user_next_level_exp = ((user.user_next_level_exp / 2) * user.user_level);
            upouNivel = true;
        }
        else {
            user.user_exp = currentExp;
        }
        yield (0, userDB_1.updateUser)(user.id.toString(), user);
        return upouNivel;
    });
}
function salvarConclusaoTarefa(tarefaId, usuarioId) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = yield (0, tarefaFeitaDB_1.verificarTarefaFeita)(tarefaId, usuarioId);
        if (result) {
            yield (0, tarefaFeitaDB_1.salvarTarefaFeita)(tarefaId, usuarioId);
        }
    });
}
