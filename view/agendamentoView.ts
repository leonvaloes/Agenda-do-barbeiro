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
        const result = await AgendamentoController.getAgendamentosByEmpresa(id);
        res.status(200).send(result);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/getAgendamentosDaSemanaByEmpresa/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const result = await AgendamentoController.getAgendamentosDaSemana(id);
        res.status(200).send(result);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.put('/editAgendamentos/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const { cliente_id, atendente_id, serv_id, data_hora } = req.body;
        console.log("idzinho: ",id);
        const result = await AgendamentoController.editAgendamentos(id, cliente_id, atendente_id, serv_id, data_hora);

    } catch (e:any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
})

export default router;