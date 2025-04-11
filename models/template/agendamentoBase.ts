abstract class AgendamentoBase {
    async agendar(connection: any): Promise<any> {
      this.validarDados();
  
      const horarioDisponivel = await this.validarDisponibilidade(connection);
      if (!horarioDisponivel) {
        throw new Error("Horário indisponível.");
      }
  
      const itemId = await this.criarItem(connection);
      const agendamentoId = await this.criarAgendamento(itemId, connection);
  
      await this.posCriacao(itemId, agendamentoId, connection);
  
      return agendamentoId;
    }
  
    protected abstract validarDados(): void;
    protected abstract validarDisponibilidade(connection: any): Promise<boolean>;
    protected abstract criarItem(connection: any): Promise<number>;
    protected abstract criarAgendamento(itemId: number, connection: any): Promise<number>;
    protected abstract posCriacao(itemId: number, agendamentoId: number, connection: any): Promise<void>;
  }
  
  export default AgendamentoBase;
  