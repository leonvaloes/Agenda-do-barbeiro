const express = require('express');
const cors = require('cors'); // Importe o cors
const Routes = require('./routes/routes');
import DatabaseManager from './config/database';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middleware/authMiddleware';


class Server {
    app: any;

    constructor() {
        try {
            this.app = express();
            this.connectDatabase(); // Corrigido o nome do método
            this.setupMiddlewares(); // Configura os middlewares
            this.setupRoutes(); // Configura as rotas
        } catch (e) {
            console.error('Erro ao inicializar o servidor:', e);
        }
    }

    async connectDatabase() {
        try {
            const databaseManager = DatabaseManager.getInstance();
            const connection = databaseManager.getConnection();
            console.log("Banco de dados conectado!");
        } catch (e) {
            console.error('Erro ao conectar ao banco de dados:', e);
        }
    }

    setupMiddlewares() {
        this.app.use(cors({
            origin: 'http://localhost:3001',
            credentials: true
        }));
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    setupRoutes() {
        new Routes(this.app);
    }

    start(port) {
        try {
            const PORT = process.env.PORT || port;
            this.app.listen(PORT, () => {
                console.log(`Servidor rodando na porta ${PORT}`);
            });
        } catch (e) {
            console.error('Erro ao iniciar o servidor:', e);
        }
    }
}

// Inicia o servidor na porta 3000
try{
    const server = new Server();
    server.start(3000);
}catch(e){
    console.error('Erro ao iniciar o servidor:', e);
}

