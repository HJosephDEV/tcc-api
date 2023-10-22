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
const tarefaDB_1 = require("../database/tarefaDB");
const respostaDB_1 = require("../database/respostaDB");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.default = router;
router.get('/tarefas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const result = yield (0, tarefaDB_1.getTarefas)();
        res.status(201).json({ message: 'Tarefas encontrado', tarefas: result });
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.get('/tarefa', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, tarefaDB_1.getTarefa)(id.toString());
            if (result != undefined) {
                res.status(201).json({ message: 'Tarefa encontrado', tarefa: result });
            }
            else {
                res.status(404).json({ message: 'Tarefa não encontrado' });
            }
        }
        else {
            res.status(500).json({ message: 'Código do Tarefa não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/tarefa', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const novaTarefa = req.body;
        try {
            const newTask = yield (0, tarefaDB_1.addTarefa)(novaTarefa);
            var respostas = [];
            for (const resposta of novaTarefa.respostas) {
                var result = yield (0, respostaDB_1.addResposta)(resposta, newTask.id);
                respostas.push(result);
            }
            newTask.respostas = respostas;
            res.status(201).json({ message: 'Tarefa criada com sucesso', task: newTask });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro na criação de tarefa' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.put('/tarefa', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const tarefaAtualizado = req.body;
        if (tarefaAtualizado != undefined) {
            const result = yield (0, tarefaDB_1.updateTarefa)(tarefaAtualizado.id.toString(), tarefaAtualizado);
            if (result) {
                res.status(201).json({ message: 'Tarefa Atualizado' });
            }
            else {
                res.status(404).json({ message: 'Tarefa não encontrado' });
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
router.delete('/tarefa', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, tarefaDB_1.deleteTarefa)(id.toString());
            if (result) {
                res.status(201).json({ message: 'Tarefa deletado' });
            }
            else {
                res.status(404).json({ message: 'Tarefa não encontrado' });
            }
        }
        else {
            res.status(500).json({ message: 'Código do tarefa não informado' });
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
