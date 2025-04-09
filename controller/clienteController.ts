import Cliente from "../models/cliente";
import Atendente from "../models/atendente";
import Servico from "../models/servicos";

import DatabaseManager from "../config/database";

import { AgendamentoSubject } from '../Observer/AgendamentoSubject';
import { LoggerObserver } from '../Observer/LoggerObserver';
import { NotificarAtendenteObserver } from '../Observer/NotificarAtendenteObserver';
import User from "../models/user";


const subject = new AgendamentoSubject();
subject.adicionar(new NotificarAtendenteObserver());

class ClienteController {

    cliente: typeof Cliente;
    constructor() {
        this.cliente = Cliente;
    }

    async createCliente(clienteData: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const cliente = new Cliente(clienteData.nome, clienteData.cpf, clienteData.senha, clienteData.cidade);
            await cliente.cadastrarUser(connection);
            await cliente.createCliente(connection); // Cadastra no 'cliente'
            connection.commit();
        } catch (error) {

            connection.rollback();
            console.error('Erro ao criar atendente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async atualizarCliente(id, data) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const clienteModel = new Cliente("", "", "", "");
            const clienteExistente = await Cliente.getClienteById(id, connection);
            if (!clienteExistente.length)
                throw new Error("Cliente não encontrado.");
            const clienteAtualizado = await clienteModel.update(id, data, connection);
            return clienteAtualizado;
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }


    async deletarCliente(id: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const clienteModel = new Cliente("", "", "", "");
            const clienteExistente = await Cliente.getClienteById(id, connection);
            if (!clienteExistente.length) {
                throw new Error("Cliente não encontrado.");
            }
            const clienteExcluido = await clienteModel.delete(id, connection);
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
            const clientes = await Cliente.listarClientes(connection);
            return clientes;
        } catch (error) {
            console.error('Erro ao lisar clientets:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async Agendar(cliente_id: number, atendente_id: number, serv_id: number, dataEhora: Date) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();

            // Criar o item e o agendamento
            const itemId = await Cliente.createItem(atendente_id, serv_id, dataEhora, connection);
            await Cliente.createAgendamento(cliente_id, itemId, connection);

            // Buscar detalhes do cliente e serviço
            const cliente = await Cliente.getClienteById(cliente_id, connection);
            const servico = await Servico.getServicoById(serv_id, connection);
            const atendente = await Atendente.getAtendenteById(atendente_id, connection);

            connection.commit();

            // Monta os dados da notificação
            const dadosNotificacao = {
                atendente_id,
                cliente_nome: cliente[0].nome,
                servico_nome: servico[0].nome,
                data_hora: dataEhora,
            };

            // Notifica o atendente
            subject.notificarTodos(dadosNotificacao);

        } catch (error) {
            connection.rollback();
            console.error('Erro ao agendar cliente:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

export = ClienteController;
