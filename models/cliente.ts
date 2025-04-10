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
            return null;
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
            return null;
        }
    }

    async update(id: number, data: Cliente, connection: any) {
        const query = `UPDATE cliente SET nome = ?, cpf = ?, senha = ?, cidade = ? WHERE id = ?`;

        try {
            await connection.execute(query, [data.nome, data.cpf, data.senha, data.cidade, id]);
            return { id, ...data };
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            return null;
        }
    }


    static async getClienteById(id: number, connection: any) {
        const query = `SELECT * FROM cliente WHERE id = ?`;
        try {
            const result = await connection.execute(query, [id]);
            return result[0];
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return null;
        }
    }

    static async listarClientes(connection: any) {
        const query = `SELECT * FROM cliente`;
        try {
            const result = await connection.execute(query);
            return result[0];
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            return null;
        }
    }


    static async createItem(atendente_id: number, serv_id: number, dataEhora: Date, connection: any) {
        const query = `INSERT INTO item (atendente_id, serv_id, data_hora ) VALUES (?, ?, ?)`;
        const formattedDate = new Date(dataEhora).toISOString().slice(0, 19).replace('T', ' ');
        const values = [atendente_id, serv_id, formattedDate];

        try {
            const result = await connection.execute(query, values);
            return result[0].insertId;
        } catch (error) {
            console.error('Erro ao criar item:', error);
            return null;
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
            return null;
        }
    }

}

export = Cliente;