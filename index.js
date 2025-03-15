const express = require('express');
const Routes = require('./routes/routes'); // Corrigido: importando corretamente a classe Routes

class Server {
    constructor() {
        this.app = express();
        this.setupMiddlewares(); // Configura os middlewares
        this.setupRoutes(); // Configura as rotas
    }

    // Método para configurar middlewares
    setupMiddlewares() {
        this.app.use(express.json());
        
        // Middleware para logs
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    // Método para configurar as rotas
    setupRoutes() {
        // Aqui criamos a instância de Routes e passamos o app
        new Routes(this.app);
    }

    // Método para iniciar o servidor
    start(port) {
        const PORT = process.env.PORT || port;
        this.app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
}

const server = new Server();
server.start(3000);
