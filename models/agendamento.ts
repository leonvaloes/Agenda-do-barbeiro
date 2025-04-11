import { AgendamentoEstado } from './agendamentoEstados/agendamentoEstado';
import { Confirmacao } from './agendamentoEstados/confirmacao';
import { Confirmado } from './agendamentoEstados/confirmado';
import { Concluido } from './agendamentoEstados/concluido';
import { Cancelado } from './agendamentoEstados/cancelado';

class Agendamento {
  id: number;
  clienteId: number;
  itemId: number;
  estado: AgendamentoEstado;

  constructor(clienteId: number, itemId: number, estado?: string) {
    this.clienteId = clienteId;
    this.itemId = itemId;
    this.estado = this.mapearEstado(estado || 'confirmação');
  }

  private mapearEstado(nomeEstado: string): AgendamentoEstado {
    switch (nomeEstado) {
      case 'confirmado': console.log("Estado mapeado para 'confirmado'");return new Confirmado();
      case 'concluído': return new Concluido();
      case 'cancelado': return new Cancelado();
      default: return new Confirmacao();
    }
  }

  async avancarEstado(agendamentoId:number, connection: any): Promise<void> {
    this.estado = this.estado.avancar();
    await this.atualizarEstado(agendamentoId, connection);
  }

  async cancelarAgendamento(agendamentoId:number, connection: any): Promise<void> {
    this.estado = this.estado.cancelar();
    await this.atualizarEstado(agendamentoId, connection);
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
      console.log('Agendamento criado com sucesso estado: ', this.estado);
      console.log("Erro ao criar agendamento");
      return null;
    }
  }

  static async getAgendamentoById(id: number, connection: any){
    const query = `SELECT * FROM agendamento WHERE id = ?`;
    try {
      const result = await connection.execute(query, [id]);
      return result[0];
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      throw error;
    }
  }

}

export default Agendamento;
