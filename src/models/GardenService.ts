import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from "sequelize";
import type models from "../db";
import type { ActiveGardenService } from "./ActiveGardenService";

export interface GardenServiceAttributes {
    id: number;
    title?: string;
    price?: string;
    category?: string;
    int_value?: number;
    percent_value?: string;
    duration?: string;
}

export interface GardenServiceCreationAttributes
    extends Optional<GardenServiceAttributes, "id"> {}

export class GardenService extends Model<GardenServiceAttributes, GardenServiceCreationAttributes> implements GardenServiceAttributes {
    declare id: number;
    declare title?: string;
    declare price?: string;
    declare category?: string;
    declare int_value?: number;
    declare percent_value?: string;
    declare duration?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare activeGardenServices?: NonAttribute<ActiveGardenService[]>;
    declare static associations: {
        activeGardenServices: Association<GardenService, ActiveGardenService>;
    };

    static initialize(sequelize: Sequelize) {
        GardenService.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                title: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.DECIMAL(14, 2),
                    allowNull: true,
                },
                category: {
                    type: DataTypes.STRING(63),
                    allowNull: true,
                },
                int_value: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                },
                percent_value: {
                    type: DataTypes.DECIMAL(4, 2),
                    allowNull: true,
                    defaultValue: 0,
                },
                duration: {
                    type: DataTypes.TIME,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "gardenService",
            }
        );
    }

    // static associate(_models: typeof models) {}
}
