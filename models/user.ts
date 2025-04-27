import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Carrega variáveis do .env

abstract class User {
    id?: number;
    nome: string;
    senha: string;
    
    constructor(nome: string, senha: string) {
        this.nome = nome;
        this.senha = senha;
    }

    async login(connection: any, nome: string, senha: string): Promise<string | null> {
        const query = `SELECT * FROM user WHERE nome = ? AND senha = ?`;
        try {
            const [rows]: any = await connection.execute(query, [nome, senha]);

            if (rows.length > 0) {
                const user = rows[0];
                this.id = user.id;
                this.nome = user.nome;
                return this.generateToken();
            } else {
                throw new Error('Usuário não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }

    static async getUserById(id:number, connection:any){
        const query=`SELECT * FROM user WHERE id=?`
        try{
            const result= await connection.execute(query,[id]);
            if(result && result.length>0){
                console.log("User: ", result);
                return result;
            }
            throw new Error("Usuario não encontrado");
        }catch(e){
            throw e;
        }
    }

    generateToken(): string {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET não definido no .env");
        }

        if (!this.id || !this.nome) {
            throw new Error("ID ou nome do usuário não definidos");
        }

        const payload = {
            id: this.id,
            nome: this.nome
        };

        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }
    logout(): void {

    }
    
    static async cadastrarUser(nome:string, senha:string ,connection: any): Promise<any> {
        const query = `INSERT INTO user (nome, senha) VALUES (?, ?)`;
        const values = [nome, senha];
        
        const teste=await connection.query(query, values);
        console.log(teste[0].insertId);
        return teste[0].insertId;
    }
}

export default User;