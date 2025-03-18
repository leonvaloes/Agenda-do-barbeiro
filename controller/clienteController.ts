const DatabaseManager = require('../config/database');
import Cliente from '../model/cliente';

class ClienteController {

    sequelize: any;
    cliente: typeof Cliente;

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.cliente = require('../model/cliente')(this.sequelize);
    }

    async criarCliente(dados) {
        const transaction = await this.sequelize.transaction();

        try {
            const newCliente= await this.cliente.create(dados, {transaction})
            await transaction.commit();

            return newCliente;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    
    async atualizarCliente(id, dados) {
        const transaction = await this.sequelize.transaction();
        try {
            const cliente = await this.cliente.findByPk(id, { transaction });
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }

            await cliente.update(dados, { transaction });
            await transaction.commit();
            return cliente;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deletarCliente(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const cliente = await this.cliente.findByPk(id, { transaction });
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

    async listarClientes() {
        try {
            const clientes = await this.cliente.findAll();
            let data=[];
            clientes.map((cliente)=>{data.push(cliente.dataValues)});
            return data;
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ClienteController;