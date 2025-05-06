import dotenv from 'dotenv';
import Roles from './Roles';

dotenv.config(); // Carrega variáveis do .env

abstract class User {
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    role_name: string;

    constructor(nome: string, email: string, telefone: string, senha: string, role_name: string) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.senha = senha;
        this.role_name = role_name;
    }

    static async getUserById(id: number, connection: any) {
        const query = `SELECT * FROM user WHERE id=?`
        try {
            const result = await connection.execute(query, [id]);
            if (result && result.length > 0) {
                return result;
            }
            throw new Error("Usuario não encontrado");
        } catch (e) {
            throw e;
        }
    }

    static async getUserByEmail(email: string, connection: any) {
        const query = `SELECT * FROM user WHERE email=?`
        try {
            const result = await connection.execute(query, [email]);
            if (result && result.length > 0) {
                return result[0][0];
            }
            throw new Error("Usuario não encontrado");
        } catch (e) {
            throw e;
        }
    }
    logout(): void {
    }


    static async buscarRole(id:number, connection: any) {
        const query = `SELECT nome FROM roles WHERE id=?`;
        try {
            const result: any = await connection.execute(query,[id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: number, connection: any){
        try {
            const result= await connection.execute(`DELETE FROM user WHERE id=?`, [id]);
            return result;
        } catch (e) {
            throw e;
        }
    }

    static async cadastrarUser(nome: string, email: string, telefone: string, senha: string, role_name: string, connection: any): Promise<number> {
        try {

            const role = await Roles.getRoleByName(role_name, connection);
            if (!role || role.length === 0) {
                throw new Error("Role não encontrada");
            }
            const roleId = role[0].id;
            const [result]: any = await connection.execute(
                `INSERT INTO user (nome, email, telefone, senha, role_id) VALUES (?, ?, ?, ?, ?)`,
                [nome, email, telefone, senha, roleId]
            );

            return result.insertId;
        } catch (e) {
            console.log(e);
            throw e;

        }
    }

    static async updateUser(id: number, nome: string, email: string, telefone: string, connection: any): Promise<void> {
        try {
            await connection.execute(
                `UPDATE user SET nome=?, email=?, telefone=? WHERE id=?`,
                [nome, email, telefone, id]
            );
        } catch (e) {
            throw e;
        }
    }

}

export default User;