import DatabaseManager from '../config/database';
import Agendamento from '../models/agendamento';

class AgendamentoController {
  async createAgendamento(agendamentoData: { clienteId: number; itemId: number }) {
    const connection = await DatabaseManager.getInstance().getConnection();

    try {
      await connection.beginTransaction();

      const idCriado = await Agendamento.create(
        agendamentoData.clienteId,
        agendamentoData.itemId,
        connection
      );

      await connection.commit();
      console.log(`Agendamento criado com ID: ${idCriado}`);
      return idCriado;

    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async getAgendamentoById(id: number) {
    const connection = await DatabaseManager.getInstance().getConnection();

    try {
      const agendamento = await Agendamento.getAgendamentoById(id, connection);
      return agendamento;
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
  async listarAgendamentos() {
    const connection = await DatabaseManager.getInstance().getConnection();

    try {
      const agendamentos = await Agendamento.listarAgendamentos(connection);
      return agendamentos;
    } catch (error) {
      console.error("Erro ao listar agendamentos:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
  async updateAgendamento(id: number, agendamentoData: { clienteId: number; itemId: number }) {
    const connection = await DatabaseManager.getInstance().getConnection();

    try {
      await connection.beginTransaction();

      await Agendamento.update(id, agendamentoData.clienteId, agendamentoData.itemId, connection);

      await connection.commit();
      console.log(`Agendamento atualizado com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async deleteAgendamento(id: number) {
    const connection = await DatabaseManager.getInstance().getConnection();

    try {
      await connection.beginTransaction();

      await Agendamento.delete(id, connection);

      await connection.commit();
      console.log(`Agendamento deletado com sucesso!`);
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async getAgendamentoByClienteId(id: number) {
    const connection = await DatabaseManager.getInstance().getConnection();

    try {
      const agendamento = await Agendamento.getAgendamentoByClienteId(id, connection);
      return agendamento;
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
}

export default AgendamentoController;
