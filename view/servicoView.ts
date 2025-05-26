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

// router.put('/:id',async(req,res)=>{
//     const id= req.params.id;
//     const { funcionarios, ...dadosServ } = req.body;

//     console.log(dadosServ);
//     console.log(funcionarios);
//     try{
//         const updateServic= await servicoController.atualizarServico(id, dadosServ);
//         if(!updateServic)
//             return res.status(404).send(updateServic);
//         else{
//             const updateAtendenteServ= await 
//         }
//         res.status(200).send("Serviço Atualizado com sucesso")
//     }catch(e){
//         res.status(400).send(`Erro: ${e.message}`);

//     }
// }) 

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

router.post('/CriarEassociar', async (req, res) => {
    const { descricao, funcionarios, nome, tempo_medio, valor } = req.body;
    try {
        const servico = await servicoController.criarEassociar({
            descricao,
            nome,
            tempo_medio,
            valor,
            funcionarios
        });
        res.status(201).send(servico);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/getEmpresa/:id', async (req,res)=>{
    try{
        const id= req.params.id;
        const servico= await servicoController.getEmpresa(id);
        res.status(200).send(servico);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})


export = router;