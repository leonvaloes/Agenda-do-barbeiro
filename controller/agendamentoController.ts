import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';
import { NotificacaoEmail } from '../models/agendamentoNotificacaoObserver/notificacaoEmail';
import { NotificacaoWhatsapp } from '../models/agendamentoNotificacaoObserver/NotificacaoWhatsapp';
import Notificacao from '../models/Notificacao';
class AgendamentoController {

    async avancarEstado(agendamentoId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);
            if (resultado && resultado.length > 0) {
                const dados = resultado[0];

                const agendamento = new Agendamento(dados.cliente_id, dados.item_id, dados.estado);

                agendamento.adicionarObservador(new NotificacaoEmail());
                agendamento.adicionarObservador(new NotificacaoWhatsapp());
                

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

}

export default AgendamentoController;
