import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';
import Email from '../notificacaoStrategy/email';
import Notificacao from '../Notificacao';

export class NotificacaoCliente implements IObservadorAgendamento {
  notificar(agendamento: Agendamento): void {
    const msg = `[CLIENTE] Agendamento atualizado para estado: ${agendamento.estado.nome}`;
    const notificacao = new Notificacao(msg, agendamento.clienteId, new Email());
    notificacao.enviar();
  }
}
