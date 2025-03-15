// config/database.js
const { Sequelize } = require('sequelize');

class DatabaseManager {
    static instance;
    sequelize;

    constructor(config) {
        this.config = config;
    }

    static getInstance(config) {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager(config);
        }
        return DatabaseManager.instance;
    }

    async connect() {
        try {
            this.sequelize = new Sequelize(
                this.config.database,
                this.config.user,
                this.config.password,
                {
                    dialect: 'mysql',
                    host: this.config.host,
                    logging: false
                }
            );

            await this.sequelize.authenticate();
            console.log('Conectado ao banco de dados MySQL');
            
            return true;
        } catch (error) {
            console.error('Erro ao conectar ao banco:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.sequelize) {
            await this.sequelize.close();
            console.log('Desconectado do banco de dados');
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