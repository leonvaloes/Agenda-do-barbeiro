import { AgendamentoEstado } from './agendamentoEstado';

export class Concluido implements AgendamentoEstado {
  nome = 'concluído';

  avancar(): AgendamentoEstado {
    return this;
  }

  cancelar(): AgendamentoEstado {
    return this;
  }
}
