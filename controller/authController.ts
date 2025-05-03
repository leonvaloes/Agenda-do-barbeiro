import DatabaseManager from "../config/database";
import AuthModel from "../models/authModel";
import User from "../models/user";

class AuthController {

    authController: typeof AuthController;

    constructor() {
        this.authController = AuthController;
    }

    async login(email: string, senha: string) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const user = await User.getUserByEmail(email, connection);
            if (!user || user.length === 0) {
                throw new Error("Usuário não encontrado");
            }
            console.log("user", user);
            console.log("senha", senha);
            
            if (user.senha != senha) {
                throw new Error("Senha incorreta");
            }
            const JWT = AuthModel.gerarToken(user.id, user.nome, user.role_name)
            connection.commit();
            return JWT;
        } catch (error) {
            connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    
}

export default AuthController;
