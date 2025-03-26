const express = require('express');
const Routes = require('./routes/routes');
import DatabaseManager from './config/database';

class Server {
    app: any;

    constructor() {
        this.app = express();
        this.connectDatabase(); // Corrigido o nome do método
        this.setupMiddlewares(); // Configura os middlewares
        this.setupRoutes(); // Configura as rotas
    }

    async connectDatabase() {
        // Obtendo a instância e conexão com o banco de dados
        const databaseManager = DatabaseManager.getInstance();
        // O método `getConnection` deve ser utilizado para obter a conexão
        const connection = databaseManager.getConnection();
        // Aqui você pode adicionar algum código para verificar a conexão, se necessário
        console.log("Banco de dados conectado!");
    }

    // Método para configurar middlewares
    setupMiddlewares() {
        this.app.use(express.json()); // Middleware para parsing de JSON

        // Middleware para logs
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }
    // Método para configurar as rotas
    setupRoutes() {
        new Routes(this.app); // Chamando as rotas
    }

    // Método para conectar ao banco de dados e iniciar o servidor
    start(port) {
        const PORT = process.env.PORT || port;
        this.app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    }
}

// Inicia o servidor na porta 3000
const server = new Server();
server.start(3000);
