import { AgendamentoEstado } from './agendamentoEstados/agendamentoEstado';
import { Confirmacao } from './agendamentoEstados/confirmacao';
import { Confirmado } from './agendamentoEstados/confirmado';
import { Concluido } from './agendamentoEstados/concluido';
import { Cancelado } from './agendamentoEstados/cancelado';
import { IObservadorAgendamento } from './agendamentoNotificacaoObserver/IObservadorAgendamento';

class Agendamento {
  id: number;
  clienteId: number;
  itemId: number;
  estado: AgendamentoEstado;
  private observadores: IObservadorAgendamento[] = [];

  constructor(clienteId: number, itemId: number, estado?: string, id?: number) {
    this.id = id ?? 0;
    this.clienteId = clienteId;
    this.itemId = itemId;
    this.estado = this.mapearEstado(estado || 'confirmação');
  }

  private mapearEstado(nomeEstado: string): AgendamentoEstado {
    switch (nomeEstado) {
      case 'confirmado': return new Confirmado();
      case 'concluído': return new Concluido();
      case 'cancelado': return new Cancelado();
      default: return new Confirmacao();
    }
  }

  async avancarEstado(agendamentoId: number, connection: any): Promise<void> {
    this.estado = this.estado.avancar();
    await this.atualizarEstado(agendamentoId, connection);
    this.notificarTodos();
  }

  async cancelarAgendamento(agendamentoId: number, connection: any): Promise<void> {
    this.estado = this.estado.cancelar();
    await this.atualizarEstado(agendamentoId, connection);
    this.notificarTodos();
  }

  private async atualizarEstado(id:number, connection: any): Promise<void> {
    const query = `UPDATE agendamento SET estado = ? WHERE id = ?`;
    connection.execute(query, [this.estado.nome, id]);   
  }

  async create(connection: any) {

    const query = `INSERT INTO agendamento (estado, cliente_id, item_id ) VALUES (?, ?, ?)`;
    const values=[this.estado.nome, this.clienteId, this.itemId];
    try {
      const agendamento = await connection.execute(query,values);
      return agendamento;
    }catch(error){
      throw error;
    }
  }

  static async getAgendamentoById(id: number, connection: any){
    const query = `SELECT * FROM agendamento WHERE id = ?`;
    try {
      const result = await connection.execute(query, [id]);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  adicionarObservador(obs: IObservadorAgendamento) {
    this.observadores.push(obs);
  }
  
  removerObservador(obs: IObservadorAgendamento) {
    this.observadores = this.observadores.filter(o => o !== obs);
  }
  
  private notificarTodos() {
    this.observadores.forEach(obs => obs.notificar(this));
  }
}

export default Agendamento;
