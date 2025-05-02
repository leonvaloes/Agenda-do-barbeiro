import ServicoController from "../controller/servicoController";
const servicoController=new ServicoController();
const router = require('express').Router();

router.post('/',async(req,res)=>{
    try{
        const servico = await servicoController.criarServico(req.body);
        res.status(201).send(servico);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);

    }
})

router.put('/:id',async(req,res)=>{
    const id= req.params.id;
    try{
        const updateServic= await servicoController.atualizarServico(id,req.body)
        if(!updateServic)
            return res.status(404).send(updateServic);
        
        res.status(200).send("Serviço Atualizado com sucesso")
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);

    }
})

router.get('/',async(req,res)=>{
    try{
        const servicos=await servicoController.listarServicos()
        res.status(200).send(servicos);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const deletedServi=await servicoController.deletarServico(req.params.id)
        if(!deletedServi)
            return res.status(404).send('Serviço não encontrado')
        res.status(200).send(deletedServi)
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})

export = router;