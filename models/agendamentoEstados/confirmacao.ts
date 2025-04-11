import { AgendamentoEstado } from './agendamentoEstado';
import { Confirmado } from './confirmado';
import { Cancelado } from './cancelado';

export class Confirmacao implements AgendamentoEstado {
  nome = 'confirmação';

  avancar(): AgendamentoEstado {
    return new Confirmado();
  }

  cancelar(): AgendamentoEstado {
    return new Cancelado();
  }
}
