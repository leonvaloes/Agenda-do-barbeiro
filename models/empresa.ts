import User from "./user";

class Empresa extends User {
    email: string;
    cnpj: string;
    cidade: string;
    endereco: string;
    estado: string;
    telefone: string;
    empresa_user_id: number;

    constructor(nome: string, email: string, cnpj: string, cidade: string, endereco: string, estado: string, telefone: string, senha: string, empresa_user_id: number) {
        super(nome, senha);
        this.email = email;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.endereco = endereco;
        this.estado = estado;
        this.telefone = telefone;
        this.empresa_user_id = empresa_user_id;
    }

    async create(connection: any) {
        this.empresa_user_id = await User.cadastrarUser(this.nome, this.senha, connection);
        const query = `INSERT INTO empresa (email, cnpj, cidade, endereco, estado, telefone, empresa_user_id) VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
        const values = [this.email, this.cnpj, this.cidade, this.endereco, this.estado, this.telefone, this.empresa_user_id];
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
        const query = `UPDATE empresa SET  email = ?, cnpj = ?, cidade = ?, endereco = ?, estado = ?, telefone = ? WHERE id = ?`;
        try {
            await connection.execute(query, [data.email, data.cnpj, data.cidade, data.endereco, data.estado, data.telefone, id]);
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
        const query = `SELECT *
            FROM servicos
            JOIN atendente_serv ON servicos.id = atendente_serv.serv_id
            WHERE atendente_serv.empresa_id = ?;`
            ;
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


    static async getUserById(id:number, connection:any) {
        const query = `SELECT * FROM user WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            console.log("model: ",result[0])
            return result[0];
        } catch (error) {
            throw error;
        }
    }

}

export default Empresa;