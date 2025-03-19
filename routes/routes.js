class Routes {
    constructor(app) {
        this.app = app; // O app Express é passado para o construtor
        this.setupRoutes(); // Configura as rotas
    }

    // Método para definir as rotas
    setupRoutes() {
        this.app.use('/atendente', require('../view/atendenteView'));
        this.app.use('/cliente',require('../view/clienteView'));
        this.app.use('/empresa',require('../view/empresaView'));
        this.app.use('/servicos',require('../view/servicoView'))
    }
}

module.exports = Routes; // Exporta a classe Routes
