const { Model, DataTypes } = require('sequelize');
const atendente = require('./atendente');
const servicos = require('./servicos');

class Item extends Model() {

}

module.exports = (sequelize) => {
    Item.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        dataHora: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Item'
    });

    Item.hasMany(atendente, {
        foreignKey: "id",
    })

    Item.hasMany(servicos, {
        foreignKey: "id",
    })
}