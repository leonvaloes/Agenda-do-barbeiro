const { Model, DataTypes } = require('sequelize');
const cliente =require('./cliente')
const item =require('./item')

class Agendamento extends Model() {

}


module.exports = (sequelize) => {
    Agendamento.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    }, {
        sequelize,
        modelName: 'agendamento'
    });

    Agendamento.hasOne(cliente, {
        foreignKey: "id",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    Agendamento.hasMany(item, {
        foreignKey: "id",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
}