import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { User } from './User';
import type { PlayersPokemon } from './PlayersPokemon';
import type { Inventory } from './Inventory';
import type { Garden } from './Garden';

export interface PlayerAttributes {
    id: number;
    user_id?: number;
    balance?: number;
    individual_factor?: number;
    inventory_size?: number;
    inv_ext_price?: number;
}

export interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id'> { }

export class Player extends Model<PlayerAttributes, PlayerCreationAttributes> implements PlayerAttributes {
    declare id: number;
    declare user_id?: number;
    declare balance?: number;
    declare individual_factor?: number;
    declare inventory_size?: number;
    declare inv_ext_price?: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare user?: NonAttribute<User>;
    declare playersPokemon?: NonAttribute<PlayersPokemon[]>;
    declare inventory?: NonAttribute<Inventory[]>;
    declare garden?: NonAttribute<Garden>;

    declare static associations: {
        user: Association<Player, User>;
        playersPokemon: Association<Player, PlayersPokemon>;
        inventory: Association<Player, Inventory>;
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
                    references: { model: 'user', key: 'id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                },
                balance: {
                    type: DataTypes.DECIMAL(24, 2),
                    allowNull: true,
                },
                individual_factor: {
                    type: DataTypes.DECIMAL(4, 4),
                    allowNull: true,
                },
                inventory_size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                inv_ext_price: {
                    type: DataTypes.DECIMAL(12, 2),
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