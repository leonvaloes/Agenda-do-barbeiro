import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';

export class NotificacaoWhatsapp implements IObservadorAgendamento {
  notificar(agendamento: Agendamento): void {
    console.log(`[WHATSAPP] Cliente ${agendamento.clienteId} recebeu mensagem: novo estado ${agendamento.estado.nome}`);
  }
}
