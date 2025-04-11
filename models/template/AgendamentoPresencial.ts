import AgendamentoPadrao from './AgendamentoPadrao';

class AgendamentoPresencial extends AgendamentoPadrao {
  protected validarDados(): void {
    super.validarDados();
    console.log("Agendamento presencial: dados validados.");
    // Podemos adicionar verificações extras se necessário (ex: endereço físico, unidade etc)
  }

  protected async posCriacao(itemId: number, agendamentoId: number, connection: any): Promise<void> {
    await super.posCriacao(itemId, agendamentoId, connection);
    console.log("Instruções de comparecimento foram enviadas ao cliente.");
    // Aqui poderíamos notificar o cliente, marcar sala etc.
  }
}

export default AgendamentoPresencial;
