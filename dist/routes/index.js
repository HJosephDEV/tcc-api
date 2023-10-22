"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const curso_1 = __importDefault(require("./curso"));
const tarefa_1 = __importDefault(require("./tarefa"));
const user_1 = __importDefault(require("./user"));
const modulo_1 = __importDefault(require("./modulo"));
const resposta_1 = __importDefault(require("./resposta"));
const router = express_1.default.Router();
router.use('/', curso_1.default);
router.use('/', tarefa_1.default);
router.use('/', user_1.default);
router.use('/', modulo_1.default);
router.use('/', resposta_1.default);
exports.default = router;
