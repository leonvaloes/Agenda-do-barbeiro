// src/observers/NotificarAtendenteObserver.ts
import { IAgendamentoObserver } from './IAgendamentoObserver';

export class NotificarAtendenteObserver implements IAgendamentoObserver {
    notificar(dados: any): void {      
        console.log(`Notificação para Atendente ${dados.atendente_id}:`);
        console.log(`Cliente: ${dados.cliente_nome}`);
        console.log(`Serviço: ${dados.servico_nome}`);
        console.log(`Data e Hora: ${dados.data_hora}`);
      }
      
}
