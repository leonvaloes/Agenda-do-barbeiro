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
                return null;
            }
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
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
    
    async cadastrarUser(connection: any): Promise<any> {
        const query = `INSERT INTO user (nome, senha) VALUES (?, ?)`;
        const values = [this.nome, this.senha];

        return new Promise((resolve, reject) => {
            connection.query(query, values, (error: any, results: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

export default User;