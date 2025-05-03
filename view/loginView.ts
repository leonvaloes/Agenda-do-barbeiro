import express from 'express';
import AuthController from '../controller/authController';
const authController=new AuthController();


const router = express.Router();

router.post('', async (req, res) => {
    try {
        const email = req.body.email;
        const senha = req.body.senha;
        const token = await authController.login(email, senha);
        res.cookie('token', token, {
            httpOnly: true, // protege contra acesso via JavaScript no navegador
            secure: process.env.NODE_ENV === 'production', // apenas em HTTPS no prod
            sameSite: 'strict', // evita CSRF
            maxAge: 24 * 60 * 60 * 1000 
        });
        
        res.status(200).send({ message: 'Login efetuado com sucesso' });
    } catch (e: any) {
        res.status(400).send(`Erro: ${e.message}`);
    }
});


export default router;
