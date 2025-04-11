import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';
import Whatsapp from '../notificacaoStrategy/whatsapp';
import Notificacao from '../Notificacao';

export class NotificacaoWhatsapp implements IObservadorAgendamento {
  notificar(agendamento: Agendamento): void {
    const notificacao = new Notificacao(`[WHATSAPP] Cliente ${agendamento.clienteId} recebeu mensagem: novo estado ${agendamento.estado.nome}`, agendamento.clienteId, new Whatsapp());
    notificacao.enviar();

  }
}
