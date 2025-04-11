import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';
import Notificacao from '../Notificacao';
import Email from '../notificacaoStrategy/email';
export class NotificacaoEmail implements IObservadorAgendamento {
  notificar(agendamento: Agendamento): void {
    const notificacao = new Notificacao(`Ocorreu uma atualização sobre o estado: ${agendamento.estado.nome}`, agendamento.clienteId, new Email());
    notificacao.enviar();

  }
}
