import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseManager from '../config/database';
const sequelize = DatabaseManager.getInstance().getSequelize();
class Atendente extends Model<InferAttributes<Atendente>, InferCreationAttributes<Atendente>> {
    declare id: number;
    declare nome: string;
    declare cpf: string;
    declare senha: string;
}

    Atendente.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            cpf: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            senha: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'atendente',
        }
    );



export default Atendente;
