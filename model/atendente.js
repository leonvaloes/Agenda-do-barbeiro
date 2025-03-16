const { Model, DataTypes } = require('sequelize');


class Atendente extends Model{}

module.exports=(sequelize)=>{

    Atendente.init({
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
            unique:true,
            allowNull: false
        },
        senha:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Atendente',
        freezeTableName: true
    });

    return Atendente;
}