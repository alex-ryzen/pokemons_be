import { Model, DataTypes, Sequelize, type Optional } from 'sequelize';
import type models from '../db';

export interface TokenAttributes {
    id: number;
    user_id?: number;
    refresh_token?: string;
    expires_in?: Date;
}

export interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> { }

export class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
    declare id: number;
    declare user_id?: number;
    declare refresh_token?: string;
    declare expires_in?: Date;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    static initialize(sequelize: Sequelize) {
        Token.init(
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
                    //references: { model: 'User', key: 'id' },
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                },
                refresh_token: {
                    type: DataTypes.STRING(512),
                    allowNull: true,
                },
                expires_in: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: 'token',
            }
        );
    }

    //static associate(_models: typeof models) {}
}