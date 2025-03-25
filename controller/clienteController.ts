import Cliente from "../models/cliente";
import DatabaseManager from "../config/database";

class ClienteController {

    cliente: typeof Cliente;

    constructor() {
        this.cliente = Cliente; 
    }

    async createCliente(clienteData: any) {
        const connection = DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const cliente= new Cliente( clienteData.nome, clienteData.cpf, clienteData.senha, clienteData.cidade);
            await cliente.create(cliente, clienteData);
            connection.commitTransaction();
        } catch (error) {

            connection.rollbackTransaction();
            console.error('Erro ao criar atendente:', error);
            throw error;
        }finally{
            connection.end();
        }
    }


    async atualizarCliente(id, data) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `UPDATE cliente SET nome = ?, telefone = ?, email = ? WHERE id = ?`;
        const values= [data.nome, data.cpf, data.senha, data.cidade];
        try {
            connection.beginTransaction(); 
            const clienteModel = new Cliente("", "", "", "");
            const clienteExistente = await clienteModel.buscaCliente(id, connection);

            const result = await connection.execute(query,values);
            return result;

        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        } finally {
            connection.end();
        }
    }


    async deletarCliente(id) {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `DELETE FROM cliente WHERE id = ?`;

        try {
            const [result] = await connection.execute(query, [id]);
            if (result.affectedRows === 0) {
                throw new Error('Cliente não encontrado');
            }
            return true;
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            throw error;
        } finally {
            connection.end();
        }
    }


    async listarClientes() {
        const connection = DatabaseManager.getInstance().getConnection();
        const query = `SELECT * FROM cliente`;

        try {
            const clientes = await connection.execute(query);
            return clientes;
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        } finally {
            connection.end();
        }
    }



}

export = ClienteController;
