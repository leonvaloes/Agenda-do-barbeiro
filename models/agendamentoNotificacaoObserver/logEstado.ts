import { IObservadorAgendamento } from './IObservadorAgendamento';
import Agendamento from '../agendamento';

export class LogEstadoSistema implements IObservadorAgendamento {
  notificar(agendamento: Agendamento): void {
    console.log(`[LOG - ESTADO] Agendamento ${agendamento.id} mudou para: ${agendamento.estado.nome}`);
  }
}
