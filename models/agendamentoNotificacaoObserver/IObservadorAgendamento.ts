import Agendamento from '../agendamento';

export interface IObservadorAgendamento {
  notificar(agendamento: Agendamento): void;
}
