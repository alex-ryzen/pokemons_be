import { Model, DataTypes, Sequelize, type Optional, Association, type NonAttribute } from 'sequelize';
import {v4 as uuid} from "uuid"
import type { Player } from './Player';

export interface UserAttributes {
    id: number;
    uuid?: string;
    username?: string;
    full_name?: string;
    email?: string;
    password?: string;
    image?: string;
    role?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare uuid?: string;
    declare username?: string;
    declare full_name?: string;
    declare email?: string;
    declare password?: string;
    declare image?: string;
    declare role?: string;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    declare player?: NonAttribute<Player>;

    declare static associations: { 
        player: Association<User, Player>; 
    };
    
    static initialize(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    unique: true,
                },
                uuid: {
                    type: DataTypes.UUID,
                    allowNull: true,
                    unique: true,
                },
                username: {
                    type: DataTypes.STRING(127),
                    allowNull: true,
                },
                full_name: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                    defaultValue: ""
                },
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: true,
                },
                image: {
                    type: DataTypes.STRING(511),
                    allowNull: true,
                    defaultValue: ""
                },
                role: {
                    type: DataTypes.STRING(127),
                    allowNull: true,
                    defaultValue: "user"
                }
            },
            {
                sequelize,
                tableName: 'user',
                indexes: [{ fields: ['uuid'], name: 'User_index_0' }],
            }
        );
    }
    //static associate(_models: typeof models) {  }
}