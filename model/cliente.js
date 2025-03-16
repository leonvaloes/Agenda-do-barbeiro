// models/Cliente.js
const { Model, DataTypes } = require('sequelize');


class Cliente extends Model {}

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
            unique:true,
        },
        senha:{
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