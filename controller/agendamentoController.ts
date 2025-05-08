import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';
import { LogEstadoSistema } from '../models/agendamentoNotificacaoObserver/logEstado';
import { NotificacaoAtendente } from '../models/agendamentoNotificacaoObserver/notificacaoAtendente';
import { NotificacaoCliente } from '../models/agendamentoNotificacaoObserver/notificacaoCliente';
import { NotificacaoEstabelecimento } from '../models/agendamentoNotificacaoObserver/notificacaoEstabelecimento';
import Atendente from '../models/atendente';
import Item from '../models/item';

class AgendamentoController {

    async avancarEstado(agendamentoId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);

            if (resultado && resultado.length > 0) {
                const dados = resultado[0];
                const agendamento = new Agendamento(dados.cliente_id, dados.item_id, dados.estado,dados.id);

                // Notifica o cliente
                agendamento.adicionarObservador(new NotificacaoCliente());
                // Log do sistema
                agendamento.adicionarObservador(new LogEstadoSistema());

                // Notifica empresa responsável
                const empresaUserId = await Item.getEmpresaUserIdPorItem(dados.item_id, connection);
                if (empresaUserId) {
                    agendamento.adicionarObservador(new NotificacaoEstabelecimento(empresaUserId));
                }

                // Notifica atendente responsável
                const atendenteUserId = await Item.getAtendenteUserIdPorItem(dados.item_id, connection);
                if (atendenteUserId) {
                    agendamento.adicionarObservador(new NotificacaoAtendente(atendenteUserId));
                }

                await agendamento.avancarEstado(agendamentoId, connection);
                return agendamento;
            } else {
                throw new Error(`Agendamento com ID ${agendamentoId} não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao avançar estado do agendamento:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async cancelarAgendamento(agendamentoId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();

        try {
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);
            console.log(resultado);
            if (resultado && resultado.length > 0) {
                const dados = resultado[0];
                const agendamento = new Agendamento(dados.cliente_id, dados.item_id, dados.estado, dados.id);

                // Notifica o cliente
                agendamento.adicionarObservador(new NotificacaoCliente());

                // Log do sistema
                agendamento.adicionarObservador(new LogEstadoSistema());

                // Notifica empresa responsável
                const empresaUserId = await Item.getEmpresaUserIdPorItem(dados.item_id, connection);
                if (empresaUserId) {
                    agendamento.adicionarObservador(new NotificacaoEstabelecimento(empresaUserId));
                }
                
                // Notifica atendente responsável
                const atendenteUserId = await Item.getAtendenteUserIdPorItem(dados.item_id, connection);
                if (atendenteUserId) {
                    agendamento.adicionarObservador(new NotificacaoAtendente(atendenteUserId));
                }
                //const dataHora= await HorarioFuncionario.marcarComoLivre(agendamentoId, connection);
                await agendamento.cancelarAgendamento(agendamentoId, connection);
                connection.commit();
                return agendamento;
            } else {
                throw new Error(`Agendamento com ID ${agendamentoId} não encontrado.`);
            }
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getAgendamentos(atendenteId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const [existe] = await Atendente.getAtendenteById(atendenteId, connection);
            if (existe.length <= 0)
                throw new Error(`Atendente não encontrado`);
            const agendamentos = await Agendamento.getAgendamentos(atendenteId, connection);
            console.log("RETORNO: ",agendamentos);
            return agendamentos;
        }catch(e){
            console.error("Erro ao buscar agendamentos", e);
            throw e;
        } finally {
            connection.release();
        }
    }
}

export default AgendamentoController;