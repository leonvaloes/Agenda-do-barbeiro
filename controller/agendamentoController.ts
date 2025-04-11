import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';
import { NotificacaoEmail } from '../models/agendamentoNotificacaoObserver/notificacaoEmail';
import { NotificacaoWhatsapp } from '../models/agendamentoNotificacaoObserver/NotificacaoWhatsapp';

class AgendamentoController {

    async avancarEstado(agendamentoId: number) {
        const connection = await DatabaseManager.getInstance().getConnection();
        try {
            const resultado = await Agendamento.getAgendamentoById(agendamentoId, connection);
            if (resultado && resultado.length > 0) {
                const dados = resultado[0];

                // ⚙️ Reconstrói o agendamento com estado atual
                const agendamento = new Agendamento(dados.cliente_id, dados.item_id, dados.estado);

                // ✅ Adiciona os observadores antes de avançar o estado
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
