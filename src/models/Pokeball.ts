import { Model, DataTypes, Sequelize, type Optional } from 'sequelize';

export interface PokeballAttributes {
    id: number;
    name?: string;
    category?: string;
    image?: string;
    price?: string;
    level?: number;
    chance?: string;
    pokeapi_url?: string;
}

export interface PokeballCreationAttributes extends Optional<PokeballAttributes, 'id'> { }

export class Pokeball extends Model<PokeballAttributes, PokeballCreationAttributes> implements PokeballAttributes {
    declare id: number;
    declare name?: string;
    declare category?: string;
    declare image?: string;
    declare price?: string;
    declare level?: number;
    declare chance?: string;
    declare pokeapi_url?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        Pokeball.init(
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
                    defaultValue: 'pokeball',
                },
                image: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                price: {
                    type: DataTypes.DECIMAL(14, 2),
                    allowNull: true,
                },
                level: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                chance: {
                    type: DataTypes.DECIMAL(4, 2),
                    allowNull: true,
                },
                pokeapi_url: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'pokeball',
                indexes: [{ fields: ['price', 'level'], name: 'Pokeball_index_0' }],
            }
        );
    }
}