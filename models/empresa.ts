import User from "./user";

class Empresa extends User {
    nome_fantasia: string;
    email: string;
    cnpj: string;
    cidade: string;
    endereco: string;
    estado: string;
    telefone: string;
    empresa_user_id: number;

    constructor(nome: string, nome_fantasia:string , email: string, cnpj: string, cidade: string, endereco: string, estado: string, telefone: string, senha: string, empresa_user_id: number) {
        super(nome, email, telefone, senha, "EMPRESA");
        this.nome_fantasia = nome_fantasia;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.endereco = endereco;
        this.estado = estado;
        this.empresa_user_id = empresa_user_id;
    }

    async create(connection: any) {
        this.empresa_user_id = await User.cadastrarUser(this.nome, this.email, this.telefone, this.senha, "EMPRESA", connection);
        const query = `INSERT INTO empresa (nome_fantasia, cnpj, cidade, endereco, estado, empresa_user_id) VALUES ( ?, ?, ?, ?, ?, ?)`;
        const values = [this.nome_fantasia, this.cnpj, this.cidade, this.endereco, this.estado, this.empresa_user_id];
        try {
            const result = await connection.execute(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async delete(id: number, connection: any) {
        const query = `DELETE FROM empresa WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async update(id: number, data: Empresa, connection: any) {
        const query = `UPDATE empresa SET nome_fantasia=?, cnpj = ?, cidade = ?, endereco = ?, estado = ? WHERE id = ?`;
        try {
            await connection.execute(query, [data.nome_fantasia, data.email, data.cnpj, data.cidade, data.endereco, data.estado, data.telefone, id]);
            return { id, ...data };
        } catch (error) {
            throw error;
        }
    }

    async buscaEmpresa(id: number, connection: any) {
        const query = `SELECT * FROM empresa WHERE id = ?`;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async getEmpresaByName(nome:string, connection: any){
        const query = `SELECT * FROM empresa WHERE nome_fantasia = ?`;
        try{
            const result: any = await connection.execute(query, [nome]);
            console.log(result[0]);
            return result[0];
        }catch(error){
            throw error;
        }
    }

    async adicionaAtendente(connection: any, cpf: string, empresaId: number) {
        const queryBusca = `SELECT id FROM atendente WHERE cpf = ?`;
        try {
            const [rows]: any = await connection.execute(queryBusca, [cpf]);

            if (rows.length > 0) {
                const atendente = rows[0]; // Primeiro resultado
                console.log("Empresa: ", empresaId);

                const queryUpdate = `UPDATE atendente SET empresa_id = ? WHERE cpf = ?`;
                await connection.execute(queryUpdate, [empresaId, cpf]);

                return { id: atendente.id, ...atendente };
            } else {
                throw new Error("Atendente não encontrado");
            }
        } catch (error) {
            throw error;
        }
    }

    static async listarServicoEmpresa(id: number, connection: any) {
        const query = `
            SELECT DISTINCT s.*
            FROM servicos s
            JOIN atendente_serv a ON s.id = a.serv_id
            WHERE a.empresa_id = ?;
        `;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar servicos e:', error);
            throw error;
        }
    }

    static async getFuncionarios(id: number, connection: any) {
        const query = `SELECT * FROM atendente WHERE empresa_id = ?`;
        try {
            const result: any = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(id: number, connection: any) {
        const query = `SELECT * 
            FROM user 
            JOIN empresa ON empresa.empresa_user_id = user.id 
            WHERE user.id = ?;
        `;
        try {
            const result = await connection.execute(query, [id]);
            console.log("model: ", result[0])
            return result[0];
        } catch (error) {
            throw error;
        }
    }

}

export default Empresa;