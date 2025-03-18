import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

class Servicos extends Model<InferAttributes<Servicos>, InferCreationAttributes<Servicos>> {
    declare id: number;
    declare nome: string;
    declare descricao: string;
    declare valor: number;
    declare tempoMedio: number;
}

export const inicializaServicos = (sequelize:Sequelize) => {
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
