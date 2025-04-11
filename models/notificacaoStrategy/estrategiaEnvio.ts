interface IEstrategiaEnvio {
  enviar(userId: number, mensagem: string): boolean;
}
export default IEstrategiaEnvio;