import AtendenteController from '../controller/atendenteController'
import AgendamentoController from '../controller/agendamentoController';
import NotificacaoController from '../controller/notificacaoController';
import HorarioFuncionario from '../models/horariosFuncionario';
import UnformatDate from '../type/unformatDate';
const notificacaoController = new NotificacaoController();
const agendamentoController = new AgendamentoController();
const atendenteController = new AtendenteController();
const router = require('express').Router();

router.post('/', async (req,res)=>{
    try{
       const atendente = await atendenteController.createAtendente(req.body);
        res.status(201).send(atendente);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/', async (req, res)=>{
    try{
      const atendentes=  await atendenteController.listarAtendentes();
        res.status(200).send(atendentes);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);    }
});


router.put('/:id', async (req, res)=>{
    try{
       const updateAtend= await atendenteController.atualizaAtendente(req.params.id,req.body);
        if(!updateAtend)
            return res.status(404).send('Atendente não encontrado');

        res.status(201).send(updateAtend)
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.delete('/:id', async(req,res)=>{
    try{
        const deletedAtend=await atendenteController.deletarAtendente(req.params.id);

        if(!deletedAtend){
            return res.status(404).send(deletedAtend);
        }

        res.status(201).send(deletedAtend)
    }catch(e){
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

router.post('/proxEstado/:id', async (req,res)=>{
    try{
        const agendamentoId = req.params.id;

        const result = await agendamentoController.avancarEstado(agendamentoId);

        res.status(200).send(result);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})



router.post('/notificacao', async (req, res)=>{
    try{
        const result = await notificacaoController.SetNotificacao();
        res.status(200).send(result);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
});


router.post('/expediente/:id', async (req, res) => {
    console.log('Body recebido:', req.body);

    const data = {
      atendente_id: parseInt(req.params.id),
      data_hora_entrada: req.body.entrada,
      data_hora_saida: req.body.saida,
      dias_semana_id: parseInt(req.body.dia_semana)
    };

    console.log('Data formatada:', data);
    try {
      await AtendenteController.definirHorario(data);
      res.json({ message: "Expediente e horários criados com sucesso" });
    } catch (error) {
      console.log("errou", error);
      res.status(500).json({ error: error.message });
    }
});








export = router;