import { AgendamentoEstado } from './agendamentoEstado';
import { Concluido } from './concluido';
import { Cancelado } from './cancelado';

export class Confirmado implements AgendamentoEstado {
  nome = 'confirmado';

  avancar(): AgendamentoEstado {
    return new Concluido();
  }

  cancelar(): AgendamentoEstado {
    return new Cancelado();
  }
  
}
