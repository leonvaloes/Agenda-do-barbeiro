const DataBaseManager = require('../config/database')

class AtendenteController{
     constructor() {
        const databaseManager = DatabaseManager.getInstance();
        this.sequelize = databaseManager.getSequelize();
        this.Atendente = require('../model/atendente')(this.sequelize);
    }

    async criarAtendente(dados){
        const transaction= await this.sequelize.transaction();

        try{
            const existe= await this.Atendente.findOne({where:{cpf: dados.cpf}, transaction});

            if(existe){
                throw new Error('400');
            }

            const cliente = await this.Cliente.create(dados,{transaction});
            await transaction.commit();
            return cliente

        }catch(e){
            await transaction.rollback();
            throw e;
        }
    }

    async atualizarAtendente(id,dados){
        const transaction= await this.sequelize.transaction();

        try{
            const atendente= await this.Atendente.findByPk(id,{transaction});
            if(!atendente){
                throw new Error('Atendente não encontrado');
            }

            await atendente.update(dados, {transaction});
            await transaction.commit();
            return atendente;
        }catch(e){
            await transaction.rollback();
            throw e;
        }
    }

    async deletarAtendente(id){
        const transaction=await this.sequelize.transaction();
        try{
            const atendente= await this.Atendente.finkByPk(id, {transaction});
            if(!atendente){
                throw new Error('Atendente não encontrado');
            }

            await atendente.destroy({transaction});
            await transaction.commit();
            return true;
        }catch(e){
            await transaction.rollback();
            throw e;
        }
    }

    async listarAtendentes(){
        try{
            const atendentes= await this.Atendente.findAll();
            const data=[];
            atendentes.map((atendentes)=>{data.push(atendentes.dataValues)});
            return data;
        }catch(e){
            throw e;
        }
    }
}

module.exports=AtendenteController;