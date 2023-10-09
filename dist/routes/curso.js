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
const cursoDB_1 = require("../database/cursoDB");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.default = router;
router.get('/curso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, cursoDB_1.getCurso)(id.toString());
            if (result != undefined) {
                res.status(201).json({ message: 'Curso encontrado', curso: result });
            }
            else {
                res.status(404).json({ message: 'Curso não encontrado' });
            }
        }
        else {
            res.status(500).json({ message: 'Código do curso não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/curso', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const newCourse = req.body;
        try {
            const result = yield (0, cursoDB_1.addCurso)(newCourse);
            res.status(201).json({ message: 'Curso criado com sucesso', curso: result });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro na criação de curso' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.put('/curso', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const updatedCourse = req.body;
        if (updatedCourse != undefined) {
            const result = yield (0, cursoDB_1.updateCurso)(updatedCourse.id.toString(), updatedCourse);
            if (result) {
                res.status(201).json({ message: 'Curso Atualizado' });
            }
            else {
                res.status(404).json({ message: 'Curso não encontrado' });
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
router.delete('/curso', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            const result = yield (0, cursoDB_1.deleteCurso)(id.toString());
            if (result) {
                res.status(201).json({ message: 'Curso deletado' });
            }
            else {
                res.status(404).json({ message: 'Curso não encontrado' });
            }
        }
        else {
            res.status(500).json({ message: 'Código do curso não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/curso/inscrever', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const idUser = verificacao['id'];
        const idCurso = (_a = req.query['idCurso']) === null || _a === void 0 ? void 0 : _a.toString();
        const result = yield (0, cursoDB_1.checkUsuarioCursoExists)(idUser, idCurso);
        if (result == true) {
            const verifInscricao = yield (0, cursoDB_1.checkCursoInscrito)(idUser, idCurso);
            if (verifInscricao == false) {
                yield (0, cursoDB_1.addInscricaoCurso)(idUser, idCurso);
                res.status(201).json({ message: 'Curso inscrito com sucesso' });
            }
            else {
                res.status(402).json({ message: 'Você já inscrito no curso' });
            }
        }
        else {
            res.status(404).json({ message: 'Usuário ou curso não encontrado' });
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
