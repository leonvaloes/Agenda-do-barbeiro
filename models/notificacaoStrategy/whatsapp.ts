class Whatsapp implements IEstrategiaEnvio {
    enviar(userId: number, mensagem: string): boolean {
      console.log(`Enviando mensagem pelo zap: "${mensagem}" para usuário ${userId}`);
      return true;
    }
  }