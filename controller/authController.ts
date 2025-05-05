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
    
            if (user.senha != senha) {
                throw new Error("Senha incorreta");
            }

            const role_name = await  User.buscarRole(user.role_id, connection)
    
            const JWT = await AuthModel.gerarToken(user.id, user.nome, role_name[0].nome);
            await connection.commit();
            
            console.log("role_name: ",role_name[0]);

            return {
                token: JWT,
                role: role_name[0].nome,
                id:user.id
            };
    
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }    
}

export default AuthController;
