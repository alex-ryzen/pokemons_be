import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { Pokemon } from './Pokemon';
import type { Player } from './Player';

export interface PlayersPokemonAttributes {
    id: number;
    pokemon_id?: number;
    player_id?: number;
    name?: string;
    weight?: number;
    income?: number;
    summary?: number;
    age?: number;
}

export interface PlayersPokemonCreationAttributes extends Optional<PlayersPokemonAttributes, 'id'> { }

export class PlayersPokemon extends Model<PlayersPokemonAttributes, PlayersPokemonCreationAttributes> implements PlayersPokemonAttributes {
    declare id: number;
    declare pokemon_id?: number;
    declare player_id?: number;
    declare name?: string;
    declare weight?: number;
    declare income?: number;
    declare summary?: number;
    declare age?: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare pokemon?: NonAttribute<Pokemon>;
    declare player?: NonAttribute<Player>;

    declare static associations: {
        pokemon: Association<PlayersPokemon, Pokemon>;
        player: Association<PlayersPokemon, Player>;
    };

    static initialize(sequelize: Sequelize) {
        PlayersPokemon.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                pokemon_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    //references: { model: 'Pokemon', key: 'id' },
                },
                player_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    //references: { model: 'Player', key: 'id' },
                },
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                weight: {
                    type: DataTypes.DECIMAL(10, 2),
                    allowNull: true,
                },
                income: {
                    type: DataTypes.DECIMAL(14, 2),
                    allowNull: true,
                },
                summary: {
                    type: DataTypes.DECIMAL(26, 2),
                    allowNull: true,
                },
                age: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'playersPokemon',
            }
        );
    }

    //static associate(_models: typeof models) {}
}