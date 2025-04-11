import Cliente from "../models/cliente";
import DatabaseManager from "../config/database";
import Agendamento from "../models/agendamento";
import { NotificacaoEmail } from "../models/agendamentoNotificacaoObserver/notificacaoEmail";
import { NotificacaoWhatsapp } from "../models/agendamentoNotificacaoObserver/NotificacaoWhatsapp";



class ClienteController {

    cliente: typeof Cliente;
    constructor() {
        this.cliente = Cliente;
    }

    async createCliente(clienteData: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
            const cliente = new Cliente(clienteData.nome, clienteData.cpf, clienteData.senha, clienteData.cidade, 0);
            await cliente.createCliente(connection);          
            await connection.commit();

            return cliente;
        } catch (error) {
            await connection.rollback();
            return "Erro ao criar cliente";
        } finally {
            connection.release();
        }
    }


    async atualizarCliente(id, data) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const clienteModel = new Cliente("", "", "", "", 0);
            const clienteExistente = await Cliente.getClienteById(id, connection);

            if (!clienteExistente.length)
                return null;

            const clienteAtualizado = await clienteModel.update(id, data, connection);
            connection.commit();
            return clienteAtualizado;
        } catch (error) {
            connection.rollback();
            return "Erro ao atualizar cliente";
        } finally {
            connection.release();
        }
    }


    async deletarCliente(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const clienteModel = new Cliente("", "", "", "", 0);
            const clienteExistente = await Cliente.getClienteById(id, connection);
            if (!clienteExistente.length) {
                return null;
            }
            const clienteExcluido = await clienteModel.delete(id, connection);
            connection.commit();
            return clienteExcluido;
        } catch (error) {
            connection.rollback();
            return "Erro ao excluir cliente";
        } finally {
            connection.release();
        }
    }


    async listarClientes() {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const clientes = await Cliente.listarClientes(connection);
            return clientes;
        } catch (error) {
            return "Erro ao listar clientes";
        } finally {
            connection.release();
        }
    }

    async Agendar(cliente_id: number, atendente_id: number, serv_id: number, dataEhora: Date) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();

            const itemId = await Cliente.createItem(atendente_id, serv_id, dataEhora, connection);
            const agendamento = new Agendamento(cliente_id, itemId);

            agendamento.adicionarObservador(new NotificacaoEmail());
            agendamento.adicionarObservador(new NotificacaoWhatsapp());
            await agendamento.create(connection);
            
            connection.commit();

            console.log("Agendamento criado e notificações preparadas.");
            return agendamento;
        } catch (error) {
            connection.rollback();
            console.error('Erro ao agendar cliente:', error);
            return "Erro ao agendar cliente";
        } finally {
            connection.release();
        }
    }
}
export = ClienteController;
