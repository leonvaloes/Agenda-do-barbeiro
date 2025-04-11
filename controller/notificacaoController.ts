import Notificacao from "../models/Notificacao";
import Email from "../models/notificacaoStrategy/email";
import Whatsapp from "../models/notificacaoStrategy/whatsapp";

class NotificacaoController {
    async SetNotificacao() {
        const notificacao = new Notificacao("Sua consulta foi confirmada!", 123, new Email());
        notificacao.enviar(); // Envia via Email

        notificacao.setEstrategia(new Whatsapp());
        notificacao.enviar(); // Envia via WhatsApp
    }
}

export default NotificacaoController;
