import Cliente from "../models/cliente";
import DatabaseManager from "../config/database";
import Agendamento from "../models/agendamento";
import Servico from "../models/servicos";

import { NotificacaoEmail } from "../models/agendamentoNotificacaoObserver/notificacaoEmail";
import { NotificacaoWhatsapp } from "../models/agendamentoNotificacaoObserver/NotificacaoWhatsapp";
import HorarioFuncionario from "../models/horariosFuncionario";



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
            throw error;
        } finally {
            connection.release();
        }
    }


    async atualizarCliente(id: number, data: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            connection.beginTransaction();
            const clienteModel = new Cliente("", "", "", "", 0);
            const clienteExistente = await Cliente.getClienteById(id, connection);

            if (!clienteExistente)
                throw new Error("Cliente não encontrado");


            const clienteAtualizado = await clienteModel.update(id, data, connection);
            connection.commit();
            return clienteAtualizado;
        } catch (error) {
            connection.rollback();
            throw error;
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

            if (!clienteExistente) {
                throw new Error("Cliente não encontrado");
            }

            const clienteExcluido = await clienteModel.delete(id, connection);
            connection.commit();
            return clienteExcluido;
        } catch (error) {
            connection.rollback();
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
            throw error;
        } finally {
            connection.release();
        }
    }

    async Agendar(cliente_id: number, atendente_id: number, serv_id: number, dataEhora: any) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            await connection.beginTransaction();
                dataEhora = new Date(dataEhora.replace(" ", "T") + "Z");
    
            const servico = await Servico.getServicoById(serv_id, connection);
            if (!servico) {
                throw new Error("Serviço não encontrado");
            }
    
            const horarioValido = await Agendamento.validarDisponibilidade(atendente_id, dataEhora, connection);
            if (!horarioValido) {
                throw new Error("Horário indisponível para agendamento.");
            }
    
            console.log("data do criar item ",dataEhora);
            const itemId = await Cliente.createItem(atendente_id, serv_id, dataEhora, connection);
            const agendamento = new Agendamento(cliente_id, itemId);
    
            agendamento.adicionarObservador(new NotificacaoEmail());
            agendamento.adicionarObservador(new NotificacaoWhatsapp());
            await agendamento.create(connection);
            await HorarioFuncionario.marcarComoOcupado(atendente_id, dataEhora, connection);
    
            await connection.commit();
            console.log("Agendamento criado e notificações preparadas.");
            return agendamento;
    
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
    

}
export = ClienteController;
