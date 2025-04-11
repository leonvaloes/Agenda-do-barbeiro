import { AgendamentoEstado } from './agendamentoEstado';

export class Cancelado implements AgendamentoEstado {
  nome = 'cancelado';

  avancar(): AgendamentoEstado {
    return this;
  }

  cancelar(): AgendamentoEstado {
    return this;
  }
}
