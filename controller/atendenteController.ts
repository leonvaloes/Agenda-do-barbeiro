import DatabaseManager from '../config/database';
import Atendente from '../model/atendente'; // Importando corretamente a classe Atendente

class AtendenteController {
    sequelize: any;
    atendente: typeof Atendente; // Definindo o tipo corretamente

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.atendente = Atendente; // Atribuindo a classe Atendente
    }

    async createAtendente(atendenteData: any) {
        try {

            const transaction = await this.sequelize.transaction();
            const newAtendente = await this.atendente.create(atendenteData,{transaction}); // Usando o método create corretamente

            return newAtendente;
        } catch (error) {
            throw error;
        }
    }
}

export default AtendenteController;
