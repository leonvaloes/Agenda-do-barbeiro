import ServicoController from "../controller/servicoController";
const servicoController=new ServicoController();
const router = require('express').Router();

router.post('/',async(req,res)=>{
    try{
        await servicoController.criarServico(req.body);
        res.status(201).send("Serviço criado com sucesso");
    }catch(e){
        if(e.message==='400')
            res.status(400).send("Serviço já cadastrado!");
        else 
            res.status(500).send("Erro no servidor interno");
    }
})

router.put('/:id',async(req,res)=>{
    try{
        const updateServic= await servicoController.atualizarServico(req.params.id,req.body)
        if(!updateServic)
            return res.status(404).send('Serviço não encontrado');
        
        res.status(201).send("Serviço Atualizado com sucesso")
    }catch(e){
        console.log(e)
        if(e==="Serviço não encontrado")
            return res.status(404).send(e.message);
        res.status(500).send('Erro inteno do servidor')
    }
})

router.get('/',async(req,res)=>{
    try{
        const servicos=await servicoController.listarServicos()
        res.status(200).send(servicos);
    }catch(e){
        res.status(500).send("Erro no servidor interno");
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const deletedServi=await servicoController.deletarServico(req.params.id)
        if(!deletedServi)
            return res.status(404).send('Serviço não encontrado')
        res.status(201).send("Serviço Atualizado com sucesso")
    }catch(e){
        console.log(e)
        if(e==='Serviço não encontrado')
            return res.status(404).send(e.message);
        res.status(500).error('Erro no Servidor interno')
    }
})

export = router;