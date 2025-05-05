import express from 'express';
import AuthController from '../controller/authController';
const authController=new AuthController();


const router = express.Router();

router.post('', async (req, res) => {
    try {
        const email = req.body.email;
        const senha = req.body.senha;

        const { token, role, id } = await authController.login (email, senha);

        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        
        res.cookie('id', id, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        })

        res.cookie('role', role, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        
        res.status(200).send({
            message: 'Login efetuado com sucesso',
        });
    } catch (e: any) {
        res.status(400).send({ error: e.message });
    }
});



export default router;
