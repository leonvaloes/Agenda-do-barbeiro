import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';
import Whatsapp from '../notificacaoStrategy/whatsapp';
import Notificacao from '../Notificacao';

export class NotificacaoEstabelecimento implements IObservadorAgendamento {
  private empresaUserId: number;

  constructor(empresaUserId: number) {
    this.empresaUserId = empresaUserId;
  }

  notificar(agendamento: Agendamento): void {
    const msg = `[ESTABELECIMENTO] O agendamento de cliente ${agendamento.clienteId} mudou para estado: ${agendamento.estado.nome}`;
    const notificacao = new Notificacao(msg, this.empresaUserId, new Whatsapp());
    notificacao.enviar();
  }
}
