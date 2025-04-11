import IEstrategiaEnvio from "./estrategiaEnvio";

class Email implements IEstrategiaEnvio {
  enviar(userId: number, mensagem: string): boolean {
    console.log(`Enviando email: "${mensagem}" para usuário com código ${userId}`);
    return true;
  }
}

export default Email;