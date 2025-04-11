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
      case 'confirmado': return new Confirmado();
      case 'concluído': return new Concluido();
      case 'cancelado': return new Cancelado();
      default: return new Confirmacao();
    }
  }

  async avancarEstado(connection: any): Promise<void> {
    this.estado = this.estado.avancar();
    await this.atualizarEstado(connection);
  }

  async cancelarAgendamento(connection: any): Promise<void> {
    this.estado = this.estado.cancelar();
    await this.atualizarEstado(connection);
  }

  private async atualizarEstado(connection: any): Promise<void> {
    const query = `UPDATE agendamento SET estado = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      connection.query(query, [this.estado.nome, this.id], (err: any) => {
        if (err) {
          console.error('Erro ao atualizar estado do agendamento:', err);
          return reject(err);
        }
        console.log(`Estado atualizado para: ${this.estado.nome}`);
        resolve();
      });
    });
  }

  static async create(clienteId: number, itemId: number, connection: any): Promise<number> {
    const estadoInicial = 'confirmação';
    const query = `INSERT INTO agendamento (clienteId, itemId, estado) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
      connection.query(query, [clienteId, itemId, estadoInicial], (err: any, results: any) => {
        if (err) return reject(err);
        console.log('Agendamento criado com sucesso');
        resolve(results.insertId);
      });
    });
  }

  static async getAgendamentoById(id: number, connection: any): Promise<Agendamento | null> {
    const query = `SELECT * FROM agendamento WHERE id = ?`;

    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err: any, results: any) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        const row = results[0];
        const agendamento = new Agendamento(row.clienteId, row.itemId, row.estado);
        agendamento.id = row.id;
        resolve(agendamento);
      });
    });
  }

  static async listarAgendamentos(connection: any): Promise<Agendamento[]> {
    const query = `SELECT * FROM agendamento`;

    return new Promise((resolve, reject) => {
      connection.query(query, (err: any, results: any[]) => {
        if (err) return reject(err);
        const agendamentos = results.map((row) => {
          const ag = new Agendamento(row.clienteId, row.itemId, row.estado);
          ag.id = row.id;
          return ag;
        });
        resolve(agendamentos);
      });
    });
  }

  static async update(id: number, clienteId: number, itemId: number, connection: any): Promise<void> {
    const query = `UPDATE agendamento SET clienteId = ?, itemId = ? WHERE id = ?`;

    return new Promise((resolve, reject) => {
      connection.query(query, [clienteId, itemId, id], (err: any) => {
        if (err) return reject(err);
        console.log('Agendamento atualizado com sucesso');
        resolve();
      });
    });
  }

  static async delete(id: number, connection: any): Promise<void> {
    const query = `DELETE FROM agendamento WHERE id = ?`;

    return new Promise((resolve, reject) => {
      connection.query(query, [id], (err: any) => {
        if (err) return reject(err);
        console.log('Agendamento deletado com sucesso');
        resolve();
      });
    });
  }

  static async getAgendamentoByClienteId(clienteId: number, connection: any): Promise<Agendamento[]> {
    const query = `SELECT * FROM agendamento WHERE clienteId = ?`;

    return new Promise((resolve, reject) => {
      connection.query(query, [clienteId], (err: any, results: any[]) => {
        if (err) return reject(err);
        const agendamentos = results.map((row) => {
          const ag = new Agendamento(row.clienteId, row.itemId, row.estado);
          ag.id = row.id;
          return ag;
        });
        resolve(agendamentos);
      });
    });
  }
}

export default Agendamento;
