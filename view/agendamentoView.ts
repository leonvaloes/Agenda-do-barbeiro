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

export default router;