import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { PlayersPokemon } from './PlayersPokemon';

export interface PokemonAttributes {
    id: number;
    species?: string;
    image?: string;
    def_weight?: string;
    def_income?: string;
    base_experience?: number;
    pokeapi_url?: string;
}

export interface PokemonCreationAttributes extends Optional<PokemonAttributes, 'id'> { }

export class Pokemon extends Model<PokemonAttributes, PokemonCreationAttributes> implements PokemonAttributes {
    declare id: number;
    declare species?: string;
    declare image?: string;
    declare def_weight?: string;
    declare def_income?: string;
    declare base_experience?: number;
    declare pokeapi_url?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare playersPokemon?: NonAttribute<PlayersPokemon[]>;
    declare static associations: {
        playersPokemon: Association<Pokemon, PlayersPokemon>;
    };

    static initialize(sequelize: Sequelize) {
        Pokemon.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                species: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                image: {
                    type: DataTypes.STRING(511),
                    allowNull: true,
                },
                def_weight: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: true,
                },
                def_income: {
                    type: DataTypes.DECIMAL(14, 2),
                    allowNull: true,
                },
                base_experience: {
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
                tableName: 'pokemon',
            }
        );
    }

    //static associate(_models: typeof models) {}
}