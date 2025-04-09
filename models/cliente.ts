import User from "./user";

class Cliente extends User {
    cpf: string;
    cidade: string;

    constructor(nome: string, cpf: string, senha: string, cidade: string) {
        super(nome, senha);
        this.cpf = cpf;
        this.cidade = cidade;
      }

      async createCliente(connection: any) {
        const query = `INSERT INTO cliente (nome, cpf, senha, cidade) VALUES (?, ?, ?, ?)`;
        const values = [this.nome, this.cpf, this.senha, this.cidade];
        try {
            const result = await connection.execute(query, values);
            return result;
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }
    

    async delete(id: number, connection: any) {
        const query = `DELETE FROM cliente WHERE id = ?`;
        try {
            await connection.execute(query, [id]);
            return {
                id: id,
                nome: this.nome,
                cpf: this.cpf
            };
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        }
    }

    async update(id: number, data: Cliente, connection: any) {
        const query = `UPDATE cliente SET nome = ?, cpf = ?, senha = ?, cidade = ? WHERE id = ?`;

        try {
            await connection.execute(query, [data.nome, data.cpf, data.senha, data.cidade, id]);
            return { id, ...data };
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        }
    }


    static async getClienteById(id: number, connection: any) {
        const query = `SELECT * FROM cliente WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            return result[0];
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


    static async createItem(atendente_id: number, serv_id: number, dataEhora: Date, connection: any) {
        const query = `INSERT INTO item (atendente_id, serv_id, data_hora ) VALUES (?, ?, ?)`;

        const formattedDate = new Date(dataEhora).toISOString().slice(0, 19).replace('T', ' ');
        const values = [atendente_id, serv_id, formattedDate];

        try {
            const result = await connection.execute(query, values);
            console.log("item id= ", result[0].insertId);
            return result[0].insertId;
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