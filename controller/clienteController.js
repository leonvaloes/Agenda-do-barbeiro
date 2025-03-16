const DatabaseManager = require('../config/database');

class ClienteController {
    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.Cliente = require('../model/cliente')(this.sequelize);
    }

    async criarCliente(dados) {
        const transaction = await this.sequelize.transaction();
        try {
            const clienteExistente = await this.Cliente.findOne({ 
                where: { cpf: dados.cpf }, transaction 
            });
    
            if (clienteExistente) {
                throw new Error('400');
            }
    
            const cliente = await this.Cliente.create(dados, { transaction });
            await transaction.commit();
            return cliente;
    
        } catch (error) {
            await transaction.rollback();
            throw error; // Lançando erro, que será capturado na rota
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
            return cliente;
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

    async listarClientes() {
        try {
            const clientes = await this.Cliente.findAll();
            let data=[];
            clientes.map((cliente)=>{data.push(cliente.dataValues)});
            return data;
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ClienteController;