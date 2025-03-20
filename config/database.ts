import { Sequelize } from 'sequelize';

class DatabaseManager {
    private static instance: DatabaseManager;
    private sequelize: Sequelize;

    private static dbConfig = {
        database: 'meubanco',
        username: 'user',
        password: 'userpassword',
        host: '127.0.0.1',
        dialect: 'mysql' as const
    };

    private constructor() {
        this.sequelize = new Sequelize(
            DatabaseManager.dbConfig.database,
            DatabaseManager.dbConfig.username,
            DatabaseManager.dbConfig.password,
            {
                dialect: DatabaseManager.dbConfig.dialect,
                host: DatabaseManager.dbConfig.host,
                logging: false // Pode ativar se quiser logs detalhados
            }
        );
    }

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public async connect(): Promise<void> {
        try {
            await this.sequelize.authenticate();
            console.log('✅ Conectado ao banco de dados MySQL');

            await this.sequelize.sync();

            console.log('✅ Modelos sincronizados com o banco de dados');
        } catch (error) {
            console.error('❌ Erro ao conectar ao banco:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        await this.sequelize.close();
        console.log('🔌 Desconectado do banco de dados');
    }

    public getSequelize(): Sequelize {
        return this.sequelize;
    }
}

export = DatabaseManager;
