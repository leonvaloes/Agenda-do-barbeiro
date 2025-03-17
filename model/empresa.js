const { Model, DataTypes } = require('sequelize');
const atendente = require('./atendente');

class Empresa extends Model { }

module.exports = (sequelize) => {

    Empresa.init({
        //+ Nome: String
        // + Email: String
        // + Numero: String
        // + CNPJ: String
        // + Cidade: Stringing

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cnpj: {
            type: DataTypes.STRING,
            unique: true
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cidade: {
            type: DataTypes.STRING,
            allowNull: false
        },
        endereco: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Empresa.hasMany(atendente,{
        foreignKey:"id",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

}