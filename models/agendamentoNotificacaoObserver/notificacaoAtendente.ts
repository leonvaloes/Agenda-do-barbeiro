import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';
import Notificacao from '../Notificacao';
import Email from '../notificacaoStrategy/email';

export class NotificacaoAtendente implements IObservadorAgendamento {
  private userId: number;

  constructor(userId: number) {
    this.userId = userId;
  }

  notificar(agendamento: Agendamento): void {
    const msg = `[ATENDENTE] Agendamento ${agendamento.id} atualizado para estado: ${agendamento.estado.nome}`;
    const notificacao = new Notificacao(msg, this.userId, new Email());
    notificacao.enviar();
  }
}
