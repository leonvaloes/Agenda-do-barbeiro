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
    user.nome AS nome_atendente,
    cliente_user.nome AS nome_cliente,
    cliente_user.email AS email_cliente
FROM agendamento
INNER JOIN item ON agendamento.item_id = item.id 
INNER JOIN servicos ON item.serv_id = servicos.id
INNER JOIN atendente ON item.atendente_id = atendente.id
INNER JOIN user ON atendente.atendente_user_id = user.id
INNER JOIN cliente ON agendamento.cliente_id = cliente.id
INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
WHERE atendente.id = ?
ORDER BY item.data_hora DESC;`

    try {
      const [result] = await connection.execute(query, [id]);
      console.log(result);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getAgendamentosDoDia(id: number, connection: any) {
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
      user.nome AS nome_atendente,
      cliente_user.nome AS nome_cliente,
      cliente_user.email AS email_cliente
    FROM agendamento
    INNER JOIN item ON agendamento.item_id = item.id 
    INNER JOIN servicos ON item.serv_id = servicos.id
    INNER JOIN atendente ON item.atendente_id = atendente.id
    INNER JOIN user ON atendente.atendente_user_id = user.id
    INNER JOIN cliente ON agendamento.cliente_id = cliente.id
    INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
    WHERE atendente.id = ?
      AND DATE(item.data_hora) = CURDATE()
      AND agendamento.estado != 'concluído'
      AND agendamento.estado != 'cancelado'
  `;

    try {
      const [result] = await connection.execute(query, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getProximosAgendamentos(id: number, connection: any) {
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
      user.nome AS nome_atendente,
      cliente_user.nome AS nome_cliente,
      cliente_user.email AS email_cliente
    FROM agendamento
    INNER JOIN item ON agendamento.item_id = item.id 
    INNER JOIN servicos ON item.serv_id = servicos.id
    INNER JOIN atendente ON item.atendente_id = atendente.id
    INNER JOIN user ON atendente.atendente_user_id = user.id
    INNER JOIN cliente ON agendamento.cliente_id = cliente.id
    INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
    WHERE atendente.id = ?
      AND YEARWEEK(item.data_hora, 1) = YEARWEEK(CURDATE(), 1)
      AND agendamento.estado != 'concluído'
      AND agendamento.estado != 'cancelado'
  `;

    try {
      const [result] = await connection.execute(query, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getConcluidosDaSemana(id: number, connection: any) {
    const query = `
    SELECT 
      agendamento.*, 
      item.data_hora, 
      item.atendente_id, 
      item.serv_id AS servico_item_id
    FROM agendamento
    INNER JOIN item ON agendamento.item_id = item.id 
    INNER JOIN atendente ON item.atendente_id = atendente.id
    INNER JOIN user ON atendente.atendente_user_id = user.id
    WHERE atendente.id = ?
      AND YEARWEEK(item.data_hora, 1) = YEARWEEK(CURDATE(), 1)
      AND agendamento.estado = 'concluído';
  `;
    try {
      const [result] = await connection.execute(query, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getPendentes(id: number, connection: any) {
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
      user.nome AS nome_atendente,
      cliente_user.nome AS nome_cliente,
      cliente_user.email AS email_cliente
    FROM agendamento
    INNER JOIN item ON agendamento.item_id = item.id 
    INNER JOIN servicos ON item.serv_id = servicos.id
    INNER JOIN atendente ON item.atendente_id = atendente.id
    INNER JOIN user ON atendente.atendente_user_id = user.id
    INNER JOIN cliente ON agendamento.cliente_id = cliente.id
    INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
    WHERE atendente.id = ?
      AND agendamento.estado != 'concluído'
      AND agendamento.estado != 'cancelado'
  `;

    try {
      const [result] = await connection.execute(query, [id]);
      return result;

    } catch (e) {
      throw e;
    }
  }

  static async getAgendamentosByEmpresa(id: number, connection: any) {
    const query = `
      SELECT agendamento.*, 
    servicos.id AS servico_id, 
    servicos.nome AS nome_servico,
    servicos.descricao,
    servicos.tempo_medio,
    item.data_hora, 
    item.atendente_id, 
    item.serv_id AS servico_item_id,
    user.nome AS nome_atendente,
    cliente_user.nome AS nome_cliente,
    cliente_user.email AS email_cliente
FROM agendamento
INNER JOIN item ON agendamento.item_id = item.id 
INNER JOIN servicos ON item.serv_id = servicos.id
INNER JOIN atendente ON item.atendente_id = atendente.id
INNER JOIN user ON atendente.atendente_user_id = user.id
INNER JOIN cliente ON agendamento.cliente_id = cliente.id
INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
WHERE atendente.empresa_id = ?
ORDER BY item.data_hora DESC;`
    try {
      const [result] = await connection.execute(query, [id]);
      console.log("RESULT MODEL: ", result);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getAgendamentosPorSemanaByEmpresa(id: number, connection: any) {
    const query = `
      SELECT agendamento.*, 
    servicos.id AS servico_id, 
    servicos.nome AS nome_servico,
    servicos.descricao,
    servicos.tempo_medio,
    item.data_hora, 
    item.atendente_id, 
    item.serv_id AS servico_item_id,
    user.nome AS nome_atendente,
    cliente_user.nome AS nome_cliente,
    cliente_user.email AS email_cliente
    FROM agendamento
    INNER JOIN item ON agendamento.item_id = item.id 
    INNER JOIN servicos ON item.serv_id = servicos.id
    INNER JOIN atendente ON item.atendente_id = atendente.id
    INNER JOIN user ON atendente.atendente_user_id = user.id
    INNER JOIN cliente ON agendamento.cliente_id = cliente.id
    INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
    WHERE atendente.empresa_id = ?
    AND item.data_hora >= CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY
    AND item.data_hora < CURDATE() + INTERVAL (6 - WEEKDAY(CURDATE())) DAY
    ORDER BY item.data_hora DESC;`
    try {
      const [result] = await connection.execute(query, [id]);
      console.log("RESULT MODEL: ", result);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getAgendamentosByCliente(id: number, connection: any) {
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
        user.nome AS nome_atendente,
        empresa.id AS empresa_id,
        empresa.nome_fantasia AS nome_empresa
      FROM agendamento
      INNER JOIN item ON agendamento.item_id = item.id 
      INNER JOIN servicos ON item.serv_id = servicos.id
      INNER JOIN atendente ON item.atendente_id = atendente.id
      INNER JOIN user ON atendente.atendente_user_id = user.id
      INNER JOIN empresa ON atendente.empresa_id = empresa.id
      WHERE agendamento.cliente_id = ?
      ORDER BY item.data_hora DESC;`
    try {
      const [result] = await connection.execute(query, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getRelatorioAtendente(id: number, dataInicio: any, dataFim: any, connection: any) {
    const query = `
      SELECT
        agendamento.estado,
        cliente_user.nome AS nome_cliente,
        servicos.valor,
        item.data_hora,
        atendente_user.nome AS nome_atendente
      FROM agendamento
        INNER JOIN item ON agendamento.item_id = item.id
        INNER JOIN servicos ON item.serv_id = servicos.id
        INNER JOIN atendente ON item.atendente_id = atendente.id
        INNER JOIN user AS atendente_user ON atendente.atendente_user_id = atendente_user.id
        INNER JOIN cliente ON agendamento.cliente_id = cliente.id
        INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
        INNER JOIN empresa ON atendente.empresa_id = empresa.id
      WHERE atendente.id = ?
      AND item.data_hora BETWEEN ? AND ?
      ORDER BY item.data_hora DESC;`

    try {
      const response = await connection.execute(query, [id, dataInicio, dataFim]);
      return response[0];
    } catch (e) {
      throw e;
    }
  }

  static async getRelatorioEmpresa(empresaId: number, dataInicio: any, dataFim: any, connection: any) {
    const query = `
      SELECT
          agendamento.estado,
          cliente_user.nome AS nome_cliente,
          servicos.valor,
          item.data_hora,
          atendente_user.nome AS nome_atendente
      FROM agendamento
          INNER JOIN item ON agendamento.item_id = item.id
          INNER JOIN servicos ON item.serv_id = servicos.id
          INNER JOIN atendente ON item.atendente_id = atendente.id
          INNER JOIN user AS atendente_user ON atendente.atendente_user_id = atendente_user.id
          INNER JOIN cliente ON agendamento.cliente_id = cliente.id
          INNER JOIN user AS cliente_user ON cliente.cliente_user_id = cliente_user.id
          INNER JOIN empresa ON atendente.empresa_id = empresa.id
      WHERE empresa.id = ?
        AND item.data_hora BETWEEN ? AND ?
      ORDER BY item.data_hora DESC;
    `
    try {
      const response = await connection.execute(query, [empresaId, dataInicio, dataFim]);
      return response[0];
    } catch (e) {
      throw e;
    }
  }

  static async getAgendamentosAtendenteByData(id: number, data: any, connection: any) {
    const query = `
    SELECT * 
    FROM item
    INNER JOIN agendamento ON item.id = agendamento.item_id
    WHERE DATE(data_hora)=? 
    AND atendente_id=? AND agendamento.estado!='cancelado' AND agendamento.estado!='concluído'`
    try {
      const response = await connection.execute(query, [data, id]);
      return response[0];
    } catch (e) {
      throw e;
    }
  }

  static async getAgendamentosById(id: number, connection: any) {
    const query = `
      SELECT * FROM agendamento WHERE id = ?`;
    try {
      const [result] = await connection.execute(query, [id]);
      return result;
    } catch (e) {
      throw e;
    }
  }

  static async getItemByAgendamento(id: number, connection: any) {
    const query = `
      SELECT data_hora FROM item WHERE id = (
        SELECT item_id FROM agendamento WHERE id = ?
      )`;
    try {
      const [result] = await connection.execute(query, [id]);
      return result[0].data_hora;
    } catch (e) {
      throw e;
    }
  }

  static async atualizarAgendamento(id: number, clienteId: number, itemId: number, connection: any) {
    const query = `UPDATE agendamento SET cliente_id = ?, item_id = ? WHERE id = ?`;
    try {
      return await connection.execute(query, [clienteId, itemId, id]);
    } catch (error) {
      throw error;
    }
  }

  static async getRemarcarAgendamentos(id: number, connection: any) {
    const query = `
      SELECT 
        item.id AS item_id,
        item.data_hora AS data_hora,
        servicos.tempo_medio AS tempo_medio,
        user.nome AS nome_cliente, 
        atendente.id AS atendente_id,    
        agendamento.id AS id, 
        servicos.nome AS nome_servico     
      FROM item
      JOIN agendamento ON agendamento.item_id = item.id
      JOIN cliente ON cliente.id = agendamento.cliente_id
      JOIN servicos ON servicos.id = item.serv_id
      JOIN user ON user.id = cliente.cliente_user_id
      JOIN atendente ON atendente.id = item.atendente_id
      WHERE item.atendente_id = ?
        AND NOT EXISTS (
          SELECT 1
          FROM horario_atendente ha
          WHERE ha.atendente_id = item.atendente_id
            AND ha.data_hora = item.data_hora
        );
    `;
    try {
      const [result] = await connection.execute(query, [id]);
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
