const DatabaseManager = require('../config/database')
import Servico from '../model/item'

class ServicoController{
    sequelize: any;
    servico: typeof Servico;

    constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.servico = require('../model/item')(this.sequelize);
    }

    async criarServico(dados) {
        const transaction = await this.sequelize.transaction();

        try {
            const newServico= await this.servico.create(dados, {transaction})
            await transaction.commit();

            return newServico;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    
    async atualizarServico(id, dados) {
        const transaction = await this.sequelize.transaction();
        try {
            const servico = await this.servico.findByPk(id, { transaction });
            if (!servico) {
                throw new Error('Serviço não encontrado');
            }

            await servico.update(dados, { transaction });
            await transaction.commit();
            return servico;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deletarServico(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const servico = await this.servico.findByPk(id, { transaction });
            await servico.destroy({ transaction });
            await transaction.commit();
            return servico;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async listarServicos(){
        try{
            const servicos= await this.servico.findAll();
            let data=[];
            servicos.map((servico)=>{data.push(servico.dataValues)});
            return data;
            
        }catch(e){
            throw e;
        }
    }
}

module.exports= ServicoController;