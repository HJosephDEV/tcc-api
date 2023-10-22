import express from 'express';
import cursoRouter from './curso';
import tarefaRouter from './tarefa';
import usuarioRouter from './user';
import moduloRouter from './modulo';
import respostaRouter from './resposta'
import avatarRouter from './avatar'

const router = express.Router();

router.use('/', cursoRouter);
router.use('/', tarefaRouter);
router.use('/', usuarioRouter);
router.use('/', moduloRouter);
router.use('/', respostaRouter);
router.use('/', avatarRouter);

export default router;