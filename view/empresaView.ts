import EmpresaController from '../controller/empresaController'
const empresaController= new EmpresaController();
const router = require('express').Router();

router.post('/', async (req, res)=>{
    try{
        const empresa = await empresaController.criarEmpresa(req.body);
        res.status(201).send(empresa);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.delete('/:id', async (req, res)=>{
    try{
        const id= req.params.id;
        const result= await empresaController.deletarEmpresa(id);
        if(result)
            res.status(200).send(result);
        else
            res.status(404).send("Empresa não encontrada!");
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/', async (req,res)=>{
    try{
        const empresas= await empresaController.listarEmpresas();
        res.status(200).send(empresas);
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.put('/reagendamento', async (req,res)=>{
    try{
        const itemId= req.body.item_id;
        const novaData= req.body.nova_data;
        const atendente_id= req.body.atendente_id;
        const agendamento_id=req.body.agendamento_id
        const tempo_medio=req.body.tempo_medio
        const result= await empresaController.reagendar(itemId, novaData, atendente_id, agendamento_id, tempo_medio);
        if(result)
            res.status(200).send(result);
        else 
            res.status(404).send("Erro aqui");
    }catch(e){
        console.log(e);
    }
})

router.put('/:id', async (req, res)=>{
    try{
        const empresa= await empresaController.atualizarEmpresa(req.params.id, req.body);
        if(empresa)
            res.status(200).send(empresa);
        else
            res.status(404).send("Empresa nã encontrada!");
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.get('/getFunc/:id', async (req, res) => {
    try {
        const id= req.params.id;
        const funcionarios = await empresaController.getFunc(id);
        res.status(200).send(funcionarios);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

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
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/listServ/:id', async (req, res) => {
    try {
        const id= req.params.id;
        const servicos = await empresaController.listarServicoEmpresa(id);
        res.status(200).send(servicos);
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/:id', async (req,res)=>{
    try{
        const id= req.params.id;
        const empresa= await empresaController.buscarEmpresa(id);
        if(empresa)
            res.status(200).send(empresa);
        else
            res.status(404).send("Empresa não encontrada!");
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})

router.get('/getUser/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const empresa = await empresaController.getEmpresaByUserId(id);

        if (empresa && empresa.length > 0)
            res.status(200).send(empresa);
        else
            res.status(404).send("Empresa não encontrada!");
    } catch (e) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});

router.get('/getEmpresaByName/:nome_fantasia', async (req,res)=>{
    try{
        const nome_fantasia= req.params.nome_fantasia;
        const empresa= await empresaController.getEmpresaByName(nome_fantasia);
        if(empresa)
            res.status(200).send(empresa);
        else 
            res.status(404).send("Empresa não encontrada!");
    }catch(e){
        res.status(400).send(`Erro: ${e.message}`);
    }
})




export = router;