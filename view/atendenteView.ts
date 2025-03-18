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
        await atendenteController.listarAtendentes();
        res.status(200).send("Atendente listado com sucesso!");
    }catch(e){
        res.status(500).send("Erro no servidor interno");
    }
});


router.put('/', async (req, res)=>{
    try{
        await atendenteController.atua
    }
})

module.exports = router;

