import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseManager from '../config/database';
const sequelize = DatabaseManager.getInstance().getSequelize();

class Cliente extends Model<InferAttributes<Cliente>, InferCreationAttributes<Cliente>> {

    declare id: number;
    declare nome: string;
    declare cpf: string;
    declare senha: string;
    declare cidade: string;

}

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
        tableName: 'cliente'
    });

export default Cliente;