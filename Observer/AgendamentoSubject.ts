// src/observers/AgendamentoSubject.ts
import { IAgendamentoObserver } from './IAgendamentoObserver';

export class AgendamentoSubject {
  private observers: IAgendamentoObserver[] = [];

  adicionar(observer: IAgendamentoObserver) {
    this.observers.push(observer);
  }

  remover(observer: IAgendamentoObserver) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notificarTodos(dados: any) {
    this.observers.forEach(observer => observer.notificar(dados));
  }
}
