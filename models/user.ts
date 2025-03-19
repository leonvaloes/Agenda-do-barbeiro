import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseManager from '../config/database';

const sequelize = DatabaseManager.getInstance().getSequelize();

interface UserInterface extends Model<InferAttributes<UserInterface>, InferCreationAttributes<UserInterface>> {
    id: number;
    nome: string;
    senha: string;
}

class User extends Model<InferAttributes<UserInterface>, InferCreationAttributes<UserInterface>> {
    declare id: number;
    declare nome: string;
    declare senha: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'cliente'
});

export default User;
