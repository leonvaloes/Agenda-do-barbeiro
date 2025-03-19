const express=require('express');
const AtendenteController= require("../controller/atendenteController");
const router=express.Router();
const atendenteController= AtendenteController;

router.post('/', async (req,res)=>{
    try{
        await atendenteController.createAtendente(req.body);
        res.status(201).send("Atendente criado com sucesso!");
    }catch(e){
        
        if(e.message==='400')
            res.status(400).send("Atendente já cadastrado!");
        else 
            res.status(500).send("Erro no servidor interno");
    }
});

router.get('/', async (req, res)=>{
    try{
      const atendentes=  await atendenteController.listarAtendentes();
        res.status(200).send(atendentes);
    }catch(e){
        res.status(500).send("Erro no servidor interno");
    }
});


router.put('/:id', async (req, res)=>{
    try{
       const updateAtend= await atendenteController.atualizaAtendente(req.params.id,req.body);
        if(!updateAtend)
            return res.status(404).send('Atendente não encontrado');

        res.status(201).send("Atendente Atualizado Com sucesso!")
    }catch(e){
        console.log(e)
        if(e==="Atendente não encontrado")
            return res.status(404).send(e.message);
        res.status(500).send('Erro inteno do servidor')
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const deletedAtend=await atendenteController.deletarAtendente(req.params.id)
        if(!deletedAtend)
            return res.status(404).send('Atendente não encontrado');

        res.status(201).send("Atendente Deletado Com sucesso!")
    }catch(e){
        console.log(e)
        if(e==="Atendente não encontrado")
            return res.status(404).send(e.message);
        res.status(500).send('Erro inteno do servidor')
    }
})

module.exports = router;

