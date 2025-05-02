import dotenv from 'dotenv';
import Roles from './Roles';

dotenv.config(); // Carrega variáveis do .env

abstract class User {
    id?: number;
    nome: string;
    senha: string;
    role_name: string;
    
    constructor(nome: string, senha: string, role_name: string) {
        this.nome = nome;
        this.senha = senha;
        this.role_name = role_name;
    }

    static async getUserById(id: number, connection: any) {
        const query = `SELECT * FROM user WHERE id=?`
        try {
            const result = await connection.execute(query, [id]);
            if (result && result.length > 0) {
                console.log("User: ", result);
                return result;
            }
            throw new Error("Usuario não encontrado");
        } catch (e) {
            throw e;
        }
    }

    static async getUserByNome(nome: string, connection: any) {
        const query = `SELECT * FROM user WHERE nome=?`
        try {
            const result = await connection.execute(query, [nome]);
            if (result && result.length > 0) {
                console.log("User: ", result);
                return result;
            }
            throw new Error("Usuario não encontrado");
        } catch (e) {
            throw e;
        }
    }

    static async cadastrarUser(nome: string, senha: string, role_name : string, connection: any): Promise<number> {
        try {
            const role = await Roles.getRoleByName(role_name, connection);
    
            if (!role || role.length === 0) {
                throw new Error("Role não encontrada");
            }
    
            const roleId = role[0].id; 
            const [result]: any = await connection.execute(
                `INSERT INTO user (nome, senha, role_id) VALUES (?, ?, ?)`,
                [nome, senha, roleId]
            );
    
            console.log("User cadastrado com sucesso");
            return result.insertId;
        } catch(e) {
            throw e;
        }
    }
    
}

export default User;