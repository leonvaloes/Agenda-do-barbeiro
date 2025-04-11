import Agendamento from "../agendamento";
import Cliente from "../cliente";
import HorarioFuncionario from "../horariosFuncionario";
import AgendamentoBase from "./agendamentoBase";

class AgendamentoPadrao extends AgendamentoBase {
  constructor(
    private clienteId: number,
    private atendenteId: number,
    private servicoId: number,
    private dataHora: Date
  ) {
    super();
  }

  protected validarDados(): void {
    if (!this.clienteId || !this.atendenteId || !this.dataHora) {
      throw new Error("Dados insuficientes para agendamento padrão.");
    }
  }

  protected async validarDisponibilidade(connection: any): Promise<boolean> {
    return await Agendamento.validarDisponibilidade(this.atendenteId, this.dataHora, connection);
  }

  protected async criarItem(connection: any): Promise<number> {
    return await Cliente.createItem(this.atendenteId, this.servicoId, this.dataHora, connection);
  }

  protected async criarAgendamento(itemId: number, connection: any): Promise<number> {
    const agendamento = new Agendamento(this.clienteId, itemId);
    const result: any = await agendamento.create(connection);
    return result[0].insertId;
  }

  protected async posCriacao(itemId: number, agendamentoId: number, connection: any): Promise<void> {
    await HorarioFuncionario.marcarComoOcupado(this.atendenteId, this.dataHora, connection);
    console.log(`Agendamento padrão #${agendamentoId} criado com sucesso.`);
  } 
}

export default AgendamentoPadrao;
