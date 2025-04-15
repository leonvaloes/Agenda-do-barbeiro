import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';
import { LogEstadoSistema } from '../models/agendamentoNotificacaoObserver/logEstado';
import { NotificacaoAtendente } from '../models/agendamentoNotificacaoObserver/notificacaoAtendente';
import { NotificacaoCliente } from '../models/agendamentoNotificacaoObserver/notificacaoCliente';
import { NotificacaoEmail } from '../models/agendamentoNotificacaoObserver/notificacaoEmail';
import { NotificacaoEstabelecimento } from '../models/agendamentoNotificacaoObserver/notificacaoEstabelecimento';
import { NotificacaoWhatsapp } from '../models/agendamentoNotificacaoObserver/NotificacaoWhatsapp';
import HorarioFuncionario from '../models/horariosFuncionario';
import Item from '../models/item';
import Notificacao from '../models/Notificacao';
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
                const dataHora= await HorarioFuncionario.marcarComoLivre(agendamentoId, connection);
                await agendamento.cancelarAgendamento(agendamentoId, connection);
                console.log(dataHora);
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
}

export default AgendamentoController;
