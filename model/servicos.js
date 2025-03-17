const { Model, DataTypes } = require('sequelize');

class Servicos extends Model {}

module.exports = (sequelize) => {
    Servicos.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false
        },
        valor: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        tempoMedio: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Servicos'
    });

    return Servicos;
};
