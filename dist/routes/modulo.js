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
const moduloDB_1 = require("../database/moduloDB");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.default = router;
router.get('/modulos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const result = yield (0, moduloDB_1.getModulos)();
        res.status(201).json({ message: 'Modulos encontrado', modulos: result });
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.get('/modulo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, moduloDB_1.getModulo)(id.toString());
            if (result != undefined) {
                res.status(201).json({ message: 'Modulo encontrado', modulo: result });
            }
            else {
                res.status(404).json({ message: 'Modulo não encontrado' });
            }
        }
        else {
            res.status(500).json({ message: 'Código do Modulo não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/modulo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const novoModulo = req.body;
        try {
            const moduloAdicionado = yield (0, moduloDB_1.addModulo)(novoModulo);
            res.status(201).json({ message: 'Modulo criado com sucesso', modulo: moduloAdicionado });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro na criação de Modulo' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.put('/modulo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const moduloAtualizado = req.body;
        if (moduloAtualizado != undefined) {
            const result = yield (0, moduloDB_1.updateModulo)(moduloAtualizado.id.toString(), moduloAtualizado);
            if (result) {
                res.status(201).json({ message: 'Modulo Atualizado' });
            }
            else {
                res.status(404).json({ message: 'Modulo não encontrado' });
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
router.delete('/modulo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, moduloDB_1.deleteModulo)(id.toString());
            if (result) {
                res.status(201).json({ message: 'Modulo deletado' });
            }
            else {
                res.status(404).json({ message: 'Modulo não encontrado' });
            }
        }
        else {
            res.status(500).json({ message: 'Código do modulo não informado' });
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
