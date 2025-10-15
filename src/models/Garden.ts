import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { Player } from './Player';
import type { ActiveGardenService } from './ActiveGardenService';
import type { GrowingBerry } from './GrowingBerry';

export interface GardenAttributes {
    id: number;
    player_id?: number;
    garden_size?: number;
    growth_speed?: number;
}

export interface GardenCreationAttributes extends Optional<GardenAttributes, 'id'> { }

export class Garden extends Model<GardenAttributes, GardenCreationAttributes> implements GardenAttributes {
    declare id: number;
    declare player_id?: number;
    declare garden_size?: number;
    declare growth_speed?: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare player?: NonAttribute<Player>;
    declare activeGardenServices?: NonAttribute<ActiveGardenService[]>;
    declare growingBerries?: NonAttribute<GrowingBerry[]>;

    declare static associations: {
        player: Association<Garden, Player>;
        activeGardenServices: Association<Garden, ActiveGardenService>;
        growingBerries: Association<Garden, GrowingBerry>;
    };

    static initialize(sequelize: Sequelize) {
        Garden.init(
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
                garden_size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                growth_speed: {
                    type: DataTypes.DECIMAL(2, 2),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'garden',
            }
        );
    }

    // static associate(_models: typeof models) {}
}