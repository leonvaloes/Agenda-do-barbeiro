import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';

export class NotificacaoEmail implements IObservadorAgendamento {
  notificar(agendamento: Agendamento): void {
    console.log(`[EMAIL] Cliente ${agendamento.clienteId} foi notificado sobre o estado: ${agendamento.estado.nome}`);
  }
}
