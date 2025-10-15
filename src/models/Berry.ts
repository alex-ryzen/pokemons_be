import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { GrowingBerry } from './GrowingBerry';

export interface BerryAttributes {
    id: number;
    name?: string;
    category?: string;
    image?: string;
    price?: number;
    level?: number;
    power?: number;
    growth_time?: number;
    max_harvest?: number;
    size?: number;
    smoothness?: number;
    soil_dryness?: number;
    pokeapi_url?: string;
}

export interface BerryCreationAttributes extends Optional<BerryAttributes, 'id'> { }

export class Berry extends Model<BerryAttributes, BerryCreationAttributes> implements BerryAttributes {
    declare id: number;
    declare name?: string;
    declare category?: string;
    declare image?: string;
    declare price?: number;
    declare level?: number;
    declare power?: number;
    declare growth_time?: number;
    declare max_harvest?: number;
    declare size?: number;
    declare smoothness?: number;
    declare soil_dryness?: number;
    declare pokeapi_url?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare growingBerries?: NonAttribute<GrowingBerry[]>;
    declare static associations: {
        growingBerries: Association<Berry, GrowingBerry>;
    };

    static initialize(sequelize: Sequelize) {
        Berry.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                category: {
                    type: DataTypes.STRING(63),
                    allowNull: true,
                    defaultValue: 'berry',
                },
                image: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: true,
                },
                level: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                power: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                growth_time: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                max_harvest: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                smoothness: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                soil_dryness: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                pokeapi_url: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'berry',
                indexes: [
                    {
                        fields: ['price', 'level', 'growth_time', 'max_harvest', 'size'],
                        name: 'Berry_index_0',
                    },
                ],
            }
        );
    }

    // static associate(_models: typeof models) { }
}