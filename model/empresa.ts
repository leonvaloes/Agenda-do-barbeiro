import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import DatabaseManager from "config/database";
const sequelize = DatabaseManager.getInstance().getSequelize();



class Empresa extends Model<InferAttributes<Empresa>, InferCreationAttributes<Empresa>> {
    declare id: CreationOptional<number>;
    declare nome: string;
    declare email: string;
    declare cnpj: string;
    declare cidade: string;
    declare endereco: string;
    declare estado: string;
    declare telefone: string;
    declare senha: string;

}

Empresa.init({

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
}, {
    sequelize,
    tableName: 'empresa',
});


export default Empresa;
