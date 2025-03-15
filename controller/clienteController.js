const DatabaseManager = require('../config/database');

class ClienteController {
    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.Cliente = require('../models/Cliente')(this.sequelize);
    }

    async criarCliente(dados) {
        const transaction = await this.sequelize.transaction();
        try {
            const cliente = await this.Cliente.create(dados, { transaction });
            await transaction.commit();
            return cliente.getDadosFormatados();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async atualizarCliente(id, dados) {
        const transaction = await this.sequelize.transaction();
        try {
            const cliente = await this.Cliente.findByPk(id, { transaction });
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            await cliente.update(dados, { transaction });
            await transaction.commit();
            return cliente.getDadosFormatados();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deletarCliente(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const cliente = await this.Cliente.findByPk(id, { transaction });
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            await cliente.destroy({ transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = ClienteController;