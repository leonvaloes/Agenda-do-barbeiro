const express=require('express');
const AtendenteController= require("../controller/atendenteController");
const router=express.Router();
const atendenteController= AtendenteController;

console.log("entra view");

router.post('/', async (req,res)=>{
    try{
        await atendenteController.createAtendente(req.body);
        res.status(201).send("Atendente criado com sucesso!");
    }catch(e){
        
        if(e.message==='400')
            res.status(400).send("Atendente já cadastrado!");
        else 
            res.status(500).send("Errono servidor interno");
    }
});

module.exports = router;

