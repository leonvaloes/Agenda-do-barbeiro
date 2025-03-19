const DatabaseManager= require('../config/database');
import Empresa from '../models/empresa';

class EmpresaController {

    sequelize: any;
    empresa: typeof Empresa;

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.empresa = require('../model/empresa')(this.sequelize);
    }

    async criarEmpresa(dados) {
        const transaction = await this.sequelize.transaction();

        try {
            const newEmpresa= await this.empresa.create(dados, {transaction})
            await transaction.commit();

            return newEmpresa;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    
    async atualizarEmpresa(id, dados) {
        const transaction = await this.sequelize.transaction();
        try {
            const empresa = await this.empresa.findByPk(id, { transaction });
            if (!empresa) {
                throw new Error('Empresa não encontrada');
            }

            await empresa.update(dados, { transaction });
            await transaction.commit();
            return empresa;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deletarEmpresa(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const empresa = await this.empresa.findByPk(id, { transaction });
            if (!empresa) {
                throw new Error('Empresa não encontrada');
            }

            await empresa.destroy({ transaction });
            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async listarEmpresas() {
        try {
            const empresas = await this.empresa.findAll();
            let data=[];
            empresas.map((empresa)=>{data.push(empresa.dataValues)});
            return data;
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports= EmpresaController;