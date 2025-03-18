// config/database.ts
import { inicializaAtendente } from '../model/atendente';
import Empresa from '../model/empresa';
import { Sequelize } from 'sequelize';


class DatabaseManager {
    static instance: DatabaseManager;
    sequelize: Sequelize | null = null;
    config: any;

    static dbConfig = {
        database: 'meubanco',
        user: 'user',
        password: 'userpassword',
        host: '127.0.0.1'
    };

    constructor(config = DatabaseManager.dbConfig) {
        this.config = config;
    }

    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    async createTable(sequelize:any){
        inicializaAtendente(sequelize);
        
    }

    async connect() {
        if (!this.sequelize) {
            try {
                this.sequelize = new Sequelize(
                    this.config.database,
                    this.config.user,
                    this.config.password,
                    {
                        dialect: 'mysql',
                        host: this.config.host,
                        logging: true
                    }
                );

                await this.sequelize.authenticate();
                console.log('Conectado ao banco de dados MySQL');
                await this.createTable(this.sequelize);
                await this.sequelize.sync({ force: true });
                
                console.log('Modelos sincronizados com o banco de dados');
            } catch (error) {
                console.error('Erro ao conectar ao banco:', error);
                this.sequelize = null;
                throw error;
            }
        }
    }

    async disconnect() {
        if (this.sequelize) {
            await this.sequelize.close();
            console.log('Desconectado do banco de dados');
            this.sequelize = null;
        }
    }

    getSequelize(): Sequelize {
        if (!this.sequelize) {
            throw new Error('Banco de dados não conectado');
        }
        return this.sequelize;
    }
}

export default DatabaseManager;