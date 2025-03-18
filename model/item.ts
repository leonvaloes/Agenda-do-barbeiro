import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseManager from '../config/database';
const sequelize = DatabaseManager.getInstance().getSequelize();

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
    public id: number;
    public nome: string;
}

    Item.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "item",
        }
    );
    
export default Item;