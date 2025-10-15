// schema for text with placeholders, like ${some_var} - regex replacement:  let newString = myString.replace(/\$\{(\w+)\}/g, (match, key) => {return replacements[key];});
import { Model, DataTypes, Sequelize, type Optional } from 'sequelize';

export interface ItemCardAttributes {
    id: number;
    category?: string;
    title?: string;
    description?: string;
}

export interface ItemCardCreationAttributes extends Optional<ItemCardAttributes, 'id'> { }

export class ItemCard extends Model<ItemCardAttributes, ItemCardCreationAttributes> implements ItemCardAttributes {
    declare id: number;
    declare category?: string;
    declare title?: string;
    declare description?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        ItemCard.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                category: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                title: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                description: {
                    type: DataTypes.STRING(511),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'itemCard',
            }
        );
    }
}