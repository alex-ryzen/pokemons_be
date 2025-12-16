import { Model, DataTypes, Sequelize, type Optional, type NonAttribute, Association, type BelongsToCreateAssociationMixin, type BelongsToCreateAssociationMixinOptions } from 'sequelize';
import type models from '../db';
import type { Player } from './Player';
import { uppercaseFirst } from '../utils/helpers';
import type { Berry } from './Berry';
import type { Pokeball } from './Pokeball';

export type Item = Berry | Pokeball

export interface InventoryItemAttributes {
    id: number;
    player_id?: number;
    item_id?: number;
    item_type?: string;
    inv_pos_x?: number;
    inv_pos_y?: number;
    size?: number;
    isGrown?: boolean;
}

export interface InventoryItemCreationAttributes extends Optional<InventoryItemAttributes, 'id'> { }

export class InventoryItem extends Model<InventoryItemAttributes, InventoryItemCreationAttributes> implements InventoryItemAttributes {
    declare id: number;
    declare player_id?: number;
    declare item_id?: number;
    declare item_type?: string;
    declare inv_pos_x?: number;
    declare inv_pos_y?: number;
    declare size?: number;
    declare isGrown?: boolean;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;

    public berry?: NonAttribute<Berry | null>;
    public pokeball?: NonAttribute<Pokeball | null>;
    public item?: NonAttribute<Item | null>

    public player?: NonAttribute<Player>;
    public static associations: {
        player: Association<InventoryItem, Player>;
        item: Association<InventoryItem, Item>;
    };

    declare getBerry: BelongsToCreateAssociationMixin<Berry>;
    declare getPokeball: BelongsToCreateAssociationMixin<Pokeball>;

    public getInventoryItem(options?: BelongsToCreateAssociationMixinOptions): Promise<Item | null> {
        if (!this.item_type) return Promise.resolve(null);
        const mixinMethodName = `get${uppercaseFirst(this.item_type)}` as keyof this;
        const mixinMethod = this[mixinMethodName] as Function
        return mixinMethod.call(this, options) as Promise<Item | null>;
    }

    static initialize(sequelize: Sequelize) {
        InventoryItem.init(
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
                    //references: { model: 'Player', key: 'id' },
                },
                item_id: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                item_type: {
                    type: DataTypes.STRING(63),
                    allowNull: true,
                },
                inv_pos_x: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                inv_pos_y: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                size: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                isGrown: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'inventoryItem',
                hooks: {
                    afterFind: useInventoryItemAfterFind
                }
            }
        );
    }

    //static associate(_models: typeof models) {}
}

export const useInventoryItemAfterFind = (result: InventoryItem[] | InventoryItem | null) => {
    if (!result) return;
    const resultArray = Array.isArray(result) ? result : [result]
    for (const item of resultArray) {
        if (item instanceof InventoryItem && item.item_type) {
            if (item.item_type === "berry" && item.berry) {
                item.item = item.berry
                delete item.berry // item.berry = null
            }
            else if (item.item_type === "pokeball" && item.pokeball) {
                item.item = item.pokeball
                delete item.pokeball // item.pokeball = null
            }
        }
    }
}