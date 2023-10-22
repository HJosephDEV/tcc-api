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
const auth_1 = require("../middleware/auth");
const avatarDB_1 = require("../database/avatarDB");
const router = express_1.default.Router();
exports.default = router;
router.get('/avatares', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const result = yield (0, avatarDB_1.getAvatars)();
            res.status(201).json({ message: 'Avatares encontrado', data: result });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro enquanto pegava o avatar: ${error}` });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.get('/avatar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            try {
                const result = yield (0, avatarDB_1.getAvatar)(id.toString());
                if (result != undefined) {
                    res.status(201).json({ message: 'Avatar encontrado', data: result });
                }
                else {
                    res.status(403).json({ message: 'Avatar não encontrado' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: `Erro enquanto pegava os avatares: ${error}` });
            }
        }
        else {
            res.status(403).json({ message: 'Código de avatar não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/avatar', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const novoAvatar = req.body;
    try {
        const newAvatar = yield (0, avatarDB_1.createAvatar)(novoAvatar);
        res.status(201).json({ message: 'Avatar criado com sucesso', data: newAvatar });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `Erro na criação de avatar: ${error}` });
    }
}));
function verificarTokenRequest(req) {
    const token = req.header('Authorization');
    const decoded = (0, auth_1.verificarToken)(token);
    return decoded;
}
