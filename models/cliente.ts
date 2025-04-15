import User from "./user";

class Cliente extends User {
    cpf: string;
    cidade: string;
    cliente_user_id: number;

    constructor(nome: string, cpf: string, senha: string, cidade: string, cliente_user_id: number) {
        super(nome, senha);
        this.cpf = cpf;
        this.cidade = cidade;
        this.cliente_user_id = cliente_user_id;
    }

    async createCliente(connection: any) {
        this.cliente_user_id = await User.cadastrarUser(this.nome, this.senha, connection);
        const query = `INSERT INTO cliente ( cpf, cidade, cliente_user_id) VALUES (?, ?, ?)`;
        const values = [this.cpf,  this.cidade, this.cliente_user_id];
        try {
            const result = await connection.execute(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }


    async delete(id: number, connection: any) {
        const query = `DELETE FROM cliente WHERE id = ?`;
        try {
            await connection.execute(query, [id]);
            return true;
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }

    async update(id: number, data: Cliente, connection: any) {
        const query = `UPDATE cliente SET  cpf = ?, cidade = ? WHERE id = ?`;

        try {
            await connection.execute(query, [data.cpf, data.cidade, id]);
            return { id, ...data };
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    }


    static async getClienteById(id: number, connection: any) {
        const query = `SELECT * FROM cliente WHERE id = ?`;
        try {
            const [result] = await connection.execute(query, [id]);
            return result.length>0 ? result[0] : null;
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            throw error;
        }
    }

    static async listarClientes(connection: any) {
        const query = `SELECT * FROM cliente`;
        try {
            const result = await connection.execute(query);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        }
    }


    static async createItem(atendente_id: number, serv_id: number, dataEhora: any, connection: any) {
        const dataHoraFormatada = dataEhora.toISOString().slice(0, 19).replace("T", " ");
        
        const query = `INSERT INTO item (atendente_id, serv_id, data_hora) VALUES (?, ?, ?)`;
        const values = [atendente_id, serv_id, dataHoraFormatada];
    
        try {
            const [result] = await connection.execute(query, values);
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar item:', error);
            throw error;
        }
    }
    

    static async createAgendamento(cliente_id: number, item_id: number, connection: any) {
        const query = `INSERT INTO agendamento (cliente_id, item_id) VALUES (?, ?)`;
        const values = [cliente_id, item_id];

        try {
            const result = await connection.execute(query, values);
            console.log("Agendamento criado com sucesso!");
            return result;
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            throw error;
        }
    }

}

export = Cliente;