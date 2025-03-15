const express = require('express');
const DatabaseManager = require('./config/database');
const Routes = require('./routes/routes'); // Corrigido: importando corretamente a classe Routes

class Server {
    constructor() {
        this.app = express();
        this.connectdatabase();
        this.setupMiddlewares(); // Configura os middlewares
        this.setupRoutes(); // Configura as rotas
    }


    async connectdatabase() {
        try {
            const dbManager = DatabaseManager.getInstance();
            await dbManager.connect();
            console.log('Banco conectado e pronto para uso!');
        }
        catch (e) {
            console.error('Erro ao conectar ao banco:', e);
        }

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

    // Método para conectar ao banco de dados e iniciar o servidor
    start(port) {

        const PORT = process.env.PORT || port;
        this.app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
}

const server = new Server();
server.start(3000);
