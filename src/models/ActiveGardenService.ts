import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { Garden } from './Garden';
import type { GardenService } from './GardenService';

export interface ActiveGardenServiceAttributes {
    id: number;
    garden_id?: number;
    garden_service_id?: number;
    start?: Date;
}

export interface ActiveGardenServiceCreationAttributes extends Optional<ActiveGardenServiceAttributes, 'id'> { }

export class ActiveGardenService extends Model<ActiveGardenServiceAttributes, ActiveGardenServiceCreationAttributes> implements ActiveGardenServiceAttributes {
    declare id: number;
    declare garden_id?: number;
    declare garden_service_id?: number;
    declare start?: Date;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare garden?: NonAttribute<Garden>;
    declare gardenService?: NonAttribute<GardenService>;

    declare static associations: {
        garden: Association<ActiveGardenService, Garden>;
        gardenService: Association<ActiveGardenService, GardenService>;
    };

    static initialize(sequelize: Sequelize) {
        ActiveGardenService.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                garden_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    //references: { model: 'Garden', key: 'id' },
                },
                garden_service_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    //references: { model: 'GardenService', key: 'id' },
                },
                start: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'activeGardenService',
            }
        );
    }

    // static associate(_models: typeof models) {  }
}