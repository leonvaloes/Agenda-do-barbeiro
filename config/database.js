const { Sequelize } = require('sequelize');

class DatabaseManager {
    static instance;

    static dbConfig = {
        database: 'meubanco',
        user: 'user',
        password: 'userpassword',
        host: '127.0.0.1'
    };

    constructor(config = DatabaseManager.dbConfig) { // Usa o dbConfig padrão se não for passado
        this.config = config;
        this.sequelize = null;
    }


    static getInstance() {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
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
                await this.sequelize.sync();
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

    getSequelize() {
        if (!this.sequelize) {
            throw new Error('Banco de dados não conectado');
        }
        return this.sequelize;
    }


    
}

module.exports = DatabaseManager;
