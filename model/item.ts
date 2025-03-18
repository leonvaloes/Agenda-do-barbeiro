import { DataTypes, Model, Sequelize } from "sequelize";


type ItemAttributes = {
    id: number;
    dataHora: Date;
}

class Item extends Model<ItemAttributes> {
    static initItemModel = (sequelize:Sequelize) => {
        Item.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            dataHora: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'item'
        });
    }
}
export default Item;