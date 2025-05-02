import AtendenteController from '../controller/atendenteController'
import AgendamentoController from '../controller/agendamentoController';
import NotificacaoController from '../controller/notificacaoController';
const notificacaoController = new NotificacaoController();
const agendamentoController = new AgendamentoController();
const atendenteController = new AtendenteController();
const router = require('express').Router();

router.post('/', async (req, res) => {
    try {
        const atendente = await atendenteController.createAtendente(req.body);
        res.status(201).send(atendente);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/', async (req, res) => {
    try {
        const atendentes = await atendenteController.listarAtendentes();
        res.status(200).send(atendentes);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updateAtend = await atendenteController.atualizaAtendente(req.params.id, req.body);
        if (!updateAtend)
            return res.status(404).send('Atendente não encontrado');
        res.status(201).send(updateAtend)
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedAtend = await atendenteController.deletarAtendente(req.params.id);
        if (!deletedAtend) 
            return res.status(404).send(deletedAtend);
        res.status(201).send(deletedAtend)
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.post('/criar-servico/:id', async (req, res) => {
    try {
        const atendenteId = Number(req.params.id);
        const servicoId = await atendenteController.criarServicoEAssociar(req.body, atendenteId);
        res.status(201).send({
            message: "Serviço criado e associado com sucesso!",
            servicoId
        });
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.post('/getHours/:id', async (req,res)=>{
    try{
        const id = Number(req.params.id);
        const data= req.body.data;

        console.log("id e data: ", id, data);
        const horarios= await atendenteController.getTimeForDate(id,data);
        res.status(200).send(horarios);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.post('/proxEstado/:id', async (req, res) => {
    try {
        const agendamentoId = req.params.id;
        const result = await agendamentoController.avancarEstado(agendamentoId);
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.post('/notificacao', async (req, res) => {
    try {
        const result = await notificacaoController.SetNotificacao();
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.post('/expediente/:id', async (req, res) => {
    const atendente_id = req.params.id;
    const horarios = req.body;
    try {
        await AtendenteController.definirHorario(atendente_id, horarios);
        res.json({ message: "Expedientes e horários criados com sucesso" });
    } catch (error) {
        console.log("errou", error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/getAtendServ/:id', async (req, res) => {
    const servico_id = req.params.id;
    try {
        const result= await AtendenteController.listarAtendentesDoServico(servico_id);
        res.json(result);
    } catch (error) {
        console.log("errou", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/getIdAtendente/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result= await AtendenteController.getIdAtendente(userId);
        console.log("reslt view: ", result);
        res.json(result);
    } catch (error) {
        console.log("errou", error);
        res.status(500).json({ error: error.message });
    }
});






export = router;