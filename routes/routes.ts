import atendenteView from '../view/atendenteView';
import clienteView from '../view/clienteView';
import empresaView from '../view/empresaView';
import servicoView from '../view/servicoView';
import agendamentoView from '../view/agendamentoView';
import loginView from '../view/loginView';
import authMiddleware from '../middleware/authMiddleware';
class Routes {
    app: any;

    constructor(app) {
        this.app = app;
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.use('/ping', (req, res) => {
            res.send('pong');
        });
        this.app.use('/atendente' ,atendenteView);
        this.app.use('/cliente', clienteView);
        this.app.use('/empresa', empresaView);
        this.app.use('/servicos', servicoView);
        this.app.use('/agendamento', agendamentoView);
        this.app.use('/login', loginView);
    }
}

export = Routes;
