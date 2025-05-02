import express from 'express';
import AuthController from '../controller/authController';
const authController=new AuthController();


const router = express.Router();

router.get('/login', async (req, res) => {
    try {
        const nome = req.body.nome;
        const senha = req.body.senha;
        const response = await authController.login(nome, senha);
        res.status(200).send(response);
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});


export default router;
