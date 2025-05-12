import express from 'express';
import AgendamentoController from '../controller/agendamentoController';

const router = express.Router();

router.get('/getAgendamentosByAtendente/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const atendente = await AgendamentoController.getAgendamentos(id);
        res.status(200).send(atendente);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/getAgendamentosDoDiaByAtendente/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const atendente = await AgendamentoController.getAgendamentosDoDia(id);
        res.status(200).send(atendente);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/getProximosAgendamentosByAtendente/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const atendente = await AgendamentoController.getProximosAgendamentos(id);
        res.status(200).send(atendente);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/getAgendamentosByEmpresa/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log("idzinho: ",id);
        const result = await AgendamentoController.getAgendamentosByEmpresa(id);
        console.log("result view: ",result);
        res.status(200).send(result);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

export default router;