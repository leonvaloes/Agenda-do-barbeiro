import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';

class Cliente extends Model<InferAttributes<Cliente>, InferCreationAttributes<Cliente>> {

    declare id: number;
    declare nome: string;
    declare cpf: string;
    declare senha: string;
    declare cidade: string;

}

export const inicializaCliente = (sequelize:Sequelize) => {

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

export default Cliente;