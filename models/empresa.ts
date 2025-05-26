import User from "./user";

class Empresa extends User {
    nome_fantasia: string;
    email: string;
    cnpj: string;
    cidade: string;
    endereco: string;
    estado: string;
    telefone: string;
    cep:string;
    empresa_user_id: number;

    constructor(nome: string, nome_fantasia:string , email: string, cnpj: string, cidade: string, endereco: string, estado: string, telefone: string, senha: string,cep:string, empresa_user_id: number ) {
        super(nome, email, telefone, senha, "EMPRESA");
        this.nome_fantasia = nome_fantasia;
        this.cnpj = cnpj;
        this.cidade = cidade;
        this.endereco = endereco;
        this.estado = estado;
        this.empresa_user_id = empresa_user_id;
        this.cep=cep;
    }

    async create(connection: any) {
        this.empresa_user_id = await User.cadastrarUser(this.nome_fantasia, this.email, this.telefone, this.senha, "EMPRESA", connection);
        const query = `INSERT INTO empresa (nome_fantasia, cnpj, cidade, endereco, estado, cep, empresa_user_id) VALUES ( ?, ?, ?, ?, ?, ?, ?)`;
        console.log(this.nome_fantasia, this.cnpj, this.cidade, this.endereco, this.estado, this.cep, this.empresa_user_id);
        const values = [this.nome_fantasia, this.cnpj, this.cidade, this.endereco, this.estado, this.cep, this.empresa_user_id];
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

    static async updateDadosEmpresa(id: number, data: Empresa, connection: any) {
        const query = `UPDATE empresa SET nome_fantasia=?, cnpj = ?, cidade=?, endereco=?, estado=? WHERE id = ?`;
        try {
            await connection.execute(query, [data.nome_fantasia, data.cnpj, data.cidade, data.endereco, data.estado, id]);
            return { id, ...data };
        } catch (error) {
            throw error;
        }
    }

    static async buscaEmpresa(id: number, connection: any) {
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
                const atendente = rows[0];

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
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async getEmpresaByUserId(id: number, connection: any) {
        const query = `SELECT * 
            FROM empresa 
            WHERE empresa_user_id = ?;
        `;
        try {
            const result = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async reagendar(itemId:number, novaData:any, connection:any){
        const query="UPDATE item SET data_hora = ? WHERE id = ?"
        try{
            const result= await connection.execute(query,[novaData,itemId]);
            return result
        }catch(e){
            console.log(e);
        }
    }

}

export default Empresa;