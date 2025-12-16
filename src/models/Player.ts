import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { User } from './User';
import type { PlayersPokemon } from './PlayersPokemon';
import type { InventoryItem } from './InventoryItem';
import type { Garden } from './Garden';

export interface PlayerAttributes {
    id: number;
    user_id?: number;
    balance?: string;
    total_income?: string;
    individual_factor?: string;
    inventory_size?: number;
    inv_ext_price?: string;
}

export interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id'> { }

export class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
    declare id: number;
    declare user_id?: number;
    declare balance?: string;
    declare total_income?: string;
    declare individual_factor?: string;
    declare inventory_size?: number;
    declare inv_ext_price?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare user?: NonAttribute<User>;
    declare playersPokemon?: NonAttribute<PlayersPokemon[]>;
    declare inventory?: NonAttribute<InventoryItem[]>;
    declare garden?: NonAttribute<Garden>;

    declare static associations: {
        user: Association<Player, User>;
        playersPokemon: Association<Player, PlayersPokemon>;
        inventory: Association<Player, InventoryItem>;
        garden: Association<Player, Garden>;
    };

    static initialize(sequelize: Sequelize) {
        Player.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    //references: { model: 'user', key: 'id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                },
                balance: {
                    type: DataTypes.DECIMAL(26, 2),
                    allowNull: true,
                },
                total_income: {
                    type: DataTypes.DECIMAL(22, 2),
                    allowNull: true,
                    defaultValue: "0.00"
                },
                individual_factor: {
                    type: DataTypes.DECIMAL(6, 4),
                    allowNull: true,
                },
                inventory_size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                inv_ext_price: {
                    type: DataTypes.DECIMAL(14, 2),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'player',
            }
        );
    }

    //static associate(_models: typeof models) {    }
}