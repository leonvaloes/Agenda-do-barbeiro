import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
const cliente = require('./cliente');
const item = require('./item');

class Agendamento extends Model<InferAttributes<Agendamento>, InferCreationAttributes<Agendamento>> {
    declare id: number;
    declare clienteId: number;
    declare itemId: number;
}

export const inicializaAgendamento = (sequelize: Sequelize) => {
    Agendamento.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            clienteId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            itemId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'agendamento', // Corrigido o nome da tabela para 'agendamento'
        }
    );
};

// Relacionamentos
Agendamento.belongsTo(cliente, {
    foreignKey: 'clienteId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

Agendamento.hasMany(item, {
    foreignKey: 'itemId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

export default Agendamento;
