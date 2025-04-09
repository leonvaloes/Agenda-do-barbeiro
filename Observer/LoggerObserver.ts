// src/observers/LoggerObserver.ts
import { IAgendamentoObserver } from './IAgendamentoObserver';

export class LoggerObserver implements IAgendamentoObserver {
  notificar(dados: any): void {
    console.log('Novo agendamento:', dados);
  }
}
