import AgendamentoController from '../controller/agendamentoController';
import ClienteController from '../controller/clienteController';
const clienteController = new ClienteController;
const agendamentoController = new AgendamentoController;
const router = require('express').Router();

router.post('/', async (req, res) => {
    try {
        const cliente = await clienteController.createCliente(req.body);
        res.status(201).send(cliente);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedClient = await clienteController.atualizarCliente(req.params.id, req.body);

        if (!updatedClient) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(200).send(updatedClient);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const deletedClient = await clienteController.deletarCliente(req.params.id);

        if (!deletedClient) {
            return res.status(404).send('Cliente não encontrado');
        }

        res.status(200).send(deletedClient);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});



router.get('/', async (req, res) => {
    try {
        const data = await clienteController.listarClientes();
        res.status(200).json(data).send();
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});


router.post('/agendar', async (req, res) => {
    try {
        const { cliente_id, atendente_id, serv_id, data_hora } = req.body;

        await clienteController.Agendar(cliente_id, atendente_id, serv_id, data_hora);
        res.status(201).send('Agendamento criado com sucesso!');
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});


router.put('/cancelarAgendamento/:id', async (req, res) => {
    try {
        const agendamento_id = req.params.id;

        await agendamentoController.cancelarAgendamento(agendamento_id);
        res.status(200).send(agendamento_id);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
})

module.exports = router;