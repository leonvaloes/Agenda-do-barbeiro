const { Model, DataTypes } = require('sequelize');

class Cliente extends Model {

    async criarCliente(dados, transaction) {
        try {
            const clienteExistente = await this.Cliente.findOne({
                where: { cpf: dados.cpf }, transaction
            });

            if (clienteExistente) {
                throw new Error('400');
            }

            return await this.Cliente.create(dados, { transaction });

        }catch(e){
            throw error(e);
        } 
    }

    

}

module.exports = (sequelize) => {

    Cliente.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            unique: true,

        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cidade: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Cliente',
        freezeTableName: true
    });
    return Cliente;
};