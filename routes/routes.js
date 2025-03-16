class Routes {
    constructor(app) {
        this.app = app; // O app Express é passado para o construtor
        this.setupRoutes(); // Configura as rotas
    }

    // Método para definir as rotas
    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        this.app.get('/about', (req, res) => {
            res.send('About Page');
        });
        
        this.app.use('/cliente', require('../view/clienteView'));

        
    }
}

module.exports = Routes; // Exporta a classe Routes
