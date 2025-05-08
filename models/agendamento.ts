import { AgendamentoEstado } from './agendamentoEstados/agendamentoEstado';
import { Confirmacao } from './agendamentoEstados/confirmacao';
import { Confirmado } from './agendamentoEstados/confirmado';
import { Concluido } from './agendamentoEstados/concluido';
import { Cancelado } from './agendamentoEstados/cancelado';
import { IObservadorAgendamento } from './agendamentoNotificacaoObserver/IObservadorAgendamento';
import UnformatDate from '../type/unformatDate';

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

  private async atualizarEstado(id: number, connection: any): Promise<void> {
    const query = `UPDATE agendamento SET estado = ? WHERE id = ?`;
    connection.execute(query, [this.estado.nome, id]);
  }

  static async validarDisponibilidade(atendenteId: number, dataHora: Date, connection: any): Promise<boolean> {
    const formatador = new UnformatDate();
    const dataHoraFormatada = formatador.FormatDate(dataHora);

    const query = `
      SELECT * 
      FROM item 
      WHERE atendente_id = ? AND data_hora = ?
    `;
    const [rows]: any = await connection.execute(query, [atendenteId, dataHoraFormatada]);

    // Se não encontrou horário ou já está ocupado, retorna falso
    if (!rows.length) {
      console.log(rows);
      return true;
    }

    return false;
  }

  async create(connection: any) {

    const query = `INSERT INTO agendamento (estado, cliente_id, item_id ) VALUES (?, ?, ?)`;
    const values = [this.estado.nome, this.clienteId, this.itemId];
    try {
      const agendamento = await connection.execute(query, values);
      return agendamento;
    } catch (error) {
      throw error;
    }
  }

  static async getAgendamentoById(id: number, connection: any) {
    const query = `SELECT * FROM agendamento WHERE id = ?`;
    try {
      const result = await connection.execute(query, [id]);
      return result[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAgendamentos(id: number, connection: any) {
    const query = `
      SELECT 
    agendamento.*, 
    servicos.id AS servico_id, 
    servicos.nome AS nome_servico,
    servicos.descricao,
    servicos.tempo_medio,
    item.data_hora, 
    item.atendente_id, 
    item.serv_id AS servico_item_id,
    user.nome AS nome_atendente
FROM agendamento
INNER JOIN item ON agendamento.item_id = item.id 
INNER JOIN servicos ON item.serv_id = servicos.id
INNER JOIN atendente ON item.atendente_id = atendente.id
INNER JOIN user ON atendente.atendente_user_id = user.id
WHERE atendente.id = ?`
    try {
      const [result] = await connection.execute(query, [id]);
      console.log(result);
      return result;
    } catch (e) {
      throw e;
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
