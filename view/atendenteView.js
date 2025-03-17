const express=require('express');
const AtendenteController= require("../controller/atendenteController");
const router=express.Router();
const atendenteController= new AtendenteController;

router.post('/', async (req,res)=>{
    try{
        await atendenteController.criarAtendente(req.body);
        res.status(201).send("Atendente criado com sucesso!");
    }catch(e){
        
        if(e.message==='400')
            res.status(400).send("Atendente já cadastrado!");
        else 
            res.status(500).send("Errono servidor interno");
    }
});

router.get('/', async(req,res)=>{
    try{
        await atendenteController.listarAtendentes();
        req.status(200).json(data).send();
    }catch(e){
        res.status(500).send();
    }
})