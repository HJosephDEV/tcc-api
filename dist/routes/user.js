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
const userDB_1 = require("../database/userDB");
const auth_1 = require("../middleware/auth");
const avatarDB_1 = require("../database/avatarDB");
const router = express_1.default.Router();
exports.default = router;
router.get('/usuarios', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const result = yield (0, userDB_1.getUsers)();
            res.status(201).json({ message: 'Usuários encontrado', data: result });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro enquanto pegava o usuário: ${error}` });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.get('/usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        const id = req.query['id'];
        if (id != undefined) {
            try {
                const result = yield (0, userDB_1.getUser)(id.toString());
                const avatar = yield (0, avatarDB_1.getAvatar)(result.id_avatar.toString());
                result.url_avatar = avatar.url;
                if (result != undefined) {
                    res.status(201).json({ message: 'Usuário encontrado', data: result });
                }
                else {
                    res.status(403).json({ message: 'Usuário não encontrado' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: `Erro enquanto pegava o usuário: ${error}` });
            }
        }
        else {
            res.status(403).json({ message: 'Código de usuário não informado' });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/usuario', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const novoUsuario = req.body;
    try {
        const newUser = yield (0, userDB_1.createUser)(novoUsuario);
        const avatar = yield (0, avatarDB_1.getAvatar)(newUser.id_avatar.toString());
        newUser.url_avatar = avatar.url;
        res.status(201).json({ message: 'Usuario criado com sucesso', data: newUser });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `Erro na criação de usuário: ${error}` });
    }
}));
router.put('/usuario', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const updatedUser = req.body;
            if (updatedUser != undefined) {
                const result = yield (0, userDB_1.updateUser)(updatedUser.id.toString(), updatedUser);
                if (result) {
                    res.status(201).json({ message: 'Usuário Atualizado' });
                }
                else {
                    res.status(403).json({ message: 'Usuário não encontrado' });
                }
            }
            else {
                res.status(403).json({ message: 'Informações incorretas' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro na atualização de usuário: ${error}` });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.delete('/usuario', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const id = req.query['id'];
            if (id != undefined) {
                const result = yield (0, userDB_1.deleteUser)(id.toString());
                if (result) {
                    res.status(201).json({ message: 'Usuário deletado' });
                }
                else {
                    res.status(403).json({ message: 'Usuário não encontrado' });
                }
            }
            else {
                res.status(403).json({ message: 'Código de usuário não informado' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro enquanto deletava o usuário: ${error}` });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.post('/usuario/login', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dados = req.body;
    try {
        const login = dados['login'].toString();
        var result;
        if (login.includes("@") == true) {
            result = yield (0, userDB_1.getLoginEmail)(dados['login'].toString(), dados['senha'].toString());
        }
        else {
            result = yield (0, userDB_1.getLogin)(dados['login'].toString(), dados['senha'].toString());
        }
        if (result != undefined) {
            const avatar = yield (0, avatarDB_1.getAvatar)(result.id_avatar.toString());
            result.url_avatar = avatar.url;
            const token = (0, auth_1.gerarToken)({ id: result.id });
            result.token = token;
            res.status(201).json({ message: 'Usuário logado', data: result });
        }
        else {
            res.status(403).json({ message: 'Informações incorretas' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `Erro durante o login: ${error}` });
    }
}));
router.put('/usuario/block', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const id = req.query['id'];
            if (id != undefined) {
                const result = yield (0, userDB_1.blockUser)(id.toString());
                if (result) {
                    res.status(201).json({ message: 'Usuário bloqueado' });
                }
                else {
                    res.status(403).json({ message: 'Usuário já bloqueado ou não encontrado' });
                }
            }
            else {
                res.status(403).json({ message: 'Código de usuário não informado' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro enquanto bloqueava o usuário: ${error}` });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.put('/usuario/unblock', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const id = req.query['id'];
            if (id != undefined) {
                const result = yield (0, userDB_1.unblockUser)(id.toString());
                if (result) {
                    res.status(201).json({ message: 'Usuário desbloqueado' });
                }
                else {
                    res.status(403).json({ message: 'Usuário já desbloqueado ou não encontrado' });
                }
            }
            else {
                res.status(403).json({ message: 'Código de usuário não informado' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro enquanto desbloqueava o usuário: ${error}` });
        }
    }
    else {
        res.status(401).json({ message: 'Token inválido' });
    }
}));
router.put('/usuario/restaurar-vida', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificacao = verificarTokenRequest(req);
    if (verificacao) {
        try {
            const id = verificacao['id'];
            if (id != undefined) {
                const result = yield (0, userDB_1.updateVidas)(id.toString(), 1);
                if (result) {
                    res.status(201).json({ message: 'Vida restaurada' });
                }
                else {
                    res.status(403).json({ message: 'Vida não foi restaurada' });
                }
            }
            else {
                res.status(403).json({ message: 'Código de usuário não informado' });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: `Erro restauva as vidas: ${error}` });
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
