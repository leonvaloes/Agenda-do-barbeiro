import Cliente from "../models/cliente";
import DatabaseManager from "../config/database";

class ClienteController {

    cliente: typeof Cliente;

    constructor() {
        this.cliente = Cliente; 
    }

    async createCliente(clienteData: any) {
        const connection =await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            await Cliente.createCliente(clienteData, connection);
            connection.commit();
        } catch (error) {

            connection.rollback();
            console.error('Erro ao criar atendente:', error);
            throw error;
        }finally{
            connection.release();
        }
    }


    async atualizarCliente(id, data) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction(); 
            const clienteModel = new Cliente("", "", "", "");
            const clienteExistente = await clienteModel.buscaCliente(id, connection);
            if(!clienteExistente.length)
                throw new Error("Cliente não encontrado.");
            const clienteAtualizado= await clienteModel.update(id, data, connection);
            return clienteAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async deletarCliente(id:number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const clienteModel = new Cliente("", "", "", "");
            const clienteExistente = await clienteModel.buscaCliente(id, connection);
            if (!clienteExistente.length) {
                throw new Error("Cliente não encontrado.");
            }
            const clienteExcluido= await clienteModel.delete(id, connection);
            connection.commit();
            return clienteExcluido;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao deletar cliente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async listarClientes() {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const clientes= await Cliente.listarClientes(connection);
            if (!clientes.length) {
                throw new Error("Nenhum cliente encontrado.");
            }            
            return clientes;
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        } finally {
            connection.release();
        }
    }



}

export = ClienteController;
