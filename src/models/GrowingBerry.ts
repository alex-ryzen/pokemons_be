import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association } from 'sequelize';
import type models from '../db';
import type { Garden } from './Garden';
import type { Berry } from './Berry';

export interface GrowingBerryAttributes {
    id: number;
    garden_id?: number;
    berry_id?: number;
    status?: string;
    gar_pos_x?: number;
    gar_pos_y?: number;
    curr_size?: number;
    grow_start?: Date;
    grow_finish?: Date;
}

export interface GrowingBerryCreationAttributes extends Optional<GrowingBerryAttributes, 'id'> { }

export class GrowingBerry extends Model<GrowingBerryAttributes, GrowingBerryCreationAttributes> implements GrowingBerryAttributes {
    declare id: number;
    declare garden_id?: number;
    declare berry_id?: number;
    declare status?: string;
    declare gar_pos_x?: number;
    declare gar_pos_y?: number;
    declare curr_size?: number;
    declare grow_start?: Date;
    declare grow_finish?: Date;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    public garden?: NonAttribute<Garden>;
    public berry?: NonAttribute<Berry>;

    public static associations: {
        garden: Association<GrowingBerry, Garden>;
        berry: Association<GrowingBerry, Berry>;
    };

    static initialize(sequelize: Sequelize) {
        GrowingBerry.init(
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
                berry_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    //references: { model: 'Berry', key: 'id' },
                },
                status: {
                    type: DataTypes.STRING(63),
                    allowNull: true,
                    defaultValue: 'growing',
                },
                gar_pos_x: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                gar_pos_y: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                curr_size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                grow_start: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                grow_finish: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'growingBerry',
            }
        );
    }

    //static associate(_models: typeof models) {}
}