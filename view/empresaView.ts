import EmpresaController from '../controller/empresaController'
const empresaController= new EmpresaController();
const router = require('express').Router();

router.post('/', async (req,res)=>{
    try{
        await empresaController.criarEmpresa(req.body);
        res.status(201).send("Empresa criada com sucesso!");
    }catch(e){
        
        if(e.message==='400')
            res.status(400).send("Empresa já cadastrada!");
        else 
            res.status(500).send("Errono servidor interno");
    }
});

router.delete('/:id', async (req, res)=>{
    try{
        const id= req.params.id;
        const result= await empresaController.deletarEmpresa(id);
        if(result)
            res.status(200).send("Empresa deletada com sucesso!");
        else
            res.status(404).send("Empresa não encontrada!");
    }catch(e){
        res.status(500).send("Errono servidor interno");
    }
});


router.get('/', async (req,res)=>{
    try{
        const empresas= await empresaController.listarEmpresas();
        res.status(200).send(empresas);
    }catch(e){
        res.status(500).send("Erro no servidor interno");
    }
});


router.put('/:id', async (req, res)=>{
    try{
        const empresa= await empresaController.atualizarEmpresa(req.params.id, req.body);
        if(empresa)
            res.status(200).send("Empresa atualizada com sucesso!");
        else
            res.status(404).send("Empresa não encontrada!");
    }catch(e){
        res.status(500).send("Erro no servidor interno");
    }
})



router.post('/:empresaId/funcionario', async (req, res) => {
    try {
        const { cpf } = req.body;
        const empresaId = parseInt(req.params.empresaId, 10);

        if (!cpf) {
            return res.status(400).send("CPF do funcionário é obrigatório.");
        }

        await empresaController.adicionarFuncionario(cpf, empresaId);
        res.status(200).send("Funcionário adicionado à empresa com sucesso!");
    } catch (e) {
        if (e.message === "Funcionário não encontrado.") {
            res.status(404).send(e.message);
        } else {
            res.status(500).send("Erro no servidor interno");
        }
    }
});

export = router;