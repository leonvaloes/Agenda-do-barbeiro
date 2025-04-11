import IEstrategiaEnvio from "../models/notificacaoStrategy/estrategiaEnvio";

class Notificacao {
  mensagem: string;
  usuarioId: number;
  estrategia: IEstrategiaEnvio;

  constructor(mensagem: string, usuarioId: number, estrategia: IEstrategiaEnvio) {
    this.mensagem = mensagem;
    this.usuarioId = usuarioId;
    this.estrategia = estrategia;
  }

  enviar(): boolean {
    return this.estrategia.enviar(this.usuarioId, this.mensagem);
  }

  setEstrategia(estrategia: IEstrategiaEnvio) {
    this.estrategia = estrategia;
  }
}

export default Notificacao;