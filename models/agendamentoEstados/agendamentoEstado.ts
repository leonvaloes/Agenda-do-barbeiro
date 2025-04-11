export interface AgendamentoEstado {
    nome: string;
    avancar(): AgendamentoEstado;
    cancelar(): AgendamentoEstado;
  }
  