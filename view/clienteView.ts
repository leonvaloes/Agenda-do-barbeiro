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

        if (e.message === '400') {
            res.status(400).send('Erro: Cliente já cadastrado.');
        } else {
            res.status(500).send('Erro interno do servidor.');
        }
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
        console.log(e);
        if (e.message === 'Cliente não encontrado') {
            return res.status(404).send(e.message);
        }
        res.status(500).send('Erro interno do servidor');
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
        console.log(e);
        if (e.message === 'Cliente não encontrado') {
            return res.status(404).send(e.message);
        }
        res.status(500).send('Erro interno do servidor');
    }
});



router.get('/', async (req, res) => {
    try {
        const data = await clienteController.listarClientes();
        res.status(200).json(data).send();
    } catch (e) {
        console.log(e);
        res.status(200).json([]).send();
    }
});


router.post('/agendar', async (req, res) => {
    try {
        const { cliente_id, atendente_id, serv_id, data_hora } = req.body;
        
        await clienteController.Agendar(cliente_id, atendente_id, serv_id, data_hora);
        res.status(201).send('Agendamento criado com sucesso!');
    } catch (e) {
        console.log(e);
        res.status(500).send('Erro interno do servidor');
    }
});


router.put('/cancelarAgendamento/:id', async (req, res) => {
    try {
        const agendamento_id = req.params.id;

        await agendamentoController.cancelarAgendamento(agendamento_id);
        res.status(200).send('Agendamento cancelado com sucesso!');
    } catch (e) {
        console.log(e);
        res.status(500).send('Erro interno do servidor');
    }
})

module.exports = router; // Exporta o roteador de usuários