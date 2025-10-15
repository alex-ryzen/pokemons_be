import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { Player } from './Player';

export interface InventoryAttributes {
    id: number;
    player_id?: number;
    item_id?: number;
    inv_pos_x?: number;
    inv_pos_y?: number;
    size?: number;
}

export interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id'> { }

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    declare id: number;
    declare player_id?: number;
    declare item_id?: number;
    declare inv_pos_x?: number;
    declare inv_pos_y?: number;
    declare size?: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    public player?: NonAttribute<Player>;
    public static associations: {
        player: Association<Inventory, Player>;
    };

    static initialize(sequelize: Sequelize) {
        Inventory.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                player_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    references: { model: 'Player', key: 'id' },
                },
                item_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                inv_pos_x: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                inv_pos_y: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'inventory',
            }
        );
    }

    //static associate(_models: typeof models) {}
}